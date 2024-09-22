import { createFactory } from "hono/factory";
import { renderToString } from "react-dom/server";

export const workerApi = createFactory().createHandlers((c) => {
  return c.html(
    renderToString(
      <html lang="en">
        <head>
          <link href="/static/style.css" rel="stylesheet" />
          {import.meta.env.PROD ? (
            <script type="module" src="/static/page.js" />
          ) : (
            <script type="module" src="/src/page.tsx" />
          )}
        </head>
        <body>
          <div id="root" />
        </body>
      </html>,
    ),
  );
});
