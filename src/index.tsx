import { Hono } from "hono";
import ReactDOMServer from "react-dom/server";

const app = new Hono();

app.get("/api/clock", (c) => {
  return c.json({
    time: new Date().toLocaleTimeString(),
  });
});

app.get("*", (c) => {
  return c.html(
    ReactDOMServer.renderToString(
      <html lang="ja">
        <head>
          {import.meta.env.PROD ? (
            <script type="module" src="/static/client.js" />
          ) : (
            <script type="module" src="/src/client.tsx" />
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
