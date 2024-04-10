import { Link, useLocation, useNavigation } from "react-router-dom";
import {
  Box,
  Card,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Text,
  Title,
} from "@mantine/core";
import stubImage from "../images/stub.png";
import { SearchResponseItem } from "../types/searchResponseType";
import useMaxWidth from "../util/useMaxWidth";
import GrayTitle from "./GrayTitle";

export default function MovieCard({ movie }: { movie: SearchResponseItem }) {
  const location = useLocation();
  const navigation = useNavigation();

  const [isXs, isSm] = useMaxWidth(["xs", "sm"]);

  return (
    <Box pos="relative">
      <LoadingOverlay visible={navigation.state === "loading"} />
      <Card
        component={Link}
        state={{
          backToSearch: location.pathname + location.search,
        }}
        td="none"
        to={`/movie/${movie.id}`}
        withBorder
        key={movie.id}
      >
        <Card.Section>
          <Grid columns={6} align="center">
            <Grid.Col span={isXs ? 6 : isSm ? 3 : 2}>
              <Image src={movie.poster?.previewUrl} fallbackSrc={stubImage} />
            </Grid.Col>
            <Grid.Col span={isXs ? 6 : isSm ? 3 : 4} p="md">
              <Title order={2}>
                {movie.name ||
                  movie.names.filter((nameObj) => nameObj.language === "RU")[0]
                    ?.name ||
                  movie.enName}
              </Title>
              {movie.year && (
                <Group align="center">
                  <GrayTitle order={3}>Год</GrayTitle>
                  <Text>{movie.year}</Text>
                </Group>
              )}
              {movie.countries && movie.countries.length && (
                <Group align="center">
                  <GrayTitle order={3}>Страна</GrayTitle>
                  <Text>
                    {movie.countries.map((country) => country.name).join(", ")}
                  </Text>
                </Group>
              )}
              {movie.ageRating !== null && (
                <Group align="center">
                  <GrayTitle order={3}>Возрастной рейтинг</GrayTitle>
                  <Text>{movie.ageRating}+</Text>
                </Group>
              )}
            </Grid.Col>
          </Grid>
        </Card.Section>
      </Card>
    </Box>
  );
}
