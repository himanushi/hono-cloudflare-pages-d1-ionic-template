import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
      plugins: [
        viteStaticCopy({
          targets: [
            {
              src: "static",
              dest: "",
            },
          ],
        }),
      ],
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
