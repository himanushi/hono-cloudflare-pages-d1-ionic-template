import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { users } from "../../db/schema";

export const getMe = async (c: Context<any, any, any>) => {
  const userId = await getSignedCookie(c, c.env.COOKIE_SECRET, "session");

  if (typeof userId !== "string") {
    return null;
  }

  // セッションを更新する
  await setSignedCookie(c, "session", userId, c.env.COOKIE_SECRET, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  const user = await drizzle(c.env.DB)
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(eq(users.id, Number.parseInt(userId, 10)))
    .get();

  return user ?? null;
};
