import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  if (mode === "frontend") {
    return {
      build: {
        rollupOptions: {
          input: "./src/page.tsx",
          output: {
            entryFileNames: "static/page.js",
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
        tsconfigPaths(),
      ],
    };
  }
  return {
    ssr: {
      external: ["react", "react-dom", "@yamada-ui/react", "swr"],
    },
    plugins: [
      pages(),
      devServer({
        adapter,
        entry: "src/index.tsx",
      }),
      tsconfigPaths(),
    ],
  };
});
