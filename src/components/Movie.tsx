import { useEffect } from "react";
import { Link, useLocation, useAsyncValue } from "react-router-dom";
import {
  Button,
  Card,
  Grid,
  Group,
  Image,
  Rating,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import GrayTitle from "./GrayTitle";
import GrayText from "./GrayText";
import MovieActors from "./MovieActors";
import SeasonsInfo from "./SeasonsInfo";
import MovieReviews from "./MovieReviews";
import MoviePosters from "./MoviePosters";
import SimilarMovies from "./SimilarMovies";
import useMaxWidth from "../util/useMaxWidth";
import getMovieName from "../util/getMovieName";
import type { MovieLoaderData } from "../types/loaderTypes";

export default function Movie() {
  const movie = useAsyncValue() as MovieLoaderData;
  const location = useLocation();

  const theme = useMantineTheme();
  const isSm = useMaxWidth("sm");

  useEffect(() => {
    return () => {
      movie.controllers.forEach((c) => c.abort());
    };
  }, []);

  return (
    <Card withBorder radius="md">
      <Stack>
        <Grid columns={isSm ? 1 : 2} align="start">
          <Grid.Col span={1}>
            {movie.poster && movie.poster.url && (
              <Image
                w="100%"
                radius="md"
                src={movie.poster.url}
                key={movie.poster.url}
              />
            )}
          </Grid.Col>
          <Grid.Col span={1}>
            <Stack>
              <Title order={1}>{getMovieName(movie)}</Title>
              <Stack>
                <GrayTitle order={2}>Описание</GrayTitle>
                {movie.description && (
                  <Text
                    dangerouslySetInnerHTML={{ __html: movie.description }}
                  ></Text>
                )}
              </Stack>
              {!movie.description && <GrayText>Описание отсутствует.</GrayText>}
              <Stack>
                <GrayTitle order={2}>Рейтинг</GrayTitle>
                {movie.rating && !!movie.rating.kp && (
                  <Group>
                    <Rating
                      color={theme.primaryColor}
                      fractions={5}
                      readOnly
                      title={`${movie.rating.kp}`}
                      value={movie.rating.kp / 2}
                    />
                    <Text>{movie.rating.kp.toFixed(2)}</Text>
                  </Group>
                )}
              </Stack>
              {(!movie.rating || !movie.rating.kp) && (
                <GrayText>Нет информации о рейтинге.</GrayText>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
        <GrayTitle order={2}>Сезоны</GrayTitle>
        <SeasonsInfo id={movie.id} />
        <GrayTitle order={2}>В ролях</GrayTitle>
        <MovieActors
          actors={
            movie.persons?.filter((p) => p.enProfession === "actor") ?? []
          }
        />
        <GrayTitle order={2}>Отзывы</GrayTitle>
        <MovieReviews id={movie.id} />
        <GrayTitle order={2}>Постеры</GrayTitle>
        <Card.Section>
          <MoviePosters id={movie.id} />
        </Card.Section>
        <GrayTitle order={2}>Рекомендации</GrayTitle>
        <Card.Section>
          {movie.similarMovies && (
            <SimilarMovies movies={movie.similarMovies} />
          )}
        </Card.Section>
        {location.state?.backToSearch && (
          <Button
            variant="outline"
            component={Link}
            to={location.state?.backToSearch}
          >
            Вернуться к поиску
          </Button>
        )}
      </Stack>
    </Card>
  );
}
