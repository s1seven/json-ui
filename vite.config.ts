import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [tsconfigPaths(), dts()],
  resolve: {
    alias: {
      "node-fetch": "cross-fetch",
    },
  },
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "json-ui",
      fileName: (format) => `json-ui.${format}.js`,
    },
    rollupOptions: {
      output: {
        dir: "dist",
      },
    },
  },
});
