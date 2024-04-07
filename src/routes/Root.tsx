import { Outlet } from "react-router-dom";
import { AppShell, Container } from "@mantine/core";

export default function Root() {
  return (
    <AppShell>
      <AppShell.Header pos="static" h={70}></AppShell.Header>
      <AppShell.Main className="main" my={20}>
        <Container>
          <Outlet />
        </Container>
      </AppShell.Main>
      <AppShell.Footer pos="static" h={70}></AppShell.Footer>
    </AppShell>
  );
}
