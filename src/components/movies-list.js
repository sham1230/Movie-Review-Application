/* eslint-disable jsx-a11y/alt-text */
import React, {useState, useEffect } from "react";
import MovieDataService from "../service/movie";
import { Link } from "react-router-dom";


const MoviesList = props => {
    const [movies, setMovies] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const [years, setYears] = useState(["All Years"]);
    const [searchGenres, setSearchGenres] = useState("");
    const [genres, setGenres] = useState(["All Genres"]);

    useEffect(() => {
        retrieveMovies();
        retrieveGenres();
    }, []);

    const ChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const ChangeSearchYear = e => {
        const searchYear = e.target.value;
        setSearchYear(searchYear);
    };

    const ChangeSearchGenres = e => {
        const searchGenres = e.target.value;
        setSearchGenres(searchGenres);
    };

    const retrieveMovies = () => {
        MovieDataService.getAll()
            .then(response => {
                console.log(response.data);
                setMovies(response.data.movies);
            })
            .catch(e => {
                console.log(e);
            });
    };
    
    const retrieveYears = () => {
        MovieDataService.getYears()
         .then(response => {
             console.log(response.data);
             setYears(["All Years"].concat(response.data));
         })
         .catch(e => {
            console.log(e);
         });
    };

    const retrieveGenres = () => {
        MovieDataService.getGenres()
        .then(response => {
            console.log(response.data);
            setGenres(["All Genres"].concat(response.data));
        })
        .catch(e => {
            console.log(e);
        });
    };

    const refreshList = () => {
        retrieveMovies();
    };

    const find = (query, by) => {
        MovieDataService.find(query, by) 
         .then(response => {
             console.log(response.data);
             setMovies(response.data.movies);
         })
         .catch(e => {
             console.log(e);
         });
    };

    const findByTitle = () => {
        find(searchTitle, "title")
    };

    const findByYear = () => {
        if (searchYear === "All Years") {
            refreshList();
        } else {
            find(searchYear, "year")
        }
    };

    const findByGenres = () => {
        if (searchGenres === "All Genres") {
            refreshList();
        } else {
            find(searchGenres, "genres")
        }
    };

    return (
        <div>
            <div className="row pb-1">
                <div className="input-group col-lg-4">
                    <input
                     type="text"
                     className="form-control"
                     placeholder="Search by title"
                     value={searchTitle}
                     onChange={ChangeSearchTitle}
                    />
                    <div>
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={findByTitle}
                      >
                          Search
                      </button>
                    </div>
                </div>
                <div className="input-group col-lg-4">

                    <select onChange={ChangeSearchGenres}>
                        {genres.map(genres => {
                            return (
                                <option value ={genres}> {genres.substr(0, 20)}</option>
                            )
                        })}
                    </select>
                    <div className="input-group-append">
                        <button
                          className="btn btn-outline-primary"
                          type="button"
                          onClick={findByGenres}
                        >
                           Search
                        </button>
                    </div>
                </div>
                <div className="input-group col-lg-4">
                    <select onChange={ChangeSearchYear}>
                        {years.map(year => {
                            return (
                                <option value={year}> {year.substr(0, 20)} </option>
                            )
                        })}
                    </select>
                    <div className="input-group-append">
                        <button
                          className="btn btn-outline-primary"
                          type="button"
                          onClick={findByYear}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
        {movies.map((movie) => {
          return (
            <div className="col-lg-3 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">
                    <img src={movie.poster} className="card-img-top"></img><br/>
                    <strong>Year: </strong>{movie.year}<br/>
                    <strong>Genres: </strong>{movie.genres.join(", ")}<br/>
                    
                  </p>
                  <div className="row">
                  <Link to={"/movies/"+movie._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Reviews
                  </Link>
                  <a target="_blank" href={"https://www.google.com/maps/place/" + movie.poster} className="btn btn-primary col-lg-5 mx-1 mb-1">View Poster</a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    );


};
export default MoviesList;