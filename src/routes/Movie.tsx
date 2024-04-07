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
import {
  Button,
  Card,
  Group,
  Image,
  Rating,
  Stack,
  Text,
  Title,
} from "@mantine/core";

type LoaderData = WithControllers<Partial<WithImages<WithReviews<IdResponse>>>>;

export default function Movie() {
  const {
    id,
    poster,
    name,
    description,
    rating,
    persons,
    seasonsInfo,
    reviews,
    images,
    similarMovies,
    controllers,
  } = useLoaderData() as LoaderData;

  const actors = persons
    ?.filter((p) => p.enProfession === "actor")
    ?.map((p) => p.name);

  const {
    state: { backToSearch },
  } = useLocation();

  useEffect(() => {
    return controllers.forEach((c) => c.abort());
  }, []);

  if (!id) {
    return <>Не удалось загрузить информацию о фильме.</>;
  }

  return (
    <Card withBorder radius="md">
      <Card.Section>
        <Group align="start" grow wrap="nowrap">
          {poster && poster.url && <Image src={poster.url} />}
          <Stack p="md">
            {name && <Title order={1}>{name}</Title>}
            {description && (
              <Stack>
                <Title order={2}>Описание</Title>
                <Text>{description}</Text>
              </Stack>
            )}
            {rating && rating.kp && (
              <Stack>
                <Title order={2}>Рейтинг</Title>
                <Group>
                  <Rating
                    fractions={5}
                    readOnly
                    title={`${rating.kp}`}
                    value={rating.kp / 2}
                  />
                  <Text>{rating.kp.toFixed(2)}</Text>
                </Group>
              </Stack>
            )}
            <Stack>
              <Title order={2}>В ролях</Title>
              <Text>{actors}</Text>
            </Stack>
          </Stack>
        </Group>
      </Card.Section>
      <Text>
        {seasonsInfo
          .map((s) => {
            return `Номер сезона: ${s.number}, число эпизодов: ${s.episodesCount}`;
          })
          .join("; ")}
      </Text>
      <Text>
        {reviews.map((r) => {
          return `${r.title}\n${r.type}\n${r.date}\n${r.author}\n${r.review}`;
        })}
      </Text>
      <Text>
        {images.map((img, idx) => {
          return <img src={img.previewUrl} key={idx} />;
        })}
      </Text>
      <Text className="movie__data movie__data_similar-movies">
        {similarMovies.map((sm) => sm.name)}
      </Text>
      {backToSearch && (
        <Button component={Link} to={backToSearch}>
          Вернуться к поиску
        </Button>
      )}
    </Card>
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

  data.controllers = [controller];

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
