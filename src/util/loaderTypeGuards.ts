import type { IdResponse } from "../types/idResponseType";
import type { SearchResponse } from "../types/searchResponseType";
import { SeasonsInfo } from "../types/seasonsInfoType";

export function isIdResponse(
  data: Record<string, unknown>
): data is IdResponse {
  return (
    data &&
    data.id &&
    Array.isArray(data.names) &&
    Array.isArray(data.persons) &&
    data.rating &&
    Boolean(data.poster)
  );
}

export function isSearchResponse(
  data: Record<string, unknown>
): data is SearchResponse {
  return (
    data &&
    Array.isArray(data.docs) &&
    data.docs.every((item) => {
      return (
        item &&
        Array.isArray(item.names) &&
        item.poster &&
        Array.isArray(item.countries)
      );
    })
  );
}

export function isSeasonsInfoType(
  data: Record<string, unknown>
): data is SeasonsInfo {
  return (
    data &&
    Array.isArray(data.docs) &&
    data.docs.every((season) => {
      return Array.isArray(season.episodes) && season.poster;
    })
  );
}

export function isReviewResponse(data: Record<string, unknown>) {
  return data && Array.isArray(data.docs);
}

export function isReviewType(data: string | null) {
  return (
    data &&
    (data === "Позитивный" || data === "Нейтральный" || data === "Негативный")
  );
}

export function isImageResponse(data: Record<string, unknown>) {
  return data && Array.isArray(data.docs);
}
