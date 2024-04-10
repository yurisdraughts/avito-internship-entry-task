export type ImageResponse = {
  docs: {
    url: string;
    previewUrl: string;
    height: number;
    width: number;
  }[];
  total: number;
  page: number;
  pages: number;
};
