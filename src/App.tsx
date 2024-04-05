import { useState } from "react";
import { Pagination, Input } from "antd";
import type { SearchProps } from "antd/es/input";
import type { MovieQueryResponse } from "./util/types";
import MovieFetcher from "./components/MovieFetcher";
import MovieList from "./components/MovieList";

const token = process.env.TOKEN;
const defaultCurrent = 1;
const defaultPageSize = 10;
const { Search } = Input;

function App() {
  const [data, setData] = useState<MovieQueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(defaultCurrent);
  const [limit, setLimit] = useState(defaultPageSize);
  const [name, setName] = useState("");

  const onPageChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setName(encodeURIComponent(value));
  };

  return (
    <MovieFetcher
      page={page}
      limit={limit}
      token={token}
      name={name}
      setLoading={setLoading}
      setData={setData}
    >
      <Search
        size="large"
        placeholder="Поиск фильмов и сериалов по названию"
        allowClear
        onSearch={onSearch}
        enterButton="Поиск"
        loading={loading}
      />
      {data && <MovieList data={data} loading={loading} />}
      {data && (
        <Pagination
          current={page}
          defaultCurrent={defaultCurrent}
          defaultPageSize={defaultPageSize}
          pageSizeOptions={[10, 20, 50]}
          total={data.total}
          showSizeChanger
          hideOnSinglePage
          onChange={onPageChange}
        ></Pagination>
      )}
    </MovieFetcher>
  );
}

export default App;
