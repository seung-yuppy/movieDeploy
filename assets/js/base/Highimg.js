export function getPoster(poster) {
    let highPoster;
    if (movie.Poster !== '') {
        highPoster = movie.Poster.replace("SX300", "SX3000");
    }
    return highPoster;
}