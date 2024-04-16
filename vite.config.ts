import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
  },
  base: "/dashboard/",
  plugins: [
    remix({
      basename: "/dashboard/",
      ssr: false,
    }),
    tsconfigPaths(),
  ],
});
