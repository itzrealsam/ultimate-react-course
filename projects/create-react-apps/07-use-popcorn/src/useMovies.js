import { useEffect, useState } from "react";

const KEY = "5030de9";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchTerm = query.trim();

  useEffect(
    function () {
      // const controller = new AbortController();
      let ignore = false;

      if (searchTerm.length < 3) {
        setMovies([]);
        setError("");
        setIsLoading(false);
        return;
      }

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${searchTerm}`,
            // { signal: controller.signal },
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False")
            throw new Error(data.Error || "Movie not found");

          if (!ignore) {
            setMovies(data.Search);
          }
        } catch (err) {
          // if (err.name === "AbortError") return;
          if (!ignore) {
            setError(err.message);
            console.log(err.message);
          }
        } finally {
          // if (!controller.signal.aborted) {}
          if (!ignore) {
            setIsLoading(false);
          }
        }
      }

      //callback?.();
      fetchMovies();

      return function () {
        ignore = true;
      };
      // return function () {
      //   controller.abort();
      // };
    },
    [searchTerm],
  );

  return { movies, isLoading, error };
}
