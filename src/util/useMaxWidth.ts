import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type Length = "xs" | "sm" | "md" | "lg" | "xl";

function useMaxWidth(mantineLength: Length): boolean;
function useMaxWidth(mantineLengthArray: Length[]): boolean[];

function useMaxWidth(value: Length | Length[]) {
  const theme = useMantineTheme();

  if (Array.isArray(value)) {
    return value.map((mantineLength) =>
      useMediaQuery(`(max-width: ${theme.breakpoints[mantineLength]})`)
    );
  }

  return useMediaQuery(`(max-width: ${theme.breakpoints[value]})`);
}

export default useMaxWidth;
