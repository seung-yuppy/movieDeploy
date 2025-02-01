import { get } from '../base/util.js';

export function scrollHeader() {
    
    let lastScrollTop = 0;
    const headerWrap = get('.header');
    
    // passive: true를 사용하면 preventDefault()를 사용할 수 없다.
    // 다만, 스크롤 성능이 개선이된다. 
    // 그래서 scroll 이벤트를 사용할 때 사용하면 좋다.
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > lastScrollTop && scrollY > 100) {
            headerWrap.style.transform = "translateY(-100%)";
        } else {
            headerWrap.style.transform = "translateY(0)";
        }

        headerWrap.classList.toggle('scroll', scrollY > 50);

        lastScrollTop = scrollY;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        if (e.clientY <= 100) {
            headerWrap.style.transform = "translateY(0)";
        }
    }, { passive: true });
}
