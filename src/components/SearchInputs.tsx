import { useNavigate } from "react-router-dom";
import {
  Collapse,
  Group,
  SegmentedControl,
  Stack,
  TextInput,
} from "@mantine/core";
import { ChangeEvent, useEffect, useReducer } from "react";
import { useDisclosure } from "@mantine/hooks";

type Search = string;
function isSearch(value: unknown): value is Search {
  return typeof value === "string";
}

type Filters = { year?: string; country?: string; ageRating?: string };
function isFilters(value: unknown): value is Filters {
  return typeof value === "object" && value !== null;
}

type State = null | Search | Filters;

const reducer = (state: State, action: State) => {
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

export default function SearchInputs({
  search,
  filters,
}: {
  search: Search | null;
  filters: Filters | null;
}) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, filters ? filters : search);
  const [searchOpened, { toggle: toggleSearch }] = useDisclosure(
    isSearch(state)
  );
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(
    isFilters(state)
  );

  const onSegmentChange = (value: string) => {
    switch (value) {
      case "search": {
        if (filtersOpened) {
          toggleFilters();
        }

        const timeoutID = setTimeout(() => {
          if (!searchOpened) {
            toggleSearch();

            dispatch("");
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

            dispatch({});
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

        dispatch(null);
      default:
        break;
    }
  };

  const onNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(e.target.value);
  };

  const onFiltersInput = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ [e.target.dataset.field]: e.target.value });
  };

  useEffect(() => {
    if (isSearch(state) && state !== "") {
      navigate({ pathname: "/", search: `n=${encodeURIComponent(state)}` });
    } else if (isFilters(state)) {
      const yearComponent = state.year ? `y=${state.year}` : "";
      const countryComponent = state.country
        ? `c=${encodeURIComponent(state.country)}`
        : "";
      const ageRatingComponent = state.ageRating ? `a=${state.ageRating}` : "";

      navigate({
        pathname: "/",
        search: [yearComponent, countryComponent, ageRatingComponent]
          .filter((c) => c !== "")
          .join("&"),
      });
    } else {
      navigate({ pathname: "/" });
    }
  }, [state]);

  return (
    <Stack>
      <SegmentedControl
        data={[
          { value: "all", label: "Все фильмы" },
          { value: "filters", label: "Фильтры" },
          { value: "search", label: "Поиск" },
        ]}
        onChange={onSegmentChange}
        value={
          isFilters(state) ? "filters" : isSearch(state) ? "search" : "all"
        }
      />
      <Collapse in={searchOpened}>
        <TextInput
          placeholder="Название"
          onChange={onNameInput}
          value={isSearch(state) ? state : ""}
        />
      </Collapse>
      <Collapse in={filtersOpened}>
        <Group grow>
          <TextInput
            placeholder="Год"
            data-field="year"
            onChange={onFiltersInput}
            value={isFilters(state) && state.year ? state.year : ""}
          />
          <TextInput
            placeholder="Страна"
            data-field="country"
            onChange={onFiltersInput}
            value={isFilters(state) && state.country ? state.country : ""}
          />
          <TextInput
            placeholder="Возрастной рейтинг"
            data-field="ageRating"
            onChange={onFiltersInput}
            value={isFilters(state) && state.ageRating ? state.ageRating : ""}
          />
        </Group>
      </Collapse>
    </Stack>
  );
}
