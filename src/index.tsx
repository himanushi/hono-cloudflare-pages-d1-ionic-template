import { Hono } from "hono";
import { useState } from "hono/jsx";
import { renderToString } from "react-dom/server";

const app = new Hono();

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{count}</h1>
      <button type="button" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

app.get("/", (c) => {
  return c.html(
    renderToString(
      <html lang="en">
        <body>
          <Counter />
        </body>
      </html>,
    ),
  );
});

export default app;
