import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SearchPage from "./routes/SearchPage";
import MoviePage from "./routes/MoviePage";
import searchLoader from "./loaders/searchLoader";
import movieLoader from "./loaders/movieLoader";
import AsyncErrorElement from "./components/AsyncErrorElement";
import type { IdResponse } from "./types/idResponseType";
import type { Deferred } from "./types/loaderTypes";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        errorElement: <AsyncErrorElement />,
        children: [
          {
            index: true,
            element: <SearchPage />,
            loader: searchLoader,
          },
          {
            path: ":page/:limit?",
            element: <SearchPage />,
            loader: searchLoader,
          },
          {
            path: "movie/:id",
            element: <MoviePage />,
            loader: movieLoader,
            handle: {
              title: async (deferred: Deferred<IdResponse>) => {
                const movie = await deferred.data;
                return (
                  movie.name ||
                  movie.names?.filter((n) => n.language === "RU")[0]?.name ||
                  movie.enName
                );
              },
            },
          },
        ],
      },
    ],
  },
]);
