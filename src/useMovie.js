import {useEffect, useState} from "react";

const KEY = "23a9a4e5";

export function useMovie(query) {

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(function () {

        const controller = new AbortController();

        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("")

                const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query} `,
                    {signal: controller.signal});




                // WE HAD PROBLEM

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
        // handleCloseMovie();
        fetchMovies();


        return function () {
            controller.abort();
        }

    }, [query])
    return {movies, isLoading, error};
}