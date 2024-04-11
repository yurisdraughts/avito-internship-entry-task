import { useEffect, useState } from "react";
import { Autocomplete } from "@mantine/core";
import { isFilters } from "../util/inputTypeGuards";
import { fetchCountryList } from "../util/fetchWithController";
import type { SearchState } from "../types/inputTypes";

export default function CountryAutocomplete({
  searchState,
  dispatchSearchState,
}: {
  searchState: SearchState;
  dispatchSearchState: (value: SearchState) => void;
}) {
  const [data, setData] = useState<string[]>([]);
  const [controller, setController] = useState<AbortController>(null);

  const onCountryInput = (value: string) => {
    dispatchSearchState({ country: value });
  };

  useEffect(() => {
    (async () => {
      try {
        const { data, controller } = await fetchCountryList<{ name: string }[]>(
          `movie/possible-values-by-field?field=countries.name`
        );

        setData(data.map((country) => country.name));
        setController(controller);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      controller?.abort();
    };
  }, []);

  return (
    <Autocomplete
      size="md"
      label="Страна"
      onChange={onCountryInput}
      placeholder="Введите страну"
      value={
        isFilters(searchState) && searchState.country ? searchState.country : ""
      }
      data={data}
    />
  );
}
