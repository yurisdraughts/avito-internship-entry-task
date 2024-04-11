import { defer, type Params } from "react-router-dom";
import fetchWithController from "../util/fetchWithController";
import type { MovieLoaderData } from "../types/loaderTypes";

export default async function deferredMovieLoader({
  params,
}: {
  params: Params<"id">;
}) {
  const { id } = params;

  return defer({
    data: movieLoader(id),
  });
}

async function movieLoader(id: string): Promise<MovieLoaderData> {
  const { data, controller } = await fetchWithController<MovieLoaderData>(
    `movie/${id}`
  );

  if (!data) {
    return { controllers: [controller] };
  }

  data.controllers = [controller];

  return data;
}
