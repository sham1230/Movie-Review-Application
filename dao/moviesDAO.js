import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let movies 

export default class MoviesDAO {
    static async injectDB(conn) {
        // if movies are already filled, then return movie variable 
        if (movies) {
            return
        }
        //fill the movie variable by referencing the database
        try {
            movies = await conn.db(process.env.MOVIESREVIEW_NS).collection("movies")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in moviesDAO: ${e}`
            )
        }
    }

    static async getMovies({
        filters = null, 
        page = 0,
        moviesPerPage = 20,
        
    } = {}) {
        // create a query variable based on the search filter user selects in get request 
        let query 
        if (filters) {
            // if filtered based on title search
            if ("title" in filters) {
                query = {$text: {$search: filters["title"] } }
            // if filtered based on genres 
            } else if ("genres" in filters) {
                query = {"genres": {$eq: filters["genres"] } }
            // if filtered based on year of movie release
            } else if ("year" in filters) {
                query = {"year": {$eq: filters["year"] } }
            }
        }
        let cursor

        try {
            cursor = await movies
                .find(query)
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0 }
        }

        const displayCursor = cursor.limit(moviesPerPage).skip(moviesPerPage * page)

        try {
            const moviesList = await displayCursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)

            return {moviesList, totalNumMovies}
        } catch(e) {
            console.error (
                `Unable to convert cursor to array or issue counting documents, ${e}`
            )
            return {moviesList: [], totalNumMovies: 0 }
        }
    }
    //method to get movies by ID
    static async getMoviesByID(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                    {
                        $lookup: {
                            from: "reviews",
                            let: {
                                id: "$_id"
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$movie_id", "$$id"],

                                        },
                                    },
                                },
                                {
                                    $sort: {
                                        date: -1,
                                    },
                                },
                            ],
                            as: "reviews",
                        },
                    },
                    {
                        $addFields: {
                            reviews: "$reviews",
                        },
                    },
            ]
        return await movies.aggregate(pipeline).next()
        } catch(e) {
            console.error(`Something went wrong in getMoviesByID: ${e}`)
            throw e 
        }
    }
    //function called from api folder that gets a list of all unique genres
    static async getGenres() {
        let genres = []
        try {
            genres = await movies.distinct("genres")
            return genres
        } catch(e) {
            console.error(`Unable to get genres, ${e}`)
            return genres
        }
    }
    //function called from api folder that gets a list of all unique year nums
    static async getYears() {
        let years = []
        try {
            years = await movies.distinct("year")
            return years
        } catch(e) {
            console.error(`Unable to get years, ${e}`)
            return years
        }
    }

}