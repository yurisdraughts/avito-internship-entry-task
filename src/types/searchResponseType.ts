export type SearchResponseItem = {
  id: number;
  name: string | null;
  enName?: string | null;
  names: {
    name?: string;
    language?: string | null;
  }[];
  year: number | null;
  poster?: {
    previewUrl?: string | null;
  };
  countries?: {
    name?: string;
  }[];
  ageRating: number | null;
};

export type SearchResponse = {
  docs: SearchResponseItem[];
  page: number;
  limit: number;
  pages: number;
};
