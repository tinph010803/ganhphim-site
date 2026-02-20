const RATING_P = {id: 1, title: "P", note: "Mọi lứa tuổi"}
const RATING_K = {id: 2, title: "K", note: "Dưới 13 tuổi"}
const RATING_T13 = {id: 3, title: "T13", note: "13 tuổi trở lên"}
const RATING_T16 = {id: 4, title: "T16", note: "16 tuổi trở lên"}
const RATING_T18 = {id: 5, title: "T18", note: "18 tuổi trờ lên"}

const movieRatingList = () => {
  return [
    RATING_P,
    RATING_K,
    RATING_T13,
    RATING_T16,
    RATING_T18
  ]
}

const getMovieRating = (id) => {
  return movieRatingList().find(el => el.id === Number(id))
}

export {
  movieRatingList,
  getMovieRating,
}