import path from "node:path";
import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";
import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineWorkersConfig(async ({ mode }) => {
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
  if (mode === "server") {
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
      poolOptions: {
        workers: {
          miniflare: {},
          wrangler: { configPath: "./wrangler.toml" },
        },
      },
    };
  }

  // test
  const migrationsPath = path.join(__dirname, "src", "db", "migrations");
  const migrations = await readD1Migrations(migrationsPath);

  return {
    test: {
      setupFiles: ["./test/apply-migrations.ts"],
      poolOptions: {
        workers: {
          singleWorker: true,
          wrangler: {
            configPath: "./wrangler.toml",
          },
          miniflare: {
            bindings: { TEST_MIGRATIONS: migrations },
          },
        },
      },
    },
    plugins: [
      pages(),
      devServer({
        adapter,
        entry: "src/index.tsx",
      }),
      tsconfigPaths(),
    ],
    poolOptions: {
      workers: {
        miniflare: {},
        wrangler: { configPath: "./wrangler.toml" },
      },
    },
  };
});
