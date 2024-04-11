export type ReviewResponse = {
  docs: {
    title: string;
    type: string; // позитивный, негативный, и т.п.
    review: string;
    author: string;
    date: string;
  }[];
  total: number;
  pages: number;
};