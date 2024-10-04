import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { users } from "../db/schema";

export const getMe = async (c: Context<any, any, any>) => {
  const sub = await getSignedCookie(c, c.env.COOKIE_SECRET, "session");

  if (typeof sub !== "string") {
    return null;
  }

  // 自身の情報を取得したタイミングでセッションを更新する
  await setSignedCookie(c, "session", sub.toString(), c.env.COOKIE_SECRET, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

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

  return user[0] ?? null;
};
