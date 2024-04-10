import {
  Card,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";

export default function ErrorElement({ error }: { error: Error }) {
  const theme = useMantineTheme();

  return (
    <Card bg={theme.colors[theme.primaryColor][1]}>
      <Stack>
        <Title order={1} ta="center">
          Ошибка!
        </Title>
        <Paper p="lg" bg={theme.colors[theme.primaryColor][0]}>
          <Text>{error.message}</Text>
        </Paper>
      </Stack>
    </Card>
  );
}
