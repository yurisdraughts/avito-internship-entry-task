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
  Table,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import type { MovieLoaderData } from "../types/loaderTypes";
import MovieReviews from "./MovieReviews";
import MoviePosters from "./MoviePosters";
import MovieActors from "./MovieActors";
import SimilarMovies from "./SimilarMovies";
import useMaxWidth from "../util/useMaxWidth";
import GrayTitle from "./GrayTitle";

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
              <Image w="100%" radius="md" src={movie.poster.url} />
            )}
          </Grid.Col>
          <Grid.Col span={1}>
            <Stack>
              <Title order={1}>
                {movie.name ||
                  movie.names?.filter((n) => n.language === "RU")[0]?.name ||
                  movie.enName}
              </Title>
              {movie.description && (
                <Stack>
                  <GrayTitle order={2}>Описание</GrayTitle>
                  <Text
                    dangerouslySetInnerHTML={{ __html: movie.description }}
                  ></Text>
                </Stack>
              )}
              {!movie.description && <Text>Описание отсутствует.</Text>}
              {movie.rating && !!movie.rating.kp && (
                <Stack>
                  <GrayTitle order={2}>Рейтинг</GrayTitle>
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
                </Stack>
              )}
              {(!movie.rating || !movie.rating.kp) && (
                <Text>Нет информации о рейтинге.</Text>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
        {movie.seasonsInfo && !!movie.seasonsInfo?.length && (
          <>
            <GrayTitle order={2}>Информация о сезонах</GrayTitle>
            <Table striped withColumnBorders withRowBorders={false}>
              <Table.Thead></Table.Thead>
              <Table.Tr>
                <Table.Th>Сезон</Table.Th>
                <Table.Th>Число эпизодов</Table.Th>
              </Table.Tr>
              <Table.Tbody>
                {movie.seasonsInfo.map((s) => (
                  <Table.Tr key={s.number}>
                    <Table.Td>{++s.number}</Table.Td>
                    <Table.Td>{s.episodesCount}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </>
        )}
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
          <MoviePosters id={movie.id} page={1} />
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
