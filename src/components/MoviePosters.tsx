import { useEffect, useState } from "react";
import { Image, Skeleton, useMantineTheme } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import GrayText from "./GrayText";
import ErrorElement from "./ErrorElement";
import fetchWithController from "../util/fetchWithController";
import useMaxWidth from "../util/useMaxWidth";
import type { ImageResponse } from "../types/imageResponseType";
import * as controlClass from "../styles/Carousel/Control.module.css";
import { isImageResponse } from "../util/loaderTypeGuards";

export default function MoviePosters({ id }: { id: number }) {
  const [data, setData] = useState<ImageResponse>(null);
  const [controller, setController] = useState<AbortController>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);

  const theme = useMantineTheme();
  const [isMd, isSm] = useMaxWidth(["md", "sm"]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const { data, controller } = await fetchWithController<ImageResponse>(
          `image?page=1&limit=250&movieId=${id}&selectFields=previewUrl&type=cover`
        );

        setLoading(false);
        setData(data);
        setController(controller);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();

    return () => {
      controller?.abort();
    };
  }, [id]);

  return (
    <Skeleton visible={!data || loading}>
      {error && <ErrorElement error={error} />}
      {isImageResponse(data) && (
        <>
          {data.docs.length === 0 && (
            <GrayText ml={theme.spacing.md}>Постеров нет.</GrayText>
          )}
          {data.docs.length !== 0 && (
            <Carousel
              align="start"
              bg={theme.colors.gray[4]}
              slideSize={isSm ? "100%" : isMd ? "50%" : "33.3333%"}
              slidesToScroll={isSm ? 1 : isMd ? 2 : 3}
              slideGap="md"
              p="md"
              classNames={controlClass}
            >
              {data.docs.map((poster) => {
                return (
                  <Carousel.Slide key={poster.previewUrl}>
                    <Image h={500} fit="contain" src={poster.previewUrl} />
                  </Carousel.Slide>
                );
              })}
            </Carousel>
          )}
        </>
      )}
    </Skeleton>
  );
}
