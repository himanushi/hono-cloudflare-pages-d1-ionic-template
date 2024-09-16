import { useState } from "hono/jsx";
import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
  const [count, setCount] = useState(0);
  return (
    <html>
      <head>
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <button onClick={() => setCount((p) => p + 1)}>count{count}</button>
      </body>
    </html>
  );
});
