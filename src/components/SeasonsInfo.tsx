import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Center,
  Grid,
  Image,
  LoadingOverlay,
  Pagination,
  Stack,
  Title,
} from "@mantine/core";
import GrayText from "./GrayText";
import ErrorElement from "./ErrorElement";
import fetchWithController from "../util/fetchWithController";
import useMaxWidth from "../util/useMaxWidth";
import type { SeasonsInfo } from "../types/seasonsInfoType";
import stubImage from "../images/stub.png";
import stubImageHorizontal from "../images/stub_horizontal.png";
import { isSeasonsInfoType } from "../util/loaderTypeGuards";

export default function SeasonsInfo({ id }: { id: number }) {
  const [seasons, setSeasons] = useState<SeasonsInfo>(null);
  const [controller, setController] = useState<AbortController>(null);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [paginationTotal, setPaginationTotal] = useState(1);
  const [error, setError] = useState<Error>(null);

  const [isXs, isSm] = useMaxWidth(["xs", "sm", "md"]);

  const onPageChange = (value: number) => {
    setActivePage(value);
  };

  useEffect(() => {
    setPaginationTotal(seasons?.docs.length || 1);
  }, [seasons]);

  useEffect(() => {
    setLoading(true);

    (async () => {
      try {
        const { data, controller } = await fetchWithController<SeasonsInfo>(
          `season?page=1&limit=250&sortField=airDate&sortType=1&movieId=${id}&selectFields=number&selectFields=episodes&selectFields=poster`
        );

        const seasons = data.docs
          .filter((season) => season.number !== 0)
          .sort((seasonA, seasonB) => seasonA.number - seasonB.number);
        data.docs = seasons;

        setLoading(false);
        setSeasons(data);
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
    <Box pos="relative">
      <LoadingOverlay visible={!seasons || loading} />
      {error && <ErrorElement error={error} />}
      {isSeasonsInfoType(seasons) && (
        <Stack>
          {seasons.docs.length === 0 && (
            <GrayText>Нет информации о сезонах.</GrayText>
          )}
          {seasons.docs.length !== 0 &&
            seasons.docs.slice(activePage - 1, activePage).map((season) => (
              <Stack key={season.number} align="center">
                <Image
                  src={season.poster.previewUrl ?? "/" + stubImage}
                  w="min(100%, 400px)"
                  h="auto"
                  radius="md"
                />
                <Grid columns={isXs ? 1 : isSm ? 2 : 3}>
                  {season.episodes.map((episode) => (
                    <Grid.Col span={1} key={episode.name}>
                      <Stack h="100%" justify="space-between">
                        <Title order={3}>
                          <Badge circle>{episode.number}</Badge> {episode.name}
                        </Title>
                        <Box style={{ aspectRatio: "3 / 2" }}>
                          <Image
                            h="100%"
                            src={
                              episode.still?.previewUrl ??
                              "/" + stubImageHorizontal
                            }
                          />
                        </Box>
                      </Stack>
                    </Grid.Col>
                  ))}
                </Grid>
              </Stack>
            ))}
          {seasons.docs.length !== 0 && seasons.docs.length !== 1 && (
            <Center>
              <Pagination
                radius="md"
                size={isXs ? "xs" : "md"}
                total={paginationTotal}
                onChange={onPageChange}
                withControls={!isXs}
              />
            </Center>
          )}
        </Stack>
      )}
    </Box>
  );
}
