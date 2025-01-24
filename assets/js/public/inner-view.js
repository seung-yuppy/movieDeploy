import api from "../base/api.js";
import { get } from "../base/util.js";
import { buttonEvent } from "../components/search.js";
import { darkMode } from "../components/dark-mode.js";
import { loadFooter } from "../components/loadHF.js";

const movieContainer = get("#movie-container");

async function getActorProfile(actor) {
    try {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `${api.TMDB_KEY}`,
            },
        };

        const response = await fetch(`https://api.themoviedb.org/3/search/person?query=${actor}&include_adult=false&language=en-US&page=1`, options);
        const data = await response.json();
        return data.results[0].profile_path;
    } catch (error) {
        console.error(error.message);
    }
}

async function getMovieTMDBID(movieId) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `${api.TMDB_KEY}`,
        },
    };
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-KO', options`, options);
    const data = await response.json();
    console.log(data.id);
    if (!data.id) {
        return null;
    }
    return data.id;
}

async function getSimilarMovie(movieId) {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `${api.TMDB_KEY}`,
        },
    };
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`, options);
    const data = await response.json();
    console.log(data.results);
    return data.results;
}

function getMovieId(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 영화 데이터를 가져오는 함수
async function fetchMovieDetails() {
    try {
        // 영화의 id값을 가져와 저장한다.
        const movieId = getMovieId("id");

        // 정보가 없다면 에러창을 띄운다.
        if (!movieId) {
            throw new Error("영화 정보를 찾을 수 없습니다.");
        }

        const response = await fetch(
            `${api.BASE_URL}?apikey=${api.API_KEY}&i=${movieId}`
        ); // OMDb API 호출
        const movie = await response.json(); // JSON 데이터로 변환

        const movieimdbID = movie.imdbID;
        const movieTMDBID = await getMovieTMDBID(movieimdbID); // TMDBID값 가져오기
        console.log(movieTMDBID);
        let similarImgArr = [];
        if (!movieTMDBID) {
            for (let i = 1; i <= 9; i++) {
                similarImgArr.push(`${api.GIT_URL}/assets/images/poster-NotAvailable.png`);
            }
        } else {
            const allIMG = await getSimilarMovie(movieTMDBID);

            for (let i = 1; i <= 9; i++) {
                similarImgArr.push(`https://image.tmdb.org/t/p/w500/${allIMG[i].poster_path}`);
            }
        }
        console.log(similarImgArr);
        let movieActors = movie.Actors.split(",");

        let imgArr = [];
        for (let i of movieActors) {
            imgArr.push(getActorProfile(i));
        }
        // getActorProfile함수가 비동기적으로 반환되므로, return 직후에는 결과를 직접 사용할 수 없습니다. 그래서 Promise.all이 없으면 promise상태인 배열로 콘솔에 작성된다.
        let actorImages = await Promise.all(imgArr);

        // 영화 해상도 고해상도로 변경
        let Highposter;
        if (movie.Poster !== "N/A") {
            Highposter = movie.Poster.replace("SX300", "SX300");
        } else {
            Highposter = "/assets/images/poster-NotAvailable.png";
        }

        // 유튜브링크
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
            movie.Title
        )}+trailer`;

        // 데이터를 HTML 구조로 렌더링
        movieContainer.innerHTML = `
        <div class="movie-detail-content">
            <div class="detail-leftBox">
                <div class="movie-img">
                    <img src="${Highposter}" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'" />
                </div>

                <div class="movie-options">
                    <ul>
                        <li class="option-item">
                            <a href="#none">
                                <button type="button" class="option-img btn-favorite"></button>
                                <span class="option-title">Favorite</span>
                            </a>
                        </li>
                        <li class="option-item">
                            <a href="#none">
                                <button type="button" class="option-img btn-later"></button>
                                <span class="option-title">Watch Later</span>
                            </a>
                        </li>
                        <li class="option-item">
                            <a href="#none">
                                <button type="button" class="option-img btn-watched"></button>
                                <span class="option-title">Watched</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="detail-rightBox">
                <div class="movie-detailsBox">
                    <div class="movie-title">${movie.Title}</div>
                    <a href="${youtubeUrl}" target="_blank" class="btn-click" aria-label="예고편">WATCH</a>
                    
                    <div class="detail-row">
                        <span class="detail-text">STORYLINE</span>
                        <p class="movie-description">${movie.Plot}</p>
                    </div>

                    <div class="detail-row">
                        <span class="detail-text">movie information</span>
                        <div class="movie-informationBox">
                            <div class="movie-meta"><strong class="movie-infoTitle">평점</strong><p class="movie-text">${movie.imdbRating}</p></div>
                            <div class="movie-yeaer"><strong class="movie-infoTitle">년도</strong><p class="movie-text">${movie.Year}</p></div>
                            <div class="movie-meta"><strong class="movie-infoTitle">장르</strong><p class="movie-text">${movie.Genre}</p></div>
                            <div class="movie-meta"><strong class="movie-infoTitle">배우</strong><p class="movie-text">${movie.Actors}</p></div>
                            <div class="movie-meta"><strong class="movie-infoTitle">감독</strong><p class="movie-text">${movie.Director}</p></div>
                        </div>
                    </div>
                </div>

                <div class="movie-actors">
                    <span class="detail-text">actors</span>
                    <ul class="actors-list">
                        <li class="actors-item">
                            <img class="actors-img" src="https://image.tmdb.org/t/p/w500${actorImages[0]}"/>
                            <p class="actors-name">${movieActors[0]}</p>
                        </li>

                        <li class="actors-item">
                            <img class="actors-img" src="https://image.tmdb.org/t/p/w500${actorImages[1]}"/>
                            <p class="actors-name">${movieActors[1]}</p>
                        </li>

                        <li class="actors-item">
                            <img class="actors-img" src="https://image.tmdb.org/t/p/w500${actorImages[2]}"/>
                            <p class="actors-name">${movieActors[2]}</p>
                        </li>
                    </ul>
                </div>

                <div class="another-series">
                    <span class="detail-text">similar movies</span>
                    
                    <div class="another-slideBox">
                        <div class="swiper anotherSwiper">
                            <ul class="swiper-wrapper">
                                <li class="swiper-slide"><a href="#none"><img src="${similarImgArr[0]}" alt="${movie.Actors} Poster" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'"/></a></li>
                                <li class="swiper-slide"><a href="#none"><img src="${similarImgArr[1]}" alt="${movie.Actors} Poster" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'"/></a></li>
                                <li class="swiper-slide"><a href="#none"><img src="${similarImgArr[2]}" alt="${movie.Actors} Poster" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'"/></a></li>
                                <li class="swiper-slide"><a href="#none"><img src="${similarImgArr[3]}" alt="${movie.Actors} Poster" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'"/></a></li>
                                <li class="swiper-slide"><a href="#none"><img src="${similarImgArr[4]}" alt="${movie.Actors} Poster" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'"/></a></li>
                                <li class="swiper-slide"><a href="#none"><img src="${similarImgArr[5]}" alt="${movie.Actors} Poster" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'"/></a></li>
                                <li class="swiper-slide"><a href="#none"><img src="${similarImgArr[6]}" alt="${movie.Actors} Poster" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'"/></a></li>
                                <li class="swiper-slide"><a href="#none"><img src="${similarImgArr[7]}" alt="${movie.Actors} Poster" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'"/></a></li>
                                <li class="swiper-slide"><a href="#none"><img src="${similarImgArr[8]}" alt="${movie.Actors} Poster" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'"/></a></li>
                            </ul>
                        </div>

                        <div class="swiper-option">
                            <div class="swiper-navigation">
                                <div class="swiper-button-prev"><button type="button" class="btn-prev" aria-label="이전"></button></div>  
                                <div class="swiper-button-next"><button type="button" class="btn-next" aria-label="다음"></button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

        // swiper 슬라이드로 만들기
        const swiper = new Swiper(".anotherSwiper", {
            slidesPerView: 5,
            spaceBetween: 30,
            loop: true,
            navigation: {
                nextEl: ".another-series .swiper-option .swiper-navigation .swiper-button-next",
                prevEl: ".another-series .swiper-option .swiper-navigation .swiper-button-prev",
            },
            breakpoints: {
                320: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                },
                1024: {
                    slidesPerView: 2,
                },
                1500: {
                    slidesPerView: 5,
                },
            },
        });
    } catch (error) {
        movieContainer.innerHTML = `<p>영화 정보를 불러오지 못하고 있습니다. 잠시만 기다려주세요.</p>`;
        console.error("영화 정보를 못불러옵니다.:", error);
    }
}

loadFooter();
buttonEvent();
darkMode();
fetchMovieDetails();
