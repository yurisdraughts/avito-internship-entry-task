import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Flex, Pagination, Select } from "@mantine/core";
import { useEventListener } from "@mantine/hooks";
import * as selectClasses from "../styles/SearchPagination/Select.module.css";
import useMaxWidth from "../util/useMaxWidth";

export default function SearchPagination({
  page,
  limit,
  total,
  withControls = true,
}: {
  page: number;
  limit: number;
  total: number;
  withControls?: boolean;
}) {
  const [paginationTotal, setPaginationTotal] = useState(
    Math.min(Math.max(page + 10 - (page % 10), 10), total)
  );
  const [activePage, setActivePage] = useState(page);
  const [pageSize, setPageSize] = useState(limit);

  const navigate = useNavigate();
  const location = useLocation();

  const isXs = useMaxWidth("xs");

  const createTo = (page: number | string, limit: number | string) => {
    return {
      pathname: `/${page}${limit !== 10 ? `/${limit}` : ""}`,
      search: location.search,
    };
  };

  const setPaginationProps = (page: number) => {
    return {
      component: Link,
      to: createTo(page, pageSize),
    };
  };

  const setPaginationControlProps = (control: "next" | "previous") => {
    switch (control) {
      case "next":
        return {
          ...setPaginationProps(activePage + 1),
          ref: preventDefault(),
        };
      case "previous":
        return {
          ...setPaginationProps(activePage - 1),
          ref: preventDefault(),
        };
      default:
        return {};
    }
  };

  const preventDefault = () => {
    return useEventListener("click", function (e) {
      if (this.hasAttribute("disabled")) {
        e.preventDefault();
      }
    });
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

  useEffect(() => {
    setPaginationTotal(Math.min(Math.max(page + 10 - (page % 10), 10), total));
  }, [total]);

  useEffect(() => {
    setActivePage(Math.min(page, total));
  }, [page]);

  useEffect(() => {
    setPageSize(limit);
  }, [limit]);

  useEffect(() => {
    if (activePage > paginationTotal) {
      setPaginationTotal(Math.min(activePage + 10, total));
    }
  }, [activePage]);

  return (
    <Flex
      align="center"
      direction={{ base: "column", md: "row" }}
      gap="md"
      justify="space-between"
    >
      <Pagination
        getControlProps={setPaginationControlProps}
        getItemProps={setPaginationProps}
        onChange={onPageChange}
        radius="md"
        siblings={1}
        size={isXs ? "xs" : "lg"}
        total={paginationTotal}
        value={activePage}
      />
      {withControls && (
        <Select
          classNames={{
            root: selectClasses.root,
            input: selectClasses.input,
          }}
          checkIconPosition="right"
          data={["10", "20", "50"]}
          defaultValue={`${pageSize}`}
          allowDeselect={false}
          inputWrapperOrder={["input", "label"]}
          label="результатов на стр."
          onChange={onPageSizeChange}
        />
      )}
    </Flex>
  );
}
