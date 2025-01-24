export function getPoster(poster) {
    let highPoster;
    if (movie.Poster !== '') {
        highPoster = movie.Poster.replace("SX3000", "SX3000");
    }
    return highPoster;
}