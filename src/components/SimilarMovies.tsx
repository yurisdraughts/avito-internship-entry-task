import { Link } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import { Image, Text, useMantineTheme } from "@mantine/core";
import type { SimilarMovies } from "../types/idResponseType";
import * as controlClass from "../styles/Carousel/Control.module.css";
import useMaxWidth from "../util/useMaxWidth";
import GrayText from "./GrayText";

export default function SimilarMovies({ movies }: { movies: SimilarMovies }) {
  const theme = useMantineTheme();
  const [isMd, isSm, isXs] = useMaxWidth(["md", "sm", "xs"]);

  return (
    <>
      {!movies.length && (
        <GrayText ml={theme.spacing.md}>Информации нет.</GrayText>
      )}
      <Carousel
        align="start"
        bg={theme.colors.gray[4]}
        slideSize={isXs ? "100%" : isSm ? "50%" : isMd ? "33.3333%" : "25%"}
        slidesToScroll={isXs ? 1 : isSm ? 2 : isMd ? 3 : 4}
        slideGap="sm"
        classNames={controlClass}
      >
        {movies.map((movie, i) => (
          <Carousel.Slide
            key={i}
            component={Link}
            // @ts-ignore
            to={movie.id ? `/movie/${movie.id}` : "/"}
            td="none"
            p="md"
          >
            <Image h={300} fit="contain" src={movie.poster.previewUrl} />
            <Text ta="center" c="initial" fw={700}>
              {movie.name}
            </Text>
          </Carousel.Slide>
        ))}
      </Carousel>
    </>
  );
}
