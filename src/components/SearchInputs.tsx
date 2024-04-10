import { ChangeEvent, useEffect, useReducer } from "react";
import {
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import {
  Collapse,
  Grid,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import * as segmentedControlClasses from "../styles/SearchInputs/SegmentedControl.module.css";
import useMaxWidth from "../util/useMaxWidth";

type SearchInput = string;
function isSearch(value: unknown): value is SearchInput {
  return typeof value === "string";
}

type FiltersInput = { year?: string; country?: string; ageRating?: string };
function isFilters(value: unknown): value is FiltersInput {
  return typeof value === "object" && value !== null;
}

type SearchState = null | SearchInput | FiltersInput;

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

  const [state, dispatch] = useReducer(reducer, filters ? filters : search);
  const [debounced] = useDebouncedValue(state, 1000);

  const [searchOpened, { toggle: toggleSearch }] = useDisclosure(
    isSearch(state)
  );
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(
    isFilters(state)
  );

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
    const number = parseInt(value);
    dispatch({ ageRating: isNaN(number) ? "" : String(number) });
  };

  useEffect(() => {
    if (isSearch(debounced) && debounced !== "") {
      setSearchParams({ n: debounced });
    } else if (isFilters(debounced)) {
      setSearchParams(
        Object.fromEntries(
          Object.entries(debounced)
            .filter(([_, v]) => Boolean(v))
            .map(([k, v]) => [k[0], v])
        )
      );
    } else {
      setSearchParams({});
    }
  }, [debounced]);

  return (
    <Stack>
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
          isFilters(state) ? "filters" : isSearch(state) ? "search" : "all"
        }
      />
      <Collapse in={searchOpened}>
        <TextInput
          size="md"
          label="Название"
          onChange={onNameInput}
          placeholder="Введите название"
          value={isSearch(state) ? state : ""}
        />
      </Collapse>
      <Collapse in={filtersOpened}>
        <Grid columns={6} grow>
          <Grid.Col span={{ base: 6, sm: 3, md: 2 }}>
            <NumberInput
              size="md"
              allowDecimal={false}
              hideControls
              label="Год"
              min={1874}
              onChange={onYearInput}
              placeholder="Введите год"
              value={isFilters(state) && state.year ? state.year : ""}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 3, md: 2 }}>
            <TextInput
              size="md"
              label="Страна"
              onChange={onCountryInput}
              placeholder="Введите страну"
              value={isFilters(state) && state.country ? state.country : ""}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Select
              size="md"
              clearable
              data={["0", "6", "12", "16", "18"].map((v) => v + "+")}
              label="Возрастной рейтинг"
              onChange={onAgeRatingSelect}
              placeholder="Выберите возрастной рейтинг"
              value={
                isFilters(state) && state.ageRating ? state.ageRating + "+" : ""
              }
            />
          </Grid.Col>
        </Grid>
      </Collapse>
    </Stack>
  );
}
