import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "./src/core"),
      "@adapters": path.resolve(__dirname, "./src/adapters"),
      "@infra": path.resolve(__dirname, "./src/infra"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.{test,spec}.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "src/infra/handlers/**/*.ts", // Exclude infrastructure handlers
        "tests/**",
        "biome.config.js",
      ],
      all: true,
    },
  },
});
