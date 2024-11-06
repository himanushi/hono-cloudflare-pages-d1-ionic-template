import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import type { HonoPropsType } from "./createApp";
import { getMe } from "./getMe";

export const authMiddleware = createMiddleware<HonoPropsType>(
  async (c, next) => {
    const userId = await getSignedCookie(c, c.env.COOKIE_SECRET, "session");

    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const me = await getMe(c);

    if (!me) {
      return c.json({ error: "User not found" }, 404);
    }

    c.set("me", me);
    await next();
  },
);
