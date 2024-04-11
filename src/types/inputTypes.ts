export type SearchInput = string;

export type FiltersInput = {
  year?: string;
  country?: string;
  ageRating?: string;
};

export type SearchState = null | SearchInput | FiltersInput;
