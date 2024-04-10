import { Title, useMantineTheme } from "@mantine/core";
import type { TitleProps } from "@mantine/core";
import { PropsWithChildren } from "react";

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
