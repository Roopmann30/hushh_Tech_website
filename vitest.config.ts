import { defineConfig } from "vitest/config";


export default defineConfig({
  plugins: [],

  test: {
    globals: true,
    environment: "jsdom",

    setupFiles: ["./tests/setup.ts"],

    include: ["tests/**/*.test.ts"],

    exclude: [
      "node_modules/**",
      "tests/ndaIntegration.test.ts",
    ],

    coverage: {
      reporter: ["text", "json", "html"],
    },

    testTimeout: 15000,
  },
});