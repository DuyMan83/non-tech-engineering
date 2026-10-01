import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Test domain/ và services/ — không cần Firebase, không cần điện thoại.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
