import { createFactory } from "hono/factory";
import { renderToString } from "react-dom/server";

export const serverApi = createFactory().createHandlers((c) => {
  return c.html(
    renderToString(
      <html lang="en">
        <head>
          <link href="/static/style.css" rel="stylesheet" />
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
