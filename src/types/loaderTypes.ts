import type { IdResponse } from "./idResponseType";
import type { SearchResponse } from "./searchResponseType";
import type { NameQueryInput, FiltersInput } from "./inputTypes";

type Controllers = { controllers: AbortController[] };

type Query = { search?: NameQueryInput };

type Filters = { filters?: FiltersInput };

export type SearchLoaderData =
  | (Controllers & Query & Filters)
  | (SearchResponse & Controllers & Query & Filters);

export type MovieLoaderData = Controllers | (IdResponse & Controllers);

export type Deferred<T> = { data: Promise<T> };
