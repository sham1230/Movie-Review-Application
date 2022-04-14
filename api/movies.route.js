import express from "express"
import MoviesCtrl from "./movies.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

const router = express.Router()

router.route("/").get(MoviesCtrl.apiGetMovies)
router.route("/id/:id").get(MoviesCtrl.apiGetMoviesById)
router.route("/genres").get(MoviesCtrl.apiGetMoviesByGenres)
router.route("/years").get(MoviesCtrl.apiGetMovieYears)

//crate router to post, update and delete a review for a movie router 
router 
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

// potentially add a feature to be able to add a user selected movie into the mongodb atlas database.
export default router 
