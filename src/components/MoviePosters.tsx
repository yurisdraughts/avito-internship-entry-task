import { useEffect, useState } from "react";
import { Image, Skeleton, Text, useMantineTheme } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import fetchWithController from "../util/fetchWithController";
import type { ImageResponse } from "../types/imageResponseType";
import * as controlClass from "../styles/Carousel/Control.module.css";
import useMaxWidth from "../util/useMaxWidth";
import GrayText from "./GrayText";

export default function MoviePosters({
  id,
  page,
}: {
  id: number;
  page: number;
}) {
  const [data, setData] = useState<ImageResponse>(null);
  const [controller, setController] = useState<AbortController>(null);
  const [loading, setLoading] = useState(false);

  const theme = useMantineTheme();
  const [isMd, isSm] = useMaxWidth(["md", "sm"]);

  useEffect(() => {
    setLoading(true);

    (async () => {
      const { data, controller } = await fetchWithController<ImageResponse>(
        `image?page=${page}&limit=250&movieId=${id}&type=cover`
      );

      setLoading(false);
      setData(data);
      setController(controller);
    })();

    return () => {
      controller?.abort();
    };
  }, [page]);

  return (
    <Skeleton visible={!data || loading}>
      {data?.docs && !data.docs.length && (
        <GrayText ml={theme.spacing.md}>Постеров нет.</GrayText>
      )}
      {data?.docs && !!data.docs.length && (
        <Carousel
          align="start"
          bg={theme.colors.gray[4]}
          slideSize={isSm ? "100%" : isMd ? "50%" : "33.3333%"}
          slidesToScroll={isSm ? 1 : isMd ? 2 : 3}
          slideGap="md"
          p="md"
          classNames={controlClass}
        >
          {data.docs.map((poster, i) => {
            return (
              <Carousel.Slide key={i}>
                <Image h={500} fit="contain" src={poster.previewUrl} />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      )}
    </Skeleton>
  );
}
