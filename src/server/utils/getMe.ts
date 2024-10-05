import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { users } from "../db/schema";

export const getMe = async (c: Context<any, any, any>) => {
  const userId = await getSignedCookie(c, c.env.COOKIE_SECRET, "session");

  if (typeof userId !== "string") {
    return null;
  }

  // 自身の情報を取得したタイミングでセッションを更新する
  await setSignedCookie(c, "session", userId, c.env.COOKIE_SECRET, {
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
    })
    .from(users)
    .where(eq(users.id, Number.parseInt(userId, 10)))
    .limit(1)
    .all();

  return user[0] ?? null;
};
