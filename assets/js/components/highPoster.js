export function getHighPoster(poster) {
    if (poster !== "N/A") {
        return poster.replace("SX300", "SX3000");
    } else {
        return "/assets/images/poster-NotAvailable.png";
    }
}