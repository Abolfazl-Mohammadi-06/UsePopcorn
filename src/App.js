///////////////////////
////////S10 E17////////
///////////////////////

import {use, useEffect, useState} from "react";
import StarRating from "./starRating";




const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "23a9a4e5"

export default function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    // const [watched, setWatched] = useState([]);
    const [watched, setWatched] = useState(function () {
        const storedValue = localStorage.getItem("watched");
        return storedValue ? JSON.parse(storedValue) : [];
    });

    useEffect(() => {
        localStorage.setItem("watched",JSON.stringify(watched));

    }, [watched]);


    useEffect(function () {

        const controller = new AbortController();

        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("")

                const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query} `,
                    {signal: controller.signal});


                if (!res.ok) throw new Error("something went wrong");
                const data = await res.json();

                if (data.Response === "False") throw new Error("Movie not found");

                setMovies(data.Search)
                // console.log(data.Search)
                setError("")
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.log(err.message)
                    setError(err.message)
                }
            } finally {
                setIsLoading(false);
            }


        }

        if (query.length < 3) {
            setMovies([]);
            setError("")
            return
        }
        handleCloseMovie();
        fetchMovies();


        return function () {
            controller.abort();
        }

    }, [query])

    function handleSelectMovie(id) {
        setSelectedId(selectedId => id === selectedId ? null : id);
    }

    function handleCloseMovie() {
        setSelectedId(null);
    }

    function handelAddWatch(movie) {
        setWatched((watched) => [...watched, movie]);

        // localStorage.setItem("watched", JSON.stringify([...watched, movie]));

    }

    function handelDeleteWatch(id) {
        setWatched(watched.filter(movie => movie.imdbID !== id))
    }

    return (
        <>
            <NavBar>
                <Search query={query} setQuery={setQuery}/>
                <NumResults movies={movies}/>
            </NavBar>

            <Main hasMovieDetails={selectedId}>
                <Box>
                    {/*{ isLoading?<Loader/>:<MovieList movies={movies}/>}*/}
                    {isLoading && <Loader/>}
                    {!isLoading && !error && <MovieList onSelectMovie={handleSelectMovie} movies={movies}/>}
                    {error && <ErrorMessage message={error}/>}
                </Box>
                <Box>

                    {selectedId ? <MovieDetails onCloseMovie={handleCloseMovie} selectedId={selectedId}
                                                onAddWatched={handelAddWatch}
                                                watched={watched}/> : <>
                        <WatchedSummary watched={watched}/>
                        <WatchedMovieList watched={watched} onDeleteWatched={handelDeleteWatch}/></>
                    }
                </Box>
            </Main>
        </>
    )
        ;
}

function Loader() {
    return <p className="loader">Loading...</p>
}

function ErrorMessage({message}) {
    return <p className="error">
        <span>⛔</span>{message}
    </p>;
}

function NavBar({children}) {

    return <nav className="nav-bar">
        <Logo/>
        {children}
    </nav>

}

function Logo() {
    return <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
    </div>

}

function Search({query, setQuery}) {

    return <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
    />
}

function NumResults({movies}) {
    return <p className="num-results">
        Found <strong>{movies.length}</strong> results
    </p>
}


function Main({children, hasMovieDetails}) {


    return <main className={hasMovieDetails ? "main main-revers" : "main"}>
        {children}

    </main>
}


function Box({children}) {
    const [isOpen, setIsOpen] = useState(true);

    return <div className="box">
        <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
        >
            {isOpen ? "–" : "+"}
        </button>
        {isOpen && (
            children
        )}
    </div>
}



function MovieList({movies, onSelectMovie}) {

    return <ul className="list list-movies">
        {movies?.map((movie) => (
            <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie}/>
        ))}
    </ul>
}

function Movie({movie, onSelectMovie}) {
    return <li onClick={() => onSelectMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`}/>
        <h3>{movie.Title}</h3>
        <div>
            <p>
                <span>🗓</span>
                <span>{movie.Year}</span>
            </p>
        </div>
    </li>
}


function MovieDetails({selectedId, onCloseMovie, onAddWatched, watched}) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
    // console.log(isWatched);
    const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    function handelAdd() {

        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
        }

        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }


    useEffect(function () {
            function callback(e) {
                if (e.key === "Escape") {
                    onCloseMovie();
                }
            }

            document.addEventListener("keydown", callback);
            return function () {
                document.removeEventListener('keydown', callback);
            }

        }
    )

    useEffect(() => {
        async function getMovieDetails() {
            setIsLoading(true)
            const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId} `);
            const data = await res.json();

            setMovie(data);
            setIsLoading(false)
            // console.log(data)

        }


        getMovieDetails();
    }, [selectedId]);
    // console.log(userRating)


    useEffect(function () {
        if (!title) return;

        document.title = `Movie | ${title}`;
        return () => {
            document.title = `usePopcorn`;
        };
    }, [title]);


    return <div className="details">
        {isLoading ? <Loader/> :
            <>
                <header>
                    <button className="btn-back" onClick={() => onCloseMovie()}>&larr;</button>
                    <img src={poster} alt={`poster of ${movie}movie`}/>

                    <div className="details-overview">
                        <h2>{title}</h2>
                        <p>{released}&bull;{runtime}</p>
                        <p>{genre}</p>
                        <p><span>⭐</span>{imdbRating} IMDb Rating</p>
                    </div>

                </header>
                <section>
                    <div className="rating">
                        {!isWatched ?
                            <>  <StarRating size={25} maxRating={10} onSetRating={setUserRating}/>
                                {userRating > 0 && (
                                    < button className="btn-add" onClick={handelAdd}>+ Add to List!</button>)}
                            </>
                            :
                            <p>you rated this movie {watchedUserRating}<span>⭐</span></p>}
                    </div>
                    <p><em>{plot}</em>
                    </p>
                    <p>Starring{actors}</p>
                    <p>Directed by {director}</p>
                </section>
            </>}
        {/*{selectedId}*/}
    </div>
}

function WatchedSummary({watched}) {

    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return <div className="summary">
        <h2>Movies you watched</h2>
        <div>
            <p>
                <span>#️⃣</span>
                <span>{watched.length} movies</span>
            </p>
            <p>
                <span>⭐️</span>
                <span>{avgImdbRating.toFixed(1)}</span>
            </p>
            <p>
                <span>🌟</span>
                <span>{avgUserRating.toFixed(1)}</span>
            </p>
            <p>
                <span>⏳</span>
                <span>{avgRuntime} min</span>
            </p>
        </div>
    </div>
}

function WatchedMovieList({watched, onDeleteWatched}) {
    // console.log(watched);
    return <ul className="list">
        {watched.map((movie) => (
            <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched}/>
        ))}
    </ul>
}


function WatchedMovie({movie, onDeleteWatched}) {

    return <li>
        <img src={movie.poster} alt={`${movie.title} poster`}/>
        <h3>{movie.title}</h3>
        <div>
            <p>
                <span>⭐️</span>
                <span>{movie.imdbRating}</span>
            </p>
            <p>
                <span>🌟</span>
                <span>{movie.userRating}</span>
            </p>
            <p>
                <span>⏳</span>
                <span>{movie.runtime} min</span>
            </p>

            <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
        </div>
    </li>
}

