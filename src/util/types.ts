export type IdResponse = {
  id: number;
  name: string;
  description: string;
  rating: {
    kp: number;
  };
  persons: {
    photo: string;
    name: string;
    description: string; // роль
    enProfession: string; // нужно "actor"
  }[];
  seasonsInfo: {
    number: number;
    episodesCount: number;
  }[];
  similarMovies: {
    id: number;
    name: number;
    poster: {
      url: string;
      previewUrl: string;
    };
  }[];
};

export type SearchResponse = {
  docs: {
    id: number;
    name: string;
    year: number;
    countries: {
      name: string[];
    };
    ageRating: number;
  }[];
  page: number;
  limit: number;
};

export type ReviewResponse = {
  docs: {
    title: string;
    type: string; // позитивный, негативный, и т.п.
    review: string;
    author: string;
    date: string;
  }[];
  total: number;
};

export type ImageResponse = {
  docs: {
    url: string;
    previewUrl: string;
    height: number;
    width: number;
  }[];
  total: number;
};

export type WithReviews<T> = T & { reviews: ReviewResponse["docs"] };
export type WithImages<T> = T & { images: ImageResponse["docs"] };
export type WithControllers<T> = T & { controllers: AbortController[] };
