import { getAuth, processOAuthCallback, revokeSession } from "@hono/oidc-auth";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { setCookie } from "hono/cookie";
import { createFactory } from "hono/factory";
import { users } from "~/schema";

export const googleAuthLoginApi = createFactory().createHandlers(async (c) => {
  const auth = await getAuth(c);
  const sub = auth?.sub;

  if (typeof sub !== "string") {
    return c.text("No sub found", 400);
  }

  const db = drizzle(c.env.DB);

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.googleUserId, sub))
    .all();

  if (existingUser.length === 0) {
    await db
      .insert(users)
      .values({ googleUserId: sub, name: "未設定" })
      .execute();
  }

  setCookie(c, "session", sub, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return c.text(`Hello ${auth?.sub}!`);
});

export const googleAuthCallbackApi = createFactory().createHandlers(
  async (c) => await processOAuthCallback(c),
);

export const googleAuthLogoutApi = createFactory().createHandlers(
  async (c) => await revokeSession(c),
);
