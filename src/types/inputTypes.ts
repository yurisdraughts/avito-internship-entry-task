export type NameQueryInput = string;

export type FiltersInput = {
  year?: string;
  country?: string;
  ageRating?: string;
};

export type SearchState = null | NameQueryInput | FiltersInput;
