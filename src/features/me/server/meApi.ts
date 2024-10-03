import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { getSignedCookie } from "hono/cookie";
import { createFactory } from "hono/factory";
import { users } from "~/schema";

export const meApi = createFactory().createHandlers(async (c) => {
  const sub = await getSignedCookie(c, "session", c.env.COOKIE_SECRET);
  if (typeof sub !== "string") {
    return c.json(null);
  }

  const db = drizzle(c.env.DB);
  const user = await db
    .select({
      name: users.name,
      googleUserId: users.googleUserId,
    })
    .from(users)
    .where(eq(users.googleUserId, sub))
    .limit(1)
    .all();

  return c.json(user[0]);
});
