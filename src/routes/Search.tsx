import {
  Link,
  useLoaderData,
  useLocation,
  useNavigation,
} from "react-router-dom";
import type { Params } from "react-router-dom";
import { Card, Skeleton, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import customFetch from "../util/customFetch";
import type {
  SearchByName,
  SearchResponse,
  SearchWithFilters,
  WithControllers,
} from "../util/types";
import SearchPagination from "../components/SearchPagination";
import SearchInputs from "../components/SearchInputs";

type LoaderData = WithControllers<
  Partial<SearchWithFilters<SearchByName<SearchResponse>>>
>;

export default function Search() {
  const data = useLoaderData() as LoaderData;

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const isAnotherPage = navigation.location?.state?.anotherPage;
  const location = useLocation();

  useEffect(() => {
    return data.controllers.forEach((c) => c.abort());
  }, []);

  return (
    <Stack>
      <SearchInputs search={data.search} filters={data.filters} />
      {!data.docs && <Text>Не удалось загрузить результаты поиска.</Text>}
      {data.docs && (
        <Skeleton visible={isLoading && !isAnotherPage}>
          <Stack>
            {data.docs.map((m, i) => (
              <Skeleton key={i} visible={isLoading && isAnotherPage}>
                <Card withBorder>
                  <Link
                    to={`/movie/${m.id}`}
                    state={{
                      backToSearch: location.pathname + location.search,
                    }}
                    style={{ display: "block" }}
                  >
                    {m.name} {m.year} {m.ageRating}{" "}
                    {m.countries.map((c) => c.name).join("/")}
                  </Link>
                </Card>
              </Skeleton>
            ))}
            <SearchPagination page={data.page} limit={data.limit} />
          </Stack>
        </Skeleton>
      )}
    </Stack>
  );
}

export async function loader({
  params,
  request,
}: {
  params: Params<"page" | "limit">;
  request: Request;
}): Promise<LoaderData> {
  let page = parseInt(params.page);

  if (isNaN(page) || page < 1) {
    page = 1;
  }

  let limit = parseInt(params.limit);

  if (isNaN(limit) || limit <= 10) {
    limit = 10;
  } else if (limit >= 50) {
    limit = 50;
  } else {
    limit = 20;
  }

  const searchParams = new URL(request.url).searchParams;
  const name = searchParams.get("n");
  const year = searchParams.get("y");
  const country = searchParams.get("c");
  const ageRating = searchParams.get("a");

  let data: LoaderData, controller: AbortController;

  if (year || country || ageRating) {
    const yearComponent = year ? `&year=${year}` : "";
    const countryComponent = country
      ? `&countries.name=${encodeURIComponent(country)}`
      : "";
    const ageRatingComponent = ageRating ? `&ageRating=${ageRating}` : "";

    ({ data, controller } = await customFetch<LoaderData>(
      `movie?page=${page}&limit=${limit}${yearComponent}${ageRatingComponent}${countryComponent}`
    ));
  } else if (name) {
    ({ data, controller } = await customFetch<LoaderData>(
      `movie/search?page=${page}&limit=${limit}&query=${name}`
    ));
  } else {
    ({ data, controller } = await customFetch<LoaderData>(
      `movie?page=${page}&limit=${limit}`
    ));
  }

  if (!data) {
    return { controllers: [controller] };
  }

  data.controllers = [controller];

  if (year || country || ageRating) {
    data.filters = { year, country, ageRating };
  } else if (name) {
    data.search = name;
  }

  return data;
}
