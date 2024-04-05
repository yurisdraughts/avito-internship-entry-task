import React, { useEffect } from "react";
import type { PropsWithChildren } from "react";
import type { MovieQueryResponse } from "../util/types";

function MovieFetcher({
  page,
  limit,
  token,
  setLoading,
  setData,
  children,
}: PropsWithChildren<{
  page: number;
  limit: number;
  token: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<MovieQueryResponse>>;
}>) {
  useEffect(() => {
    setLoading(true);

    fetch(`https://api.kinopoisk.dev/v1.4/movie?page=${page}&limit=${limit}`, {
      headers: { "X-API-KEY": token },
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
  }, [page, limit]);

  return children;
}

export default MovieFetcher;
