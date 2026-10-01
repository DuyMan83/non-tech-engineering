import { defineConfig } from "vitest/config";

// Test luật bảo mật Firestore — chạy trong Firebase Emulator (npm run test:rules).
export default defineConfig({
  test: { include: ["tests/**/*.test.ts"], environment: "node", testTimeout: 20000, fileParallelism: false },
});
