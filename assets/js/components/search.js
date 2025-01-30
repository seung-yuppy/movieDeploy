// http://www.omdbapi.com/?apikey=2d7b9efb

import api from "../base/api.js";
import { fetchType, fetchSearch, fetchYear } from "../base/param.js";
import { get } from "../base/util.js";

export const formEl = get(".form");
export const filterEl = get(".input");
export const yearEl = get(".select-year");
export const typeEl = get(".select-type");
export const btn = get(".btn-search");

export let searchParam = fetchSearch();
export let year = fetchYear();
export let type = fetchType();
export let page = 1;

export function buttonEvent() {
    formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        searchPoint();
    });
}

export function searchPoint() {
    try {
        const value = filterEl.value.trim();

        // 선택된 값이 all이 아니면 선택된 값을 가져온다.
        const year = yearEl.value !== "all" ? yearEl.value : "all";
        const type = typeEl.value !== "all" ? typeEl.value : "all";

        // 페이지 이동하면서 파라미터 값도 전달
        // let newUrl = `https://2eebyeonghyun.github.io/Est5movie/public/result.html?search=${encodeURIComponent(value)}`;
        let newUrl = `${api.GIT_URL}/public/result.html?search=${encodeURIComponent(value)}`;

        if (year) {
            newUrl += `&year=${encodeURIComponent(year)}`;
        }

        if (type) {
            newUrl += `&type=${encodeURIComponent(type)}`;
        }

        if (!value) {
            alert("검색어를 입력해주세요.");
            return;
        }

        // 페이지를 이동한다.
        window.location.href = newUrl;
    } catch (error) {
        alert("에러가 발생했습니다.");
    }
}

export function initializePage() {
    try {
        // 파라미터 값을 읽어온다.
        const searchParam = fetchSearch();
        const year = fetchYear();
        const type = fetchType();
        let page = 1;

        // 값이 있을 경우 검색 실행
        if (searchParam) {
            // 검색 결과 가져오기
            loadMovies(searchParam, year, type, page);
        }
    } catch (error) {
        alert("에러가 발생했습니다.");
    }
}

export async function getMovies(value, year, type, page) {
    try {
        if (filterEl) {
            // 결과값 초기화
            filterEl.innerHTML = "";
        }

        // encodeURIComponent 사용이유 : URI로 데이터를 정확하게 전달하기 위해서 문자열을 인코딩하기 위해 사용
        let url = `${api.BASE_URL}?apikey=${api.API_KEY}&s=${encodeURIComponent(value)}&page=${page}`;

        if (year) {
            url += `&y=${year}`;
        }

        if (type !== "all") {
            url += `&type=${type}`;
        } else if (type === "all") {
            url += `&t=${type}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.Search) {
            return data;
        } else {
            errorPage(data);
        }
    } catch (error) {
        console.error("error", error);
        alert(error.message);
    }
}

function renderMovies(movies) {
    // error영역 display:none 처리
    const errorCard = get(".wrapper-errormessage");
    errorCard.style = "display:none";
    // 검색결과영역 보이게 처리 후 초기화
    const itemCard = get(".itemcontainer-cardlist");
    itemCard.style = "";
    // itemCard.innerHTML = "";

    // 검색결과영역 반복문을 통해서 card 삽입
    movies.forEach((movie) => {
        // 리스트 중 한개의 카드영역을 위한 div 생성
        const movieCard = document.createElement("li");
        movieCard.className = "itemcontainer-card";

        // 포스터 사진이 있으면 좀 더 좋은 화질의 사진으로 대체 없으면 대체 이미지 삽입
        let Highposter;
        if (movie.Poster !== "N/A") {
            Highposter = movie.Poster.replace("SX300", "SX3000");
        } else {
            Highposter = `${api.GIT_URL}/assets/images/poster-NotAvailable.png`;
        }

        // 카드영역 코드
        movieCard.innerHTML = `
        <a href="${api.GIT_URL}/public/inner-view.html?id=${movie.imdbID}" class="card-item">
            <div class="imgBox-img" style="background: url(${Highposter}) no-repeat; background-size: cover; width: 25rem; height: 55rem;"></div>
            <div class="result-informationBox">
                <h2 class="informationBox-title movie-title">${movie.Title}</h2>
                <ul class="informationBox-subList">
                    <li class="subList-item"><span class="informationBox-title type-text type-text-${movie.Type}">${movie.Type}</span></li>
                    <li class="subList-item"><span class="informationBox-title movie-year">${movie.Year}</span></li>
                </ul>
            </div>
        </a>
        `;
        itemCard.appendChild(movieCard);
    });
}

export async function loadMovies(searchParam, year, type, page) {
    try {
        const response = await getMovies(searchParam, year, type, page);
        renderMovies(response.Search);
        moreMovies(searchParam, year, type, page);
    } catch (error) {
        console.log(error.message);
    }
}

function errorPage(data) {
    // 카드 영역이 grid로 분할하였기 때문에 에러메시지 창은 grid 영역이 아닌 기존 div에 보여주기 위해 display:none처리
    const cardSection = get(".wrapper-itemcontainer");
    cardSection.style = "display:none";
    // 에러 영역을 보이게 처리 후 에러 메시지 출력
    const errorSection = get(".wrapper-errormessage");
    errorSection.style = "";
    errorSection.innerHTML = `<span class="row-title item-title">${data.Error}</span>`;
    const moreBtn = get(".itemcontainer-btn");
    moreBtn.style = "display:none";
}

async function moreMovies(searchParam, year, type, page) {
    const response = await getMovies(searchParam, year, type, page);
    let count = response.totalResults;
    const moreBtn = get(".itemcontainer-btn");
    if (count > 10) {
        moreBtn.addEventListener("click", async () => {
            page++;
            let maxPage = Math.ceil(count / 10);
            const movies = await getMovies(searchParam, year, type, page);
            renderMovies(movies.Search);
            console.log(page, maxPage);
            if (page >= maxPage) { // 마지막 페이지 판별
                moreBtn.style = "display:none";
                console.log("last page!");
            }
        });
    } else if (count < 10) {
        moreBtn.style = "display:none";
        console.log("last page!");
    }
}