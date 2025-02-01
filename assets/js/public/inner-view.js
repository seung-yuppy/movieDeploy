import api from "../base/api.js";
import { get } from "../base/util.js";
import { loadHeader, loadFooter } from "../components/loadHF.js";
import { initializeEvents } from '../base/eventHandler.js';
import { initializePage } from "../components/search.js";
import { topButton } from '../components/topButton.js';
import { getHighPoster } from "../components/highPoster.js";
import { SwiperGroup } from '../components/swiperGroup.js';

export const initWeb = () => {
    loadHeader();
    loadFooter();
    initializeEvents();
    initializePage();
    topButton();
};

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
        return data;
    } catch (error) {
        console.error(error.message);
    }
}

async function getMovieTMDBID(movieId) {

    try {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `${api.TMDB_KEY}`,
            },
        };
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-KO', options`, options);
        const data = await response.json();
        if (!data.id) {
            return null;
        }
        return data.id;
        
    } catch (error) {
        console.error('error', error);
    }
}

async function getSimilarMovie(movieId) {

    try {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `${api.TMDB_KEY}`,
            },
        };
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`, options);
        const data = await response.json();
        // 2025-01-25 추가 작업
        const similarData = data.results;

        // imdb_id값 가져오기
        const getImdbID = await Promise.all(similarData.map(async (movie) => {
            const detailResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}`, options);
            const detailData = await detailResponse.json();
            // 기존 데이터에 imdb_id값을 더한다.
            return {...movie, imdb_id: detailData.imdb_id};
        }));
        
        return getImdbID;
        
    } catch (error) {
        console.error('error', error);
    }
}

function getMovieId(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
 
// 영화 데이터를 가져오는 함수
async function fetchMovieDetails() {
    try {
        movieContainer.innerHTML = 
        `
            <div class="spinner-box">
                <div class="spinner-img"></div>
            </div>
        `;

        // 1.5초 동안 위에 코드를 보여준다.
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 영화의 id값을 가져와 저장한다.
        const movieId = getMovieId("id");

        const response = await fetch(`${api.BASE_URL}?apikey=${api.API_KEY}&i=${movieId}`); // OMDb API 호출
        const movie = await response.json(); // JSON 데이터로 변환

        const movieimdbID = movie.imdbID;
        const movieTMDBID = await getMovieTMDBID(movieimdbID); // TMDBID값 가져오기

        // 추천 영화 영화데이터 가져오기
        let similarArray = [];
        if (movieTMDBID) {
            const allIMG = await getSimilarMovie(movieTMDBID);
            // 비슷한 영화를 최대 10개까지 보이도록 한다.
            // 참/거짓을 통해 값을 불러온다.
            // filter를 통해 해당 내용이 있는 영화만 가져온다.
            similarArray = allIMG.slice(0, 9).map(movie => ({
                image: movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : `${api.GIT_URL}/assets/images/poster-NotAvailable.png`,
                title: movie.original_title ? movie.original_title : '',
                imdb_id: movie.imdb_id ? movie.imdb_id : ''
            })).filter(movie => movie.title && movie.imdb_id);
        }


        // let movieActors = movie.Actors.split(",");
        // 만약 movie.Actors에 값이 없으면 빈 배열로 만든다.
        let movieActors = movie.Actors ? movie.Actors.split(',') : [];

        let imgArr = [];
        let actorArr = [];
    
        for (let i of movieActors) {
            imgArr.push(await getActorProfile(i));
        } 
        
        for(let i = 0; i < movieActors.length; i++) {
            if(movieActors[i] !== "N/A" && imgArr[i].total_results > 0) {
                actorArr.push({
                    image : imgArr[i].results[0].profile_path ? `https://image.tmdb.org/t/p/w500/${imgArr[i].results[0].profile_path}` : `${api.GIT_URL}/assets/images/poster-NotAvailable.png`,
                    name: imgArr[i].results[0].name ? imgArr[i].results[0].name : '',
                });         
            } else if(imgArr[i].total_results === 0) {
                actorArr.push({
                    image : `${api.GIT_URL}/assets/images/poster-NotAvailable.png`, 
                    name: movieActors[i]
                });
            }
        }

        // getActorProfile함수가 비동기적으로 반환되므로, return 직후에는 결과를 직접 사용할 수 없습니다. 그래서 Promise.all이 없으면 promise상태인 배열로 콘솔에 작성된다.
        let actorImages = actorArr;

        // 영화 해상도 고해상도로 변경
        const Highposter = getHighPoster(movie.Poster);

        // 유튜브링크
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title)}+trailer`;

        // 데이터를 HTML 구조로 렌더링
        movieContainer.innerHTML = `
        <div class="movie-detail-content">
            <div class="detail-leftBox">
                <h2 class="a11y-hidden">영화 이미지 영역</h2>
                <div class="movie-img">
                    <img src="${Highposter}" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'" />
                </div>

                <h2 class="a11y-hidden">옵션 선택 영역</h2>
                <div class="movie-options">
                    <ul>
                        <li class="option-item">
                            <a href="#none">
                                <button type="button" class="option-img btn-favorite" aria-label="관심영화"></button>
                                <span class="option-title">Favorite</span>
                            </a>
                        </li>
                        <li class="option-item">
                            <a href="#none">
                                <button type="button" class="option-img btn-later" aria-label="나중에보기"></button>
                                <span class="option-title">Watch Later</span>
                            </a>
                        </li>
                        <li class="option-item">
                            <a href="#none">
                                <button type="button" class="option-img btn-watched" aria-label="이미 본 영화"></button>
                                <span class="option-title">Watched</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <h2 class="a11y-hidden">영화 소개 영역</h2>
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

                <h2 class="a11y-hidden">영화 출연배우 영역</h2>
                <div class="movie-actors">
                    <span class="detail-text">actors</span>
                    <ul class="actors-list">
                        ${actorImages.map(actor => `<li class="actors-item"><img class="actors-img" src="${actor.image}"/><p class="actors-name">${actor.name}</p></li>`).join('')}
                    </ul>
                </div>

                <h2 class="a11y-hidden">추천 영화 영역</h2>
                <div class="another-series">
                    <span class="detail-text">similar movies</span>
                    
                    <div class="another-slideBox">
                        <div class="swiper anotherSwiper">
                            <ul class="swiper-wrapper">
                                ${similarArray.map(movie => 
                                `
                                    <li class="swiper-slide">
                                        <a href="${api.GIT_URL}/public/inner-view.html?id=${movie.imdb_id}">
                                            <img src="${movie.image}" alt="${movie.title} Poster" onerror="this.src='${api.GIT_URL}/assets/images/poster-NotAvailable.png'"/>
                                        </a>
                                    </li>
                                `).join('')}
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
        SwiperGroup();
    } catch (error) {
        movieContainer.innerHTML = 
        `
            <h2 class="a11y-hidden">에러페이지 영역</h2>
            <div class="error-box">
                <div class="spinner-img"></div>
                <p class="error-text">영화 정보를 불러오지 못하고 있습니다. 잠시만 기다려주세요.</p>
            </div>
        `;
        console.error("영화 정보를 못불러옵니다.:", error);
    }
}

initWeb();
fetchMovieDetails();
