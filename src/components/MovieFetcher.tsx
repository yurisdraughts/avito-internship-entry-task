import React, { useEffect } from "react";
import type { PropsWithChildren } from "react";
import type { MovieQueryResponse } from "../util/types";

const host = "https://api.kinopoisk.dev/v1.4/movie";
const select =
  "selectFields=id&selectFields=name&selectFields=names&selectFields=year&selectFields=ageRating&selectFields=poster&selectFields=countries";
const filter = "notNullFields=name&notNullFields=year&notNullFields=ageRating";

function MovieFetcher({
  page,
  limit,
  token,
  name,
  setLoading,
  setData,
  children,
}: PropsWithChildren<{
  page: number;
  limit: number;
  token: string;
  name: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<MovieQueryResponse>>;
}>) {
  const pagination = `page=${page}&limit=${limit}`;
  const input =
    name === ""
      ? `${host}?${pagination}&${select}&${filter}`
      : `${host}/search?${pagination}&query=${name}`;

  useEffect(() => {
    setLoading(true);

    fetch(input, {
      method: "GET",
      headers: { accept: "application/json", "X-API-KEY": token },
    })
      .then((response) => {
        setLoading(false);

        if (!response.ok) {
          setData(null);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => console.error(err));
  }, [page, limit, name]);

  return children;
}

export default MovieFetcher;
