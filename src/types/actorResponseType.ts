export type ActorResponse = {
  id: number;
  docs: {
    name: string;
    photo: string | null;
  }[];
  total: number;
  page: number;
  pages: number;
};
