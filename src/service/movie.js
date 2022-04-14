import http from "../http-common"

class MovieServiceData {
    //request to get all pages, essentially the same as movies/ which retrieves all movies from server 
    getAll(page = 0) {
        return http.get(`http://localhost:5000/api/v1/movies?page=${page}`);
    }
    // request to get the id 
    get(id) {
        return http.get(`http://localhost:5000/api/v1/movies/id/${id}`);
    }
    //request to find the specific type of movie based on the query type and number of page 
    //will add the following to the base URL through get request 
    find(query, by = "title", page = 0) {
        return http.get(`?${by}=${query}&page=${page}`);
    }
    //request to create review and will add the following to the base URL 
    createReview(data) {
        return http.post("/review", data);
    }
    //request to delete review based on id 
    deleteReview(id) {
        return http.delete(`/review?id=${id}`);
    }
    getGenres(id) {
        return http.get(`/genres`);
    }

    getYears(id) {
        return http.get(`/years`);
    }
}
export default new MovieServiceData();