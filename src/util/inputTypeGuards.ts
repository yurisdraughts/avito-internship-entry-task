import type { FiltersInput, SearchInput } from "../types/inputTypes";

export function isSearch(value: unknown): value is SearchInput {
  return typeof value === "string";
}

export function isFilters(value: unknown): value is FiltersInput {
  return typeof value === "object" && value !== null;
}