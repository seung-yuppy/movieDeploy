import api from "../base/api.js";
import { buttonEvent, initializePage } from '../components/search.js';
import { darkMode } from '../components/dark-mode.js';
import { get } from '../base/util.js';
import { loadHeader, loadFooter } from "../components/loadHF.js";


// 메인 슬라이드
async function mainSlide() {

    try {
        // json폴더의 main.json 호출
        // const res = await fetch('../assets/json/main.json');
        const res = await fetch(`${api.GIT_URL}/assets/json/main.json`);
        const data = await res.json();
        const movies = data.movies;

        const slideBox = get('.mainSwiper .swiper-wrapper');

        // li 생성후 내용 만들기
        movies.forEach(movie => {
            const item = document.createElement('li');
            item.classList.add('swiper-slide');

            item.innerHTML = 
            `
                <div class="movie-imgBox">
                    <img src="${api.GIT_URL}/assets/json/main.json/${movie.Poster}">
                </div>
                <div class="movie-informationBox">
                    <h2 class="movie-title">${movie.Title}</h2>
                    <div class="movie-categoryBox">
                        <p class="movie-category">Type :</p>
                        <span class="movie-category">${movie.Genre}</span>
                    </div>
                    <ul class="movie-ratingBox">
                        <li class="rating-row">
                            <div class="rating-logo">
                                <img src="${api.GIT_URL}/assets/images/logo-imdb.svg" alt="Internet Movie Database 로고">
                            </div>
                            <p class="rating-value">${movie.Ratings[0].Value}</p>
                        </li>
                        <li class="rating-row">
                            <div class="rating-logo">
                                <img src="${api.GIT_URL}/assets/images/logo-tomato.svg" alt="Rotten Tomatoes 로고">
                            </div>
                            <p class="rating-value">${movie.Ratings[1].Value}</p>
                        </li>
                    </ul>

                    <p class="movie-description">${movie.Plot}</p>
                    <a href="${api.GIT_URL}/public/inner-view.html?id=${movie.imdbID}" class="btn-click" aria-label="영화 정보">More Info</a>
                </div>
            `;

            // slideBox의 자식 요소로 뿌리기
            slideBox.appendChild(item);

            // swiper 슬라이드 효과주기
            const swiper = new Swiper(".mainSwiper", {
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                navigation: {
                    nextEl: ".main-page .swiper-option .swiper-navigation .swiper-button-next",
                    prevEl: ".main-page .swiper-option .swiper-navigation .swiper-button-prev",
                },
            });
        })
    } catch (error) {
        console.error('에러 발생:', error.message);
    }
}

// 하단부 인기영화시리즈 버튼 만들기
function popularSeries() {
    const slideBox2 = get('.mainBotSwiper .swiper-wrapper');

    // 영화 제목 배열화
    const popularMovies = ['Avengers', 'Spider-Man', 'Harry Potter', 'Frozen', 'Transformers', 'Dune', 'Home Alone'];

    // 버튼 구성하기
    popularMovies.forEach((movie) => {
        const slideList = document.createElement('li');
        slideList.classList.add('swiper-slide', 'popular-item');

        slideList.innerHTML = 
        `
            <a href="${api.GIT_URL}/public/result.html?search=${encodeURIComponent(movie)}&year=all&type=all">${movie}</a>
        `;

        slideBox2.appendChild(slideList);
    });

    // swiper 슬라이드로 만들기
    const swiper2 = new Swiper(".mainBotSwiper", {
        slidesPerView: 7,
        spaceBetween: 30,
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 15,
            },
            1024: {
                slidesPerView: 5,
            },
            1300: {
                slidesPerView: 7,
            }
        }
    });
}

loadFooter();
buttonEvent();
initializePage();
darkMode();
mainSlide();
popularSeries();