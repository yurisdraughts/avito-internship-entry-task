import { useNavigate } from "react-router-dom";
import {
  Collapse,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
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

  const onCountryInput = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ country: e.target.value });
  };

  const onYearInput = (value: number | string) => {
    dispatch({ year: String(value) });
  };

  const onAgeRatingSelect = (value: string | null) => {
    dispatch({ ageRating: value });
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
          label="Название"
          onChange={onNameInput}
          placeholder="Введите название"
          value={isSearch(state) ? state : ""}
        />
      </Collapse>
      <Collapse in={filtersOpened}>
        <Group grow>
          <NumberInput
            allowDecimal={false}
            hideControls
            label="Год"
            onChange={onYearInput}
            placeholder="Введите год"
            value={isFilters(state) && state.year ? state.year : ""}
          />
          <TextInput
            label="Страна"
            onChange={onCountryInput}
            placeholder="Введите страну"
            value={isFilters(state) && state.country ? state.country : ""}
          />
          <Select
            clearable
            data={["0", "6", "12", "16", "18"].map((v) => v + "+")}
            label="Возрастной рейтинг"
            onChange={onAgeRatingSelect}
            placeholder="Выберите возрастной рейтинг"
            value={isFilters(state) && state.ageRating ? state.ageRating : ""}
          />
        </Group>
      </Collapse>
    </Stack>
  );
}
