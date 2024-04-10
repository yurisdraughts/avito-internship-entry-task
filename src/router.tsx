import { Outlet, createBrowserRouter } from "react-router-dom";
import App from "./App";
import MoviePage from "./routes/MoviePage";
import movieLoader from "./loaders/movieLoader";
import SearchPage from "./routes/SearchPage";
import searchLoader from "./loaders/searchLoader";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        errorElement: <Outlet />,
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
          },
        ],
      },
    ],
  },
]);
