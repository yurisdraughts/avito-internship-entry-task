import { useEffect } from "react";
import { Link, Outlet, useMatches } from "react-router-dom";
import { AppShell, Container, Image, useMantineTheme } from "@mantine/core";
import logo from "./images/logo.png";

export default function Root() {
  const theme = useMantineTheme();
  const { handle, data } = useMatches().at(-1);
  // @ts-ignore
  const title = handle && handle.title(data);

  useEffect(() => {
    title?.then((title: string) => {
      if (title) {
        document.title = title;
      }
    });
  }, [handle, data]);

  return (
    <AppShell>
      <AppShell.Header pos="static" h={70} bg={theme.black}>
        <Link to="/">
          <Image h="100%" w="auto" ml={theme.spacing.md} src={"/" + logo} />
        </Link>
      </AppShell.Header>
      <AppShell.Main className="main" py={20} bg={theme.colors.gray[2]}>
        <Container>
          <Outlet />
        </Container>
      </AppShell.Main>
      <AppShell.Footer pos="static" h={70} bg={theme.black}></AppShell.Footer>
    </AppShell>
  );
}
