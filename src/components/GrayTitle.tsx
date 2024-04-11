import { Title, useMantineTheme } from "@mantine/core";
import type { PropsWithChildren } from "react";
import type { TitleProps } from "@mantine/core";

export default function GrayTitle({
  children,
  ...props
}: PropsWithChildren<TitleProps>) {
  const theme = useMantineTheme();

  return (
    <Title c={theme.colors.gray[5]} {...props}>
      {children}
    </Title>
  );
}
