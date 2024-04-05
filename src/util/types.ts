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
  countries: { name: string }[] | null;
};
