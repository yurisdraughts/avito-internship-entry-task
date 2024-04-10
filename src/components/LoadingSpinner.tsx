import { Card, Center, Loader, Stack, Title } from "@mantine/core";

export default function LoadingSpinner() {
  return (
    <Card>
      <Stack>
        <Title order={1} ta="center">
          Идёт загрузка
        </Title>
        <Center>
          <Loader size="xl" />
        </Center>
      </Stack>
    </Card>
  );
}
