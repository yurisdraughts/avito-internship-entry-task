import { Link, Outlet } from "react-router-dom";
import { AppShell, Container, Image, useMantineTheme } from "@mantine/core";
import logo from "./images/logo.png";

export default function Root() {
  const theme = useMantineTheme();

  return (
    <AppShell>
      <AppShell.Header pos="static" h={70} bg={theme.black}>
        <Link to="/">
          <Image h="100%" w="auto" ml={theme.spacing.md} src={logo} />
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
