import type { IdResponse } from "./idResponseType";
import type { SearchResponse } from "./searchResponseType";

type WithControllers<T> = T & { controllers: AbortController[] };

type SearchByName<T> = T & { search: string };

type SearchWithFilters<T> = T & {
  filters: { year: string; country: string; ageRating: string };
};

export type SearchLoaderData = WithControllers<
  Partial<SearchWithFilters<SearchByName<SearchResponse>>>
>;

export type MovieLoaderData = WithControllers<Partial<IdResponse>>;

export type Deferred<T> = { data: Promise<T> };
