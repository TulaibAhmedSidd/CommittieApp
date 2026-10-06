import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: { include: ["app/**/__tests__/**/*.test.{js,ts}"], environment: "node" },
  resolve: { alias: { "@": path.resolve(process.cwd()) } },
});
