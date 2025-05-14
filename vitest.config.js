import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@test": path.resolve(__dirname, "test"),
    },
  },
  test: {
    globals: true,
    environment: "node",
  },
});
