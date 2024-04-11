import { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";
import Movie from "../components/Movie";
import LoadingSpinner from "../components/LoadingSpinner";
import AsyncErrorElement from "../components/AsyncErrorElement";
import type { Deferred, MovieLoaderData } from "../types/loaderTypes";

export default function MoviePage() {
  const { data } = useLoaderData() as Deferred<MovieLoaderData>;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={data} errorElement={<AsyncErrorElement />}>
        <Movie />
      </Await>
    </Suspense>
  );
}
