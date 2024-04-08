import { Link, useLoaderData, useLocation } from "react-router-dom";
import type { Params } from "react-router-dom";
import { useEffect } from "react";
import {
  Button,
  Card,
  Flex,
  Group,
  Image,
  Rating,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import type {
  IdResponse,
  ImageResponse,
  ReviewResponse,
  WithImages,
  WithReviews,
  WithControllers,
} from "../util/types";
import customFetch from "../util/customFetch";

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
    return () => {
      controllers.forEach((c) => c.abort());
    };
  }, []);

  if (!id) {
    return <>Не удалось загрузить информацию о фильме.</>;
  }

  return (
    <Card withBorder radius="md">
      <Card.Section>
        <Group align="start" grow wrap="nowrap">
          {poster && poster.url && <Image mah={700} src={poster.url} />}
          <Stack p="md">
            {name && <Title order={1}>{name}</Title>}
            {description && (
              <Stack>
                <Title order={2}>Описание</Title>
                <Text>{description}</Text>
              </Stack>
            )}
            {!description && <Text>Описание отсутствует</Text>}
            {rating && !!rating.kp && (
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
            {!rating && !rating.kp && <Text>Нет информации о  рейтинге</Text>}
            {actors && !!actors.length && (
              <Stack>
                <Title order={2}>В ролях</Title>
                <Text>{actors.join(", ")}</Text>
              </Stack>
            )}
            {!actors && !actors.length && <Text>Нет информации об актёрах</Text>}
          </Stack>
        </Group>
      </Card.Section>
      {seasonsInfo && !!seasonsInfo.length && (
        <>
          <Title order={2}>Информация о сезонах</Title>
          <Card.Section>
            <Table striped withColumnBorders withRowBorders={false}>
              <Table.Thead></Table.Thead>
              <Table.Tr>
                <Table.Th>Сезон</Table.Th>
                <Table.Th>Число эпизодов</Table.Th>
              </Table.Tr>
              <Table.Tbody>
                {seasonsInfo.map((s) => (
                  <Table.Tr>
                    <Table.Td>{++s.number}</Table.Td>
                    <Table.Td>{s.episodesCount}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card.Section>
        </>
      )}
      {images && !!images.length && (
        <>
          <Title order={2}>Галерея</Title>
          <Card.Section>
            <Carousel loop withIndicators>
              {images.map((img, i) => {
                return (
                  <Carousel.Slide mah={500} key={i}>
                    <Flex h="100%" justify="center" align="center">
                      <Image mah="100%" m="auto" src={img.previewUrl} />
                    </Flex>
                  </Carousel.Slide>
                );
              })}
            </Carousel>
          </Card.Section>
        </>
      )}
      {similarMovies && !!similarMovies.length && (
        <>
          <Title order={2}>Рекомендации</Title>
          <Card.Section>
            <Carousel loop withIndicators>
              {similarMovies.map((sm, i) => (
                <Carousel.Slide mah={300} key={i}>
                  <Flex h="100%" justify="center" align="center">
                    <Image mah="100%" m="auto" src={sm.poster.previewUrl} />
                  </Flex>
                  {sm.name}
                </Carousel.Slide>
              ))}
            </Carousel>
          </Card.Section>
        </>
      )}
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
