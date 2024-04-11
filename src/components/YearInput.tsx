import { NumberInput } from "@mantine/core";
import type { SearchState } from "../types/inputTypes";
import { isFilters } from "../util/inputTypeGuards";

export default function YearInput({
  searchState,
  dispatchSearchState,
}: {
  searchState: SearchState;
  dispatchSearchState: (value: SearchState) => void;
}) {
  const onYearInput = (value: number | string) => {
    dispatchSearchState({ year: String(value) });
  };

  return (
    <NumberInput
      size="md"
      allowDecimal={false}
      hideControls
      label="Год"
      min={1874}
      onChange={onYearInput}
      placeholder="Введите год"
      value={isFilters(searchState) && searchState.year ? searchState.year : ""}
    />
  );
}
