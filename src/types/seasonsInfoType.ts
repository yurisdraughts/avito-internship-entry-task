export type SeasonsInfo = {
  docs: SeasonInfo[];
};

export type SeasonInfo = {
  number?: number;
  episodes: {
    number?: number;
    name?: string;
    still?: {
      previewUrl?: string | null;
    };
  }[];
  poster?: {
    previewUrl?: string | null;
  };
};
