import { SegmentedControl, useMantineTheme } from "@mantine/core";
import useMaxWidth from "../util/useMaxWidth";
import { isFilters, isSearch } from "../util/inputTypeGuards";
import type { SearchState } from "../types/inputTypes";
import * as segmentedControlClasses from "../styles/SearchInputs/SegmentedControl.module.css";

export default function SegmentedInputControl({
  searchState,
  dispatchSearchState,
  searchOpened,
  toggleSearch,
  filtersOpened,
  toggleFilters,
}: {
  searchState: SearchState;
  dispatchSearchState: (value: SearchState) => void;
  searchOpened: boolean;
  toggleSearch: () => void;
  filtersOpened: boolean;
  toggleFilters: () => void;
}) {
  const theme = useMantineTheme();
  const isXs = useMaxWidth("xs");

  const onSegmentChange = (value: string) => {
    switch (value) {
      case "search": {
        if (filtersOpened) {
          toggleFilters();
        }

        const timeoutID = setTimeout(() => {
          if (!searchOpened) {
            toggleSearch();

            dispatchSearchState("");
          }
          clearTimeout(timeoutID);
        }, 200);

        break;
      }
      case "filters": {
        if (searchOpened) {
          toggleSearch();
        }

        const timeoutID = setTimeout(() => {
          if (!filtersOpened) {
            toggleFilters();

            dispatchSearchState({});
          }
          clearTimeout(timeoutID);
        }, 200);

        break;
      }
      case "all":
        if (searchOpened) {
          toggleSearch();
        }

        if (filtersOpened) {
          toggleFilters();
        }

        dispatchSearchState(null);
      default:
        break;
    }
  };
  return (
    <SegmentedControl
      color={theme.primaryColor}
      size={isXs ? "xs" : "lg"}
      classNames={{
        root: segmentedControlClasses.root,
      }}
      data={[
        { value: "all", label: "Все фильмы" },
        { value: "filters", label: "Фильтры" },
        { value: "search", label: "Поиск" },
      ]}
      onChange={onSegmentChange}
      value={
        isFilters(searchState)
          ? "filters"
          : isSearch(searchState)
          ? "search"
          : "all"
      }
    />
  );
}
