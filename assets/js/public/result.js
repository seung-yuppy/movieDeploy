import { loadHeader, loadFooter } from "../components/loadHF.js";
import { initializeEvents } from '../base/eventHandler.js';
import { initializePage } from "../components/search.js";
import { getAll } from "../base/util.js";
import { fetchSearch, fetchType, fetchYear } from "../base/param.js";
import { topButton } from '../components/topButton.js';

export const initWeb = () => {
    loadHeader();
    loadFooter();
    initializeEvents();
    initializePage();
    topButton();
};

document.addEventListener("DOMContentLoaded", () => {
    let searchValue = fetchSearch();
    let yearValue = fetchYear();
    let genreValue = fetchType();

    // 장르와 제목을 각각 checkbox하기
    const yearRadio = getAll(".yearlist-yearchk");
    const genreRadio = getAll(".genrelist-genrechk");

    checkMovie(yearRadio, yearValue);
    checkMovie(genreRadio, genreValue);

    // 검색창입력 -> 검색 영화 출력 -> 체크박스로 검색 영화 필터
    function checkMovie(radios, targetValue) {
        radios.forEach((radio) => {
            if (radio.value === targetValue) {
                radio.checked = true;
            }
            radio.addEventListener("click", (e) => {
                // name을 통해서 genre와 year 구분해서 getMovies를 실행
                const name = e.target.name;
                const value = e.target.value;

                if (name === "genre") {
                    genreValue = value;
                    updateUrl(searchValue, yearValue, genreValue);
                } else if (name === "year") {
                    yearValue = value;
                    updateUrl(searchValue, yearValue, genreValue);
                }
            });
        });
    }

    // 라디오버튼 변경하면 리다이렉트하고 URL주소 변경
    // 선택된 라디오의 value값이 파라미터로 전달되고 페이지가 새로고침이 된다.
    function updateUrl(search, year, genre) {
        const urlParams = new URLSearchParams(window.location.search);

        // 쿼리 매개변수 업데이트
        urlParams.set("search", search || "all");
        urlParams.set("year", year || "all");
        urlParams.set("type", genre || "all");

        // 현재 URL 업데이트
        const newURL = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
        window.location.href = newURL;
    }
});

initWeb();