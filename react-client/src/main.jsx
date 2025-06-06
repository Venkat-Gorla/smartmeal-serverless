import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// vegorla: Bootstrap theme background color for home page?
// - neutral palettes for a professional look
// - light/dark themes switch
// - color-accessibility options (WCAG-compliant contrast)
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
