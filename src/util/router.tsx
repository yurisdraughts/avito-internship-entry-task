import { createBrowserRouter } from "react-router-dom";
import Root from "../routes/Root";
import Movie, { loader as movieLoader } from "../routes/Movie";
import Search, { loader as searchLoader } from "../routes/Search";

export default createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Search />,
        loader: searchLoader,
      },
      {
        path: ":page/:limit?",
        element: <Search />,
        loader: searchLoader,
      },
      {
        path: "movie/:id",
        element: <Movie />,
        loader: movieLoader,
      },
    ],
  },
]);
