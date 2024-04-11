import { Select } from "@mantine/core";
import { isFilters } from "../util/inputTypeGuards";
import type { SearchState } from "../types/inputTypes";

export default function AgeRatingSelect({
  searchState,
  dispatchSearchState,
}: {
  searchState: SearchState;
  dispatchSearchState: (value: SearchState) => void;
}) {
  const onAgeRatingSelect = (value: string | null) => {
    const number = parseInt(value);
    dispatchSearchState({ ageRating: isNaN(number) ? "" : String(number) });
  };

  return (
    <Select
      size="md"
      clearable
      data={["0", "6", "12", "16", "18"].map((v) => v + "+")}
      label="Возрастной рейтинг"
      onChange={onAgeRatingSelect}
      placeholder="Выберите возрастной рейтинг"
      value={
        isFilters(searchState) && searchState.ageRating
          ? searchState.ageRating + "+"
          : ""
      }
    />
  );
}
