import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import ReactDOMServer from "react-dom/server";
import { z } from "zod";

const app = new Hono();

const route = app.get(
  "/hello",
  zValidator(
    "query",
    z.object({
      name: z.string(),
    }),
  ),
  (c) => {
    const { name } = c.req.valid("query");
    return c.json({
      message: `Hello! ${name}`,
    });
  },
);

export type AppType = typeof route;

app.get("*", (c) => {
  return c.html(
    ReactDOMServer.renderToString(
      <html lang="en">
        <head>
          {import.meta.env.PROD ? (
            <script type="module" src="/static/frontend.js" />
          ) : (
            <script type="module" src="/src/frontend.tsx" />
          )}
        </head>
        <body>
          <div id="root" />
        </body>
      </html>,
    ),
  );
});

export default app;
