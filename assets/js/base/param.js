// URLSearchParams객체에서 window.location.search는 ?뒤의 쿼리스트링을 가져옴
export const fetchSearch = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get("search");
    return search;
};

export const fetchYear = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const year = urlParams.get("year");
    return year;
};

export const fetchType = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    return type;
};

export const fetchId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    return id;
};
