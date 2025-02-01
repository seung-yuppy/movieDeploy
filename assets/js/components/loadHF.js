import api from "../base/api.js";
import { get } from "../base/util.js";

export async function loadHeader() {
    try {
        const res = await fetch(`${api.GIT_URL}/components/header.html`);
        const data = await res.text();
        
        const header = get('.header');

        // 헤더가 있으면 데이터 값을 넣는다.
        if (header) {
            header.innerHTML = data;
        }

        const selectYear = get('.select-year');

        // 현재연도와 시작연도를 만든다.
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 50;

        // 옵션값을 만든다.
        const selectOption = document.createElement("option");
        selectOption.value = "all";
        selectOption.textContent = "전체";
        selectYear.appendChild(selectOption);

        // 연도 옵션값 만들기
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            selectYear.appendChild(option);
        }

    } catch (error) {
        console.error('error:', error);
    }
}

export async function loadFooter() {
    try {
        const res = await fetch(`${api.GIT_URL}/components/footer.html`);
        const data = await res.text();
        
        const footer = document.querySelector('.footer');

        if (footer) {
            footer.innerHTML = data;
        } 

    } catch (error) {
        console.error('error:', error);
    }
}