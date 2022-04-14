import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return 
        }
        try {
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection("reviews")
        } catch(e) {
            console.error(`Unable to establish collection handles in userDAO`)
        }
    }
    //reviews not appearing in review array, fix 
    static async addReview(movieID, user, review, date) {
        try {
            const reviewDOC = {name: user.name,
                user_id: user._id, 
                date: date, 
                text: review,
                movie_id: ObjectId(movieID),
                 }
            return await reviews.insertOne(reviewDOC)
            } catch(e) {
                console.error(`Unable to post review: ${e}`)
                return { error: e}
            }
        }
        // method to update user review
        static async updateReview(reviewID, userID, text, date) {
            try {
                const updateResponse = await reviews.updateOne (
                    // find the following review the matches id
                    {user_id: userID, _id: ObjectId(reviewID)},
                    {$set: {text: text, date:date}}
                )
                return updateResponse
            } catch(e) {
                console.error(`Unable to update review: ${e}`)
                return {error: e}
            }
        }

        static async deleteReview(reviewID, userID) {

            try {
                // delete the review based on the following user id
                const deleteResponse = await reviews.deleteOne({
                    _id: ObjectId(reviewID),
                    user_id: userID,
                })
            return deleteResponse
            } catch(e) {
                console.error(`Unable to delete review ${e}`)
                return {error: e}
            }
        }
 }