import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { getSignedCookie } from "hono/cookie";
import { users } from "~/schema";

export const getMe = async (c: Context<any, any, any>) => {
  const sub = await getSignedCookie(c, c.env.COOKIE_SECRET, "session");
  if (typeof sub !== "string") {
    return null;
  }

  const db = drizzle(c.env.DB);
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      googleUserId: users.googleUserId,
    })
    .from(users)
    .where(eq(users.googleUserId, sub))
    .limit(1)
    .all();

  console.log(user);

  return user[0] ?? null;
};
