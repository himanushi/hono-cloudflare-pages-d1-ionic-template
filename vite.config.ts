import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "frontend") {
    return {
      build: {
        rollupOptions: {
          input: "./src/frontend.tsx",
          output: {
            entryFileNames: "static/frontend.js",
          },
        },
      },
    };
  }
  return {
    ssr: {
      external: ["react", "react-dom"],
    },
    plugins: [
      pages(),
      devServer({
        adapter,
        entry: "src/index.tsx",
      }),
    ],
  };
});
