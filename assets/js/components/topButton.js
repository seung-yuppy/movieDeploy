import { get } from '../base/util.js';

export function topButton() {
    window.addEventListener("scroll", function () {
        const main = get('main');
        let topButton = get('.topButton-box');

        // topButton이 존재하는 확인 후 없으면 아래 내용 만들기
        if(!topButton) {
            topButton = document.createElement('div');
            topButton.classList.add('topButton-box');

            topButton.innerHTML = 
            `
                <a href="#" class="btn-top" aria-label="상단 이동 버튼"></a>
            `;

            main.appendChild(topButton);
        }

        // y축으로 50px 이동하면 scroll 클래스 추가
        if (window.scrollY > 50) {
            topButton.classList.add("scroll");
        } else {
            topButton.classList.remove("scroll");
        }
    });
}
