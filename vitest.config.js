import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@test": path.resolve(__dirname, "services/test"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    exclude: ["react-client/**", "**/node_modules/**"],
  },
});
