import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Group, Pagination, Select } from "@mantine/core";
import { useEventListener } from "@mantine/hooks";

export default function SearchPagination({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}) {
  const [paginationTotal, setPaginationTotal] = useState(Math.min(10, total));
  const [activePage, setActivePage] = useState(page);
  const [pageSize, setPageSize] = useState(limit);

  useEffect(() => {
    setPaginationTotal(Math.min(10, total));
  }, [total]);

  useEffect(() => {
    setActivePage(Math.min(page, total));
  }, [page]);

  useEffect(() => {
    setPageSize(limit);
  }, [limit]);

  const navigate = useNavigate();
  const location = useLocation();

  const createTo = (page: number | string, limit: number | string) => {
    return {
      pathname: `/${page}${limit !== 10 ? `/${limit}` : ""}`,
      search: location.search,
    };
  };

  const onPageChange = (value: number) => {
    setActivePage(value);

    if (paginationTotal - value < 5) {
      setPaginationTotal((pt) => Math.min(pt + 10, total));
    } else if (paginationTotal - value > 15) {
      setPaginationTotal(() => Math.ceil(value / 10) * 10);
    }
  };

  const onPageSizeChange = (value: string | null) => {
    const newPageSize = !value ? 1 : parseInt(value);
    const newActivePage = Math.min(
      Math.ceil((activePage * pageSize) / newPageSize),
      total
    );
    setPageSize(newPageSize);
    setActivePage(Math.min(newActivePage, paginationTotal));

    navigate(createTo(newActivePage, newPageSize));
  };

  const setPaginationProps = (page: number) => {
    return {
      component: Link,
      to: createTo(page, pageSize),
      state: { anotherPage: true },
    };
  };

  const preventDefault = () => {
    return useEventListener("click", function (e) {
      if (this.hasAttribute("disabled")) {
        e.preventDefault();
      }
    });
  };

  return (
    <Group justify="space-between">
      <Pagination
        getControlProps={(control) => {
          switch (control) {
            case "first":
              return { ...setPaginationProps(1), ref: preventDefault() };
            case "last":
              return setPaginationProps(paginationTotal);
            case "next":
              return setPaginationProps(activePage + 1);
            case "previous":
              return {
                ...setPaginationProps(activePage - 1),
                ref: preventDefault(),
              };
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
        withEdges={paginationTotal > 5}
        withControls={paginationTotal > 5}
      />
      <Select
        checkIconPosition="right"
        data={["10", "20", "50"]}
        defaultValue={`${pageSize}`}
        inputWrapperOrder={["input", "label"]}
        label="результатов на стр."
        onChange={onPageSizeChange}
        w={`${"результатов на стр.".length}ch`}
      />
    </Group>
  );
}
