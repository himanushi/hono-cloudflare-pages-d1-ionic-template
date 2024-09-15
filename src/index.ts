import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";

const app = new Hono();

app.use(compress());
app.use(
  "/*",
  cors({
    origin: ["https://example.com", "https://example.org"],
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
