import { IdResponse } from "../types/idResponseType";
import { SearchResponseItem } from "../types/searchResponseType";

export default function getMovieName(movie: Partial<IdResponse | SearchResponseItem>) {
  return (
    movie.name ||
    movie.names?.filter((n) => n.language === "RU")[0]?.name ||
    movie.names[0]?.name ||
    movie.enName
  );
}
