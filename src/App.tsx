import * as React from "react";
import "./App.scss";
import { Pagination } from "antd";

function App() {
  return <Pagination defaultCurrent={1} total={50}></Pagination>;
}

export default App;