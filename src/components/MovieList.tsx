import { Skeleton, Image, Typography } from "antd";
import type { Movie, MovieQueryResponse } from "../util/types";

const { Title, Paragraph, Text, Link } = Typography;

function MovieList({
  data,
  loading,
}: {
  data: MovieQueryResponse;
  loading: boolean;
}) {
  const movieList = data.docs.map((movie: Movie, i: number) => {
    const { id, name, names, poster, year, countries, ageRating } = movie;
    const title = name ? name : names[0] ? names[0].name : "";

    return (
      <Skeleton loading={loading} active key={i}>
        {poster && poster.previewUrl !== null && (
          <Image
            alt={title}
            src={poster.previewUrl}
            width={240}
            style={{ aspectRatio: "2 / 3" }}
            preview={false}
            key={id}
          />
        )}
        {title && <Title level={3}>{title}</Title>}
        {year !== null && (
          <Paragraph>
            <Text strong>Год производства:</Text> {year}
          </Paragraph>
        )}
        {countries && (
          <Paragraph>
            <Text strong>Страна:</Text>{" "}
            {countries.map((country) => country.name).join(", ")}
          </Paragraph>
        )}
        {ageRating !== null && (
          <Paragraph>
            <Text strong>Возраст:</Text> {ageRating}+
          </Paragraph>
        )}
      </Skeleton>
    );
  });

  return <>{movieList}</>;
}

export default MovieList;
