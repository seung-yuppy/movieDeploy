import { get } from "./util.js";
import { loadHeader } from "../components/loadHF.js";
import { searchPoint } from "../components/search.js";
import { scrollHeader } from "../components/scrollHeader.js";

// 이벤트처리를 따로 분류했더니 중복이벤트오류가 발생하여 이벤트는 한 곳에서 호출
export async function initializeEvents() {

    try {
        await loadHeader();
        scrollHeader();
    
        // 서치 검색 영역
        const formEl = get(".form");

        formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            searchPoint();
        });


        // 다크모드 영역
        const button = document.querySelector(".btn-change");

        // 초기 theme 가져오기
        let theme = localStorage.getItem('mode');
        let status = theme === 'dark';
        
        // 시스템 설정에 따른 초기 모드 설정
        const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (theme === null) {
            // localStorage에 theme이 없으면 시스템 설정을 따름
            status = systemDarkMode;
            theme = systemDarkMode ? 'dark' : 'light';
            localStorage.setItem("mode", theme);
        }
        
        if (status) {
            themeDarkMode();
        } else {
            themeLightMode();
        }
        
        // 버튼 클릭 이벤트
        button.addEventListener('click', () => {
            if (status) {
                themeLightMode();
            } else {
                themeDarkMode();
            }
        });
        
        // 다크 모드 적용
        function themeDarkMode() {
            localStorage.setItem("mode", "dark");
            document.documentElement.setAttribute('data-mode', 'dark');
            status = true;
        }
        
        // 라이트 모드 적용
        function themeLightMode() {
            localStorage.setItem("mode", "light");
            document.documentElement.setAttribute('data-mode', 'light');
            status = false;
        }
    } catch (error) {
        console.error('error', error);
    }
    
}
