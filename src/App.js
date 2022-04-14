import React from "react";
import { Switch, Route, Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css";


import AddReview from "./components/add-review";
import Movies from "./components/movies";
import MoviesList from "./components/movies-list";
import Login from "./components/login";


function App() {
  const [user, setUser ] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null)
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/movies" className="navbar-brand text-light">
          MovieBox Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item"> 
              <Link to={"/movies"} className="nav-link">
                  Movies
              </Link>
          </li>
          <li className="nav-item">
            {user ? (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (
            <Link to ={"/login"} className="nav-link">
                Login
            </Link>
            )}


          </li>
        </div>
      </nav>

      <div className ="container mt-3">
        <Switch>
          <Route exact path={["/", "/movies"]} component={MoviesList}/>
          <Route
            path="/movies/:id/review"
            render={(props) => (
              <AddReview {...props} user={user}/>
            )}
          />
          <Route
            path="/movies/:id"
            render={(props) => (
              <Movies {...props} user={user}/>
            )}
          />
          <Route
            path="/login"
            render={(props) => (
              <Login {...props} login={login} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
