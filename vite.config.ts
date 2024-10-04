import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: "./src/client/client.tsx",
          output: {
            entryFileNames: "static/client.js",
          },
          external: ["hono", "@hono/zod-validator"],
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
      external: [
        "@capacitor/preferences",
        "react",
        "react-dom",
        "react-router-dom",
        "@ionic/react",
        "@ionic/react-router",
        "@tanstack/react-query",
        "@tanstack/react-query-persist-client",
      ],
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
