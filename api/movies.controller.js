import MoviesDAO from "../dao/moviesDAO.js"

export default class MoviesController {
    static async apiGetMovies(req, res, next) {
        //get at least 20 movies imported per page
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10): 0
        //create a filter variable that gets the filter inputted by the front end user 
        let filters = {}
        if (req.query.genres) {
            filters.genres = req.query.genres
        }
        else if (req.query.year) {
            filters.year = req.query.year
        }
        else if (req.query.title) {
            filters.title = req.query.title
        }
        //variables to retrieve a list of Movies as well as getting a total value of movies from database
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
            filters,
            page,
            moviesPerPage
        })
        //create a json response that gets the number of movies, pages, filter type, entries per page, and the total results
        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies


        }
        res.json(response)
    }
    //method to get movie by its ID 
    static async apiGetMoviesById(req, res, next) {
        try {
            let id = req.params.id || {}
            let movie = await MoviesDAO.getMoviesByID(id)
            if (!movie) {
                res.status(404).json({ error: "Not found" })
                return
            } 
            res.json(movie)
        } catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }

    }
    // method to get movies by genres 
    static async apiGetMoviesByGenres(req, res, next) {
        try {
            let genres = await MoviesDAO.getGenres()
            res.json(genres)
        } catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
    //method to get all the years based on movie 
    static async apiGetMovieYears(req, res, next) {
        try {
            let year = await MoviesDAO.getYears()
            res.json(year)
        } catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e })
        }
    }
}