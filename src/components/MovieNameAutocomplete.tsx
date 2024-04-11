import { useEffect } from "react";
import { Autocomplete } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { isSearch } from "../util/inputTypeGuards";
import type { SearchState } from "../types/inputTypes";

const LOCAL_STORAGE_KEY = "kinopoisk-api-search";

export default function MovieNameAutocomplete({
  searchState,
  dispatchSearchState,
}: {
  searchState: SearchState;
  dispatchSearchState: (value: SearchState) => void;
}) {
  const [nameSearchHistory, setNameSearchHistory] = useDebouncedState<string[]>(
    localStorage
      ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]")
      : [],
    1000
  );

  const onNameInput = (value: string) => {
    dispatchSearchState(value);

    setNameSearchHistory((search) => {
      if (value === "") {
        return search;
      }

      return [...search, value].filter((el, i, arr) => {
        return arr.indexOf(el) === i;
      });
    });
  };

  useEffect(() => {
    return () => {
      if (localStorage) {
        const saved = JSON.stringify(
          nameSearchHistory.slice(nameSearchHistory.length - 20).sort()
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, saved);
      }
    };
  }, [nameSearchHistory]);

  return (
    <Autocomplete
      size="md"
      data={nameSearchHistory}
      label="Название"
      onChange={onNameInput}
      placeholder="Введите название"
      value={isSearch(searchState) ? searchState : ""}
    />
  );
}
