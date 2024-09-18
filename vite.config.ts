import build from "@hono/vite-build/cloudflare-pages";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "production") {
    return {
      build: {
        rollupOptions: {
          input: "./src/client.tsx",
          output: {
            entryFileNames: "static/client.js",
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
      build(),
      devServer({
        adapter,
        exclude: ["/*", ...defaultOptions.exclude],
        entry: "src/index.tsx",
      }),
    ],
  };
});

// export default defineConfig({
//   plugins: [
//     build(),
//     devServer({
//       adapter,
//       entry: 'src/index.tsx'
//     })
//   ]
// })
