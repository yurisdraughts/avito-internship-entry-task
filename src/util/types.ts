export type Movie = {
  id: number;
  name: string | null;
  names: { name: string }[];
  year: number | null;
  ageRating: number | null;
  poster: {
    url: string | null;
    previewUrl: string | null;
  } | null;
  countries: { name: string }[];
};

export type MovieQueryResponse = {
  docs: Movie[];
  total: number;
  pages: number;
};
