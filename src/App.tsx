import { useState } from "react";
import { Pagination } from "antd";
import type { MovieQueryResponse } from "./util/types";
import MovieFetcher from "./components/MovieFetcher";
import MovieList from "./components/MovieList";

function App() {
  const token = process.env.TOKEN;
  const defaultCurrent = 1;
  const defaultPageSize = 10;

  const [data, setData] = useState<MovieQueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(defaultCurrent);
  const [limit, setLimit] = useState(defaultPageSize);

  const onPageChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };

  return (
    <MovieFetcher
      page={page}
      limit={limit}
      token={token}
      setLoading={setLoading}
      setData={setData}
    >
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
