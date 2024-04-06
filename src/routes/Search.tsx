import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import type { Params } from "react-router-dom";
import { Pagination, Select, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import customFetch from "../util/customFetch";
import type { SearchResponse, WithControllers } from "../util/types";

const createTo = (page: number | string, limit: number | string) => {
  return { pathname: `/page/${page}${limit !== 10 ? `/${limit}` : ""}` };
};

type LoaderData = WithControllers<Partial<SearchResponse>>;

export default function Search() {
  const data = useLoaderData() as LoaderData;

  if (!data.docs) {
    return <>Не удалось загрузить результаты поиска.</>;
  }

  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  const [paginationTotal, setPaginationTotal] = useState(10);
  const [activePage, setActivePage] = useState(data.page);
  const [pageSize, setPageSize] = useState(data.limit);

  const onPageChange = (value: number) => {
    setActivePage(value);

    if (paginationTotal - value < 5) {
      setPaginationTotal((pt) => pt + 10);
    } else if (paginationTotal - value > 15) {
      setPaginationTotal(() => Math.ceil(value / 10) * 10);
    }
  };

  const onPageSizeChange = (value: string | null) => {
    const newPageSize = parseInt(value);
    const newActivePage = Math.ceil((activePage * pageSize) / newPageSize);

    setPageSize(newPageSize);
    setActivePage(newActivePage);

    navigate(createTo(newActivePage, newPageSize));
  };

  const setPaginationProps = (page: number) => {
    return {
      component: Link,
      to: createTo(page, pageSize),
    };
  };

  useEffect(() => {
    return data.controllers.forEach((c) => c.abort());
  }, []);

  return (
    <>
      {data.docs.map((m, i) => (
        <Skeleton visible={navigation.state === "loading"} key={i}>
          <Link
            to={`/movie/${m.id}`}
            state={{ backToSearch: location.pathname + location.search }}
            style={{ display: "block" }}
          >
            {m.name}
          </Link>
        </Skeleton>
      ))}
      <Select
        checkIconPosition="right"
        data={["10", "20", "50"]}
        defaultValue={`${pageSize}`}
        label="Число фильмов на странице:"
        onChange={onPageSizeChange}
      />
      <Pagination
        color="#f50"
        getControlProps={(control) => {
          switch (control) {
            case "first":
              return setPaginationProps(1);
            case "last":
              return setPaginationProps(paginationTotal);
            case "next":
              return setPaginationProps(activePage + 1);
            case "previous":
              return setPaginationProps(activePage - 1);
            default:
              return {};
          }
        }}
        getItemProps={(page) => setPaginationProps(page)}
        onChange={onPageChange}
        radius="md"
        siblings={2}
        total={paginationTotal}
        value={activePage}
        withEdges
      />
    </>
  );
}

export async function loader({
  params,
}: {
  params: Params<"page" | "limit">;
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
  const { data, controller } = await customFetch<LoaderData>(
    `movie?page=${page}&limit=${limit}`
  );

  if (!data) {
    return { controllers: [controller] };
  }

  data.controllers = [controller];

  return data;
}
