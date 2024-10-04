import { createFactory } from "hono/factory";
import { renderToString } from "react-dom/server";

export const server = createFactory().createHandlers((c) => {
  return c.html(
    renderToString(
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css?family=Noto+Sans+JP"
            rel="stylesheet"
          />
          <link href="/static/style.css" rel="stylesheet" />
          {import.meta.env.PROD ? (
            <script type="module" src="/static/client.js" />
          ) : (
            <script type="module" src="/src/client/client.tsx" />
          )}
        </head>
        <body>
          <div id="root" />
        </body>
      </html>,
    ),
  );
});
