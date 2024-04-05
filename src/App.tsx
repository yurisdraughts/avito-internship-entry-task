import { useEffect, useState } from "react";
import { Pagination, Input, Typography, Space, Flex, InputNumber } from "antd";
import type { Movie } from "./util/types";
import MovieList from "./components/MovieList";

const { Search } = Input;
const { Text } = Typography;

const token = process.env.TOKEN;
const host = "https://api.kinopoisk.dev/v1.4/movie";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [downloadPage, setDownloadPage] = useState(1);
  const [query, setQuery] = useState("");

  const onPageChange = (pageNumber: number, _: number) => {
    setCurrentPage(() => pageNumber);
  };

  const onPageSizeChange = (_: number, newSize: number) => {
    setPageSize(() => newSize);
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovies(() => []);
    setCurrentPage(() => 1);
    setDownloadPage(() => 1);
    setQuery(() => encodeURIComponent(event.target.value));
  };

  useEffect(() => {
    const controller = new AbortController();

    if (movies.length <= pageSize * currentPage) {
      const signal = controller.signal;
      setLoading(true);

      const request = new Request(
        `${host}/search?page=${downloadPage}&limit=50${
          query ? `&query=${query}` : ""
        }`,
        {
          method: "GET",
          headers: { accept: "application/json", "X-API-KEY": token },
          signal,
        }
      );

      fetch(request)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          return response.json();
        })
        .then((data) => {
          setLoading(false);
          setMovies((movies) => movies.concat(data.docs));
          setDownloadPage((counter) => counter + 1);
        })
        .catch((err) => console.error(err));
    }

    return () => {
      controller.abort();
    };
  }, [movies, currentPage, pageSize, query]);

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Search
        size="large"
        placeholder="Поиск фильмов и сериалов по названию"
        allowClear
        onChange={onSearch}
      />
      <MovieList
        movies={movies}
        from={pageSize * (currentPage - 1)}
        to={pageSize * currentPage}
        loading={loading}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        defaultCurrent={1}
        defaultPageSize={10}
        pageSizeOptions={[10, 20, 50]}
        total={movies.length}
        showSizeChanger
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
      ></Pagination>
    </Space>
  );
}

export default App;
