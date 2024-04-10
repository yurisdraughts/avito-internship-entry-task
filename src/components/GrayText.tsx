import { Text, useMantineTheme } from "@mantine/core";
import type { TextProps } from "@mantine/core";
import { PropsWithChildren } from "react";

export default function GrayText({
  children,
  ...props
}: PropsWithChildren<TextProps>) {
  const theme = useMantineTheme();

  return (
    <Text c={theme.colors.gray[5]} {...props}>
      {children}
    </Text>
  );
}
