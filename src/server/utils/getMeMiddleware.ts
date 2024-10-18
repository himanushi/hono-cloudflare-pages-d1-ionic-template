import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { users } from "../db/schema";
import type { HonoType } from "./createApp";

export const getMeMiddleware = createMiddleware<HonoType>(async (c, next) => {
  const userId = await getSignedCookie(c, c.env.COOKIE_SECRET, "session");

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const db = drizzle(c.env.DB);
  const me = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(eq(users.id, Number(userId)))
    .get();

  if (!me) {
    return c.json({ error: "User not found" }, 404);
  }
  c.set("me", me);
  await next();
});
