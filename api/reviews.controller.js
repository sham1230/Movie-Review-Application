import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {
    //method to post a review to application 
    static async apiPostReview(req, res, next) {
        //figure out whether or not to create a movie id since its not in mongo database
        try {
            const movieID = req.body.movie_id
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date()

            const ReviewResponse = await ReviewsDAO.addReview(
                movieID,
                userInfo,
                review,
                date,
            )
            res.json({status: "success"})
        } catch(e) {
            res.status(500).json({error: e.message })
        }
    }
    // update user review 
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewID = req.body.review_id
            const text = req.body.text 
            const date = new Date()

            // create a variable that allows to create a review response 
            const ReviewResponse = await ReviewsDAO.updateReview(
                reviewID,
                req.body.user_id,
                text,
                date, 
            )
            var { error } = ReviewResponse
            if (error) {
                res.status(400).json({error})
            }
            if (ReviewResponse.modifiedCount == 0) {
                throw new Error(
                    "unable to update review - user may not be original poster"
                )
            }

            res.json({ status: "success" })
        } catch(e) {
            res.status(500).json({ error: e.message})
        }
    }
    // method to delete a review 
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewID = req.query.id
            const userID = req.body.user_id
            console.log(reviewID)
            const ReviewReponse = await ReviewsDAO.deleteReview(
                reviewID,
                userID,

            )
            res.json({status: "success"})
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    }
}