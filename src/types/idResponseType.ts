export type SimilarMovies = {
  id: number | null;
  name: string;
  poster: {
    previewUrl: string | null;
  };
}[];

export type Persons = {
  photo?: string | null;
  name?: string | null;
  description: string; // роль
  enProfession: string; // нужно "actor"
}[];

export type IdResponse = {
  id: number;
  name?: string | null;
  enName?: string | null;
  names: {
    name?: string;
    language?: string | null;
  }[];
  description?: string | null;
  rating?: {
    kp?: number | null;
  };
  poster?: {
    url?: string | null;
  };
  persons?: Persons;
  similarMovies?: SimilarMovies;
};