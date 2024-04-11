import { useEffect, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { Collapse, Grid, Stack } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import SegmentedInputControl from "./SegmentedInputControl";
import YearInput from "./YearInput";
import CountryAutocomplete from "./CountryAutocomplete";
import AgeRatingSelect from "./AgeRatingSelect";
import MovieNameAutocomplete from "./MovieNameAutocomplete";
import { isNameQuery, isFilters } from "../util/inputTypeGuards";
import type { SearchState } from "../types/inputTypes";

const reducer = (state: SearchState, action: SearchState) => {
  if (
    typeof state === "object" &&
    state !== null &&
    typeof action === "object" &&
    action !== null
  ) {
    return { ...state, ...action };
  }

  return action;
};

export default function SearchInputs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("n");
  const year = searchParams.get("y");
  const country = searchParams.get("c");
  const ageRating = searchParams.get("a");
  const filters =
    year || country || ageRating ? { year, country, ageRating } : null;

  const [searchState, dispatchSearchState] = useReducer(
    reducer,
    filters ? filters : search
  );
  const [debouncedSearchState] = useDebouncedValue(searchState, 1000);

  const [searchOpened, { toggle: toggleSearch }] = useDisclosure(
    isNameQuery(searchState)
  );
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(
    isFilters(searchState)
  );

  useEffect(() => {
    if (isNameQuery(debouncedSearchState) && debouncedSearchState !== "") {
      setSearchParams({ n: debouncedSearchState });
    } else if (isFilters(debouncedSearchState)) {
      setSearchParams(
        Object.fromEntries(
          Object.entries(debouncedSearchState)
            .filter(([_, v]) => Boolean(v))
            .map(([k, v]) => [k[0], v])
        )
      );
    } else {
      setSearchParams({});
    }
  }, [debouncedSearchState]);

  return (
    <Stack>
      <SegmentedInputControl
        searchState={searchState}
        dispatchSearchState={dispatchSearchState}
        searchOpened={searchOpened}
        toggleSearch={toggleSearch}
        filtersOpened={filtersOpened}
        toggleFilters={toggleFilters}
      />
      <Collapse in={searchOpened}>
        <MovieNameAutocomplete
          searchState={searchState}
          dispatchSearchState={dispatchSearchState}
        />
      </Collapse>
      <Collapse in={filtersOpened}>
        <Grid columns={6} grow>
          <Grid.Col span={{ base: 6, sm: 3, md: 2 }}>
            <YearInput
              searchState={searchState}
              dispatchSearchState={dispatchSearchState}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3, md: 2 }}>
            <CountryAutocomplete
              searchState={searchState}
              dispatchSearchState={dispatchSearchState}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <AgeRatingSelect
              searchState={searchState}
              dispatchSearchState={dispatchSearchState}
            />
          </Grid.Col>
        </Grid>
      </Collapse>
    </Stack>
  );
}
