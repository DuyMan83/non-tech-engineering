import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Test chạy trong Firebase Emulator (npm run test:emulator):
// - tests/*.rules.test.ts        : luật bảo mật Firestore
// - tests/*.integration.test.ts  : việc của app (services) chạy qua data/ thật + luật bảo mật thật
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["tests/**/*.test.ts"], environment: "node", testTimeout: 20000, fileParallelism: false },
});
