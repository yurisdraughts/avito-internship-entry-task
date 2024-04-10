export type ActorResponse = {
  docs: {
    name: string;
    photo: string | null;
  }[];
  total: number;
  page: number;
  pages: number;
};
