export type SeasonsInfo = {
  docs: SeasonInfo[];
  page: number;
  pages: number;
};

export type SeasonInfo = {
  number?: number;
  episodesCount?: number;
  episodes: {
    number?: number;
    name?: string;
    still?: {
      url?: string | null;
      previewUrl?: string | null;
    };
  }[];
  poster?: {
    url?: string | null;
    previewUrl?: string | null;
  };
  name?: string;
  createdAt: string;
};
