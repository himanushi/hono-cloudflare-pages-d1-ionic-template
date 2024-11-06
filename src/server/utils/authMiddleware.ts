import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import type { HonoPropsType } from "./createApp";
import { getMe } from "./getMe";

export const authMiddleware = createMiddleware<HonoPropsType>(
  async (c, next) => {
    const me = await getMe(c);

    if (!me) {
      return c.json({ error: "Unauthorized: authMiddleware" }, 401);
    }

    c.set("me", me);
    await next();
  },
);
