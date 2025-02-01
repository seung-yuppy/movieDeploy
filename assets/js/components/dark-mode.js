import { get } from '../base/util.js';
import { loadHeader } from "./loadHF.js";

export async function initDarkMode() {

    try {
        await loadHeader();
    
        const button = get('.btn-change');
        let theme = localStorage.getItem('mode'); // 초기 theme 가져오기
        let status = false;
    
        if (theme === 'dark') {
            themeDarkMode();
        } else if (theme === 'light') {
            themeLightMode();
        }
    
        // 버튼 클릭 이벤트
        button.addEventListener('click', () => {
            if (!status) {
                themeDarkMode();
            } else {
                themeLightMode();
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
        console.error('error : ', error);
    }
}