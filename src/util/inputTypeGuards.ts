import type { FiltersInput, NameQueryInput } from "../types/inputTypes";

export function isNameQuery(value: unknown): value is NameQueryInput {
  return typeof value === "string";
}

export function isFilters(value: unknown): value is FiltersInput {
  return typeof value === "object" && value !== null;
}