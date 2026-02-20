const REVIEWS_10 = {point: 10, title: "Tuyệt vời", image: "/images/reviews/rate-5.webp",icon:"😍"}
const REVIEWS_8 = {point: 8, title: "Phim hay", image: "/images/reviews/rate-4.webp",icon:"😘"}
const REVIEWS_6 = {point: 6, title: "Khá ổn", image: "/images/reviews/rate-3.webp",icon:"😊"}
const REVIEWS_4 = {point: 4, title: "Phim chán", image: "/images/reviews/rate-2.webp",icon:"😔"}
const REVIEWS_2 = {point: 2, title: "Dở tệ", image: "/images/reviews/rate-1.webp",icon:"🤮"}

const reviewsList = () => {
  return [
    REVIEWS_10,
    REVIEWS_8,
    REVIEWS_6,
    REVIEWS_4,
    REVIEWS_2
  ]
}

const getTitleOfReviews = (point) => {
  const reviews = reviewsList().find(el => el.point === Number(point))
  if (reviews) return reviews.title

  return "N/A"
}

const getReviews = (point) => {
  return reviewsList().find(el => el.point === Number(point))
}

export {
  reviewsList,
  getTitleOfReviews,
  getReviews
}