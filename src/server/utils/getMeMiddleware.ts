import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { MiddlewareHandler } from "hono";
import { getSignedCookie } from "hono/cookie";
import { users } from "../db/schema";

export const getMeMiddleware: MiddlewareHandler = async (c, next) => {
  const userId = await getSignedCookie(c, c.env.COOKIE_SECRET, "session");

  if (!userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const db = drizzle(c.env.DB);
  const user = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(eq(users.id, Number(userId)))
    .get();

  if (!user) {
    return c.json({ message: "User not found" }, 404);
  }

  c.set("user", user);
  await next();
};
