import { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";
import { Stack } from "@mantine/core";
import SearchResults from "../components/SearchResults";
import LoadingSpinner from "../components/LoadingSpinner";
import AsyncErrorElement from "../components/AsyncErrorElement";
import SearchInputs from "../components/SearchInputs";
import type { Deferred, SearchLoaderData } from "../types/loaderTypes";

export default function SearchPage() {
  const { data } = useLoaderData() as Deferred<SearchLoaderData>;

  return (
    <Stack>
      <SearchInputs />
      <Suspense fallback={<LoadingSpinner />}>
        <Await resolve={data} errorElement={<AsyncErrorElement />}>
          <SearchResults />
        </Await>
      </Suspense>
    </Stack>
  );
}
