import { useEffect } from "react";
import { useAsyncValue } from "react-router-dom";
import { Stack } from "@mantine/core";
import type { SearchLoaderData } from "../types/loaderTypes";
import SearchPagination from "./SearchPagination";
import MovieCard from "./MovieCard";

export default function SearchResults() {
  const data = useAsyncValue() as SearchLoaderData;

  useEffect(() => {
    return () => {
      data.controllers.forEach((c) => c.abort());
    };
  }, []);

  return (
    <Stack>
      {data.docs.map((movie, i) => (
        <MovieCard key={i} movie={movie} />
      ))}
      {data.pages > 1 && (
        <SearchPagination
          page={data.page}
          limit={data.limit}
          total={data.pages}
        />
      )}
    </Stack>
  );
}
