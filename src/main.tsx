import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@mantine/core/styles.css";
import '@mantine/carousel/styles.css';
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ColorSchemeScript />
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </>
);
