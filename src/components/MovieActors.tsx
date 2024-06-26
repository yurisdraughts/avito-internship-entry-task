import { useState } from "react";
import { Grid, Image, Pagination, Stack, Text } from "@mantine/core";
import GrayText from "./GrayText";
import stubImage from "../images/stub.png";
import type { Persons } from "../types/idResponseType";

const LIMIT = 10;

export default function MovieActors({ actors }: { actors: Persons }) {
  const paginationTotal = Math.ceil(actors.length / LIMIT);

  const [activePage, setActivePage] = useState(1);

  const onPageChange = (value: number) => {
    setActivePage(value);
  };

  return (
    <>
      {actors.length === 0 && <GrayText>Информации нет.</GrayText>}
      {actors.length !== 0 && (
        <>
          <Grid columns={60} align="stretch">
            {actors
              .slice((activePage - 1) * LIMIT, activePage * LIMIT)
              .map((actor, i) => {
                return (
                  <Grid.Col
                    span={{ base: 30, xs: 20, sm: 15, md: 12, lg: 10 }}
                    key={actor.description + i}
                  >
                    <Stack h="100%" justify="space-between">
                      <Image
                        src={actor.photo}
                        fallbackSrc={stubImage}
                        h={250}
                        radius="sm"
                      />
                      {actor.name && <Text fw={700}>{actor.name}</Text>}
                      <GrayText>{actor.description}</GrayText>
                    </Stack>
                  </Grid.Col>
                );
              })}
          </Grid>
          {paginationTotal > 1 && (
            <Pagination
              radius="md"
              total={paginationTotal}
              onChange={onPageChange}
            />
          )}
        </>
      )}
    </>
  );
}
