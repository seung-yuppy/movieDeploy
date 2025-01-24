import api from "../base/api.js";

export async function loadHeader() {
    try {
        const res = await fetch(`../../../components/header.html`);
        const data = await res.text();
        
        const header = document.querySelector('.header');

        if (header) {
            header.innerHTML = data;
        } 

    } catch (error) {
        console.error('error:', error);
    }
}

export async function loadFooter() {
    try {
        const res = await fetch(`../../../components/footer.html`);
        const data = await res.text();
        
        const footer = document.querySelector('.footer');

        if (footer) {
            footer.innerHTML = data;
        } 

    } catch (error) {
        console.error('error:', error);
    }
}