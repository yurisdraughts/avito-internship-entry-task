import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Group, Pagination, Select } from "@mantine/core";
import { useEventListener } from "@mantine/hooks";

export default function SearchPagination({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const [paginationTotal, setPaginationTotal] = useState(10);
  const [activePage, setActivePage] = useState(page);
  const [pageSize, setPageSize] = useState(limit);

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
      setPaginationTotal((pt) => pt + 10);
    } else if (paginationTotal - value > 15) {
      setPaginationTotal(() => Math.ceil(value / 10) * 10);
    }
  };

  const onPageSizeChange = (value: string | null) => {
    const newPageSize = !value ? 1 : parseInt(value);
    const newActivePage = Math.ceil((activePage * pageSize) / newPageSize);
    setPageSize(newPageSize);
    setActivePage(newActivePage);

    navigate(createTo(newActivePage, newPageSize));
  };

  const setPaginationProps = (page: number) => {
    return {
      component: Link,
      to: createTo(page, pageSize),
      state: { anotherPage: true },
    };
  };

  const preventDefault = () =>
    useEventListener("click", function (e) {
      if (this.hasAttribute("disabled")) {
        e.preventDefault();
      }
    });

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
        withEdges
      />
      <Select
        checkIconPosition="right"
        data={["10", "20", "50"]}
        defaultValue={`${pageSize}`}
        inputWrapperOrder={["input", "label"]}
        label="на стр."
        onChange={onPageSizeChange}
      />
    </Group>
  );
}
