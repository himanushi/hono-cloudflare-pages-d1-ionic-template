import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { createApp } from "./utils/createApp";

const middleware = createApp();

middleware.use("*", async (c, next) =>
  cors({
    origin: [c.env.APP_URL],
  })(c, next),
);

middleware.use("*", async (c, next) =>
  csrf({
    origin: [c.env.APP_URL],
  })(c, next),
);

middleware.use("*", secureHeaders());

export { middleware };
