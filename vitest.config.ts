import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      reporter: ["text", "html"],
      include: ["src/routes/**/*.tsx", "src/components/**/*.tsx", "src/lib/**/*.ts"],
      exclude: ["src/routeTree.gen.ts", "src/components/ui/**"],
    },
  },
});
