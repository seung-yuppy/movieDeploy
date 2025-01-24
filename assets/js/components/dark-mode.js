import { get } from '../base/util.js';

export function darkMode() {
    const button = get('.btn-change');
    const theme = localStorage.getItem('mode');
    let status = false;

    // 사용자 테마를 읽어온다.
    document.addEventListener('DOMContentLoaded', () => {
        if (theme === 'dark') {
            darkMode();
        } else if (theme === 'light') {
            lightMode();
        }
    });

    // 버튼 클릭 이벤트
    button.addEventListener('click', () => {
        if (status === false) {
            darkMode();
        } else if (status === true) {
            lightMode();
        }
    });

    // 다크/라이트 전환이벤트
    function darkMode() {
        localStorage.setItem("mode", "dark");
        document.documentElement.setAttribute('data-mode', 'dark');
        status = true;
    };

    function lightMode() {
        localStorage.setItem("mode", "light");
        document.documentElement.setAttribute('data-mode', 'light');
        status = false;
    };
}

