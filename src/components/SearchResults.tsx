import { useEffect } from "react";
import { useAsyncValue } from "react-router-dom";
import { Card, Stack, Title } from "@mantine/core";
import MovieCard from "./MovieCard";
import SearchPagination from "./SearchPagination";
import { isSearchResponse } from "../util/loaderTypeGuards";
import type { SearchLoaderData } from "../types/loaderTypes";

export default function SearchResults() {
  const data = useAsyncValue() as SearchLoaderData;
  const success = isSearchResponse(data);

  useEffect(() => {
    return () => {
      data.controllers.forEach((c) => c.abort());
    };
  }, []);

  return (
    <Stack>
      {(!success || (success && data.docs.length === 0)) && (
        <Card>
          <Title ta="center">Ничего не найдено :(</Title>
        </Card>
      )}
      {success &&
        data.docs.map((movie, i) => <MovieCard key={i} movie={movie} />)}
      {success && data.pages > 1 && (
        <SearchPagination
          page={data.page}
          limit={data.limit}
          total={data.pages}
        />
      )}
    </Stack>
  );
}
