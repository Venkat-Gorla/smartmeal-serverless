import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css"; // causing issues with Bootstrap, can be removed?
// review other css files too
// vegorla: Bootstrap theme background color for home page?
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
