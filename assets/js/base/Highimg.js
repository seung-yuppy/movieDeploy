export function getPoster(poster) {
    let highPoster;
    if (movie.Poster !== '') {
        highPoster = movie.Poster.replace("SX300", "SX300");
    }
    return highPoster;
}