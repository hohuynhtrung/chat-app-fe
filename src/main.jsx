import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import App from "./App.jsx";
import "./index.css";
import { store } from "@/store/store.js";

createRoot(document.getElementById("root")).render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>,
);
