import { Link, useLoaderData, useLocation } from "react-router-dom";
import type { Params } from "react-router-dom";
import type {
  IdResponse,
  ImageResponse,
  ReviewResponse,
  WithImages,
  WithReviews,
  WithControllers,
} from "../util/types";
import customFetch from "../util/customFetch";
import { useEffect } from "react";

type LoaderData = WithControllers<Partial<WithImages<WithReviews<IdResponse>>>>;

export default function Movie() {
  const movie = useLoaderData() as LoaderData;

  if (!movie.id) {
    return <>Не удалось загрузить информацию о фильме.</>;
  }

  const {
    state: { backToSearch },
  } = useLocation();

  useEffect(() => {
    return movie.controllers.forEach((c) => c.abort());
  }, []);

  return (
    <>
      <div className="movie__data movie__data_name">{movie.name}</div>
      <div className="movie__data movie__data_description">
        {movie.description}
      </div>
      <div className="movie__data movie__data_rating">{movie.rating.kp}</div>
      <div className="movie__data movie__data_persons">
        {movie.persons
          .filter((p) => p.enProfession === "actor")
          .map((p) => p.name)
          .join(", ")}
      </div>
      <div className="movie__data movie__data_seasons">
        {movie.seasonsInfo
          .map((s) => {
            return `Номер сезона: ${s.number}, число эпизодов: ${s.episodesCount}`;
          })
          .join("; ")}
      </div>
      <div className="movie__data movie__data_reviews">
        {movie.reviews.map((r) => {
          return `${r.title}\n${r.type}\n${r.date}\n${r.author}\n${r.review}`;
        })}
      </div>
      <div className="movie__data movie__data_posters">
        {movie.images.map((img, idx) => {
          return <img src={img.previewUrl} key={idx} />;
        })}
      </div>
      <div className="movie__data movie__data_similar-movies">
        {movie.similarMovies.map((sm) => sm.name).join(", ")}
      </div>
      {backToSearch && <Link to={backToSearch}>Вернуться к поиску</Link>}
    </>
  );
}

export async function loader({
  params,
}: {
  params: Params<"id">;
}): Promise<LoaderData> {
  const { id } = params;

  const { data, controller } = await customFetch<LoaderData>(`movie/${id}`);

  if (!data) {
    return { controllers: [controller] };
  }

  data.controllers = [];

  const { data: reviews, controller: reviewsController } =
    await customFetch<ReviewResponse>(`review?page=1&limit=10&movieId=${id}`);

  data.reviews = reviews.docs;
  data.controllers.push(reviewsController);

  const { data: images, controller: imagesController } =
    await customFetch<ImageResponse>(`image?page=1&limit=10&movieId=${id}`);

  data.images = images.docs;
  data.controllers.push(imagesController);

  return data;
}
