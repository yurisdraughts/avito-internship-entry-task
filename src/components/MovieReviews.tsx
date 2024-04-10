import { useEffect, useState } from "react";
import {
  Box,
  Center,
  Divider,
  LoadingOverlay,
  Pagination,
  Skeleton,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import fetchWithController from "../util/fetchWithController";
import type { ReviewResponse } from "../types/reviewResponseType";
import useMaxWidth from "../util/useMaxWidth";
import GrayText from "./GrayText";

const dateFormatter = Intl.DateTimeFormat(["ru"], {
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

export default function MovieReviews({ id }: { id: number }) {
  const [data, setData] = useState<ReviewResponse>();
  const [controller, setController] = useState<AbortController>(null);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [paginationTotal, setPaginationTotal] = useState(1);

  const theme = useMantineTheme();
  const isXs = useMaxWidth("xs");

  const onPageChange = (value: number) => {
    setActivePage(value);
  };

  useEffect(() => {
    setPaginationTotal(data?.total || 1);
  }, [data]);

  useEffect(() => {
    setLoading(true);

    (async () => {
      const { data, controller } = await fetchWithController<ReviewResponse>(
        `review?page=${activePage}&limit=1&movieId=${id}`
      );

      setLoading(false);
      setData(data);
      setController(controller);
    })();

    return () => {
      controller?.abort();
    };
  }, [activePage]);

  return (
    <Box pos="relative">
      <LoadingOverlay visible={!data || loading} />
      <Stack>
        {data?.docs && !data.docs.length && (
          <GrayText>Никто ещё не оставил отзыв.</GrayText>
        )}
        {data?.docs &&
          !!data.docs.length &&
          data.docs.map((review) => (
            <Stack
              key={review.date}
              bg={
                review.type === "Позитивный"
                  ? theme.colors.green[0]
                  : review.type === "Нейтральный"
                  ? theme.colors.yellow[0]
                  : theme.colors.red[0]
              }
              p="md"
              styles={{ root: { borderRadius: theme.radius.md } }}
            >
              <Title order={3}>{review.title}</Title>
              <Text fw="700">{review.author}</Text>
              <Text fs="italic">
                {dateFormatter.format(new Date(review.date))}
              </Text>
              <Divider />
              <Text dangerouslySetInnerHTML={{ __html: review.review }}></Text>
            </Stack>
          ))}
        {data && !!data.docs.length && (
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
    </Box>
  );
}
