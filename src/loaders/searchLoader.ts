import fetchWithController from "../util/fetchWithController";
import { defer, type Params } from "react-router-dom";
import type { SearchLoaderData } from "../types/loaderTypes";

export default async function deferredSearchLoader({
  params,
  request,
}: {
  params: Params<"page" | "limit">;
  request: Request;
}) {
  let page = parseInt(params.page);

  if (isNaN(page) || page < 1) {
    page = 1;
  }

  let limit = parseInt(params.limit);

  if (isNaN(limit) || limit <= 10) {
    limit = 10;
  } else if (limit >= 50) {
    limit = 50;
  } else {
    limit = 20;
  }

  const searchParams = new URL(request.url).searchParams;
  const name = searchParams.get("n");
  const year = searchParams.get("y");
  const country = searchParams.get("c");
  const ageRating = searchParams.get("a");

  return defer({
    data: searchLoader({ page, limit, name, year, country, ageRating }),
  });
}

async function searchLoader({
  page,
  limit,
  name,
  year,
  country,
  ageRating,
}: {
  page: number;
  limit: number;
  name: string;
  year: string;
  country: string;
  ageRating: string;
}): Promise<SearchLoaderData> {
  let data: SearchLoaderData, controller: AbortController;

  if (year || country || ageRating) {
    const yearComponent = year ? `&year=${year}` : "";
    const countryComponent = country
      ? `&countries.name=${encodeURIComponent(country)}`
      : "";
    const ageRatingComponent = ageRating ? `&ageRating=${ageRating}` : "";

    ({ data, controller } = await fetchWithController<SearchLoaderData>(
      `movie?page=${page}&limit=${limit}${yearComponent}${ageRatingComponent}${countryComponent}`
    ));
  } else if (name) {
    ({ data, controller } = await fetchWithController<SearchLoaderData>(
      `movie/search?page=${page}&limit=${limit}&query=${name}`
    ));
  } else {
    ({ data, controller } = await fetchWithController<SearchLoaderData>(
      `movie?page=${page}&limit=${limit}`
    ));
  }

  if (!data) {
    return { controllers: [controller] };
  }

  data.controllers = [controller];

  if (year || country || ageRating) {
    data.filters = { year, country, ageRating };
  } else if (name) {
    data.search = name;
  }

  return data;
}