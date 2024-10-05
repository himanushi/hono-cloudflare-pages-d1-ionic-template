import {
  getAuth,
  oidcAuthMiddleware,
  processOAuthCallback,
  revokeSession,
} from "@hono/oidc-auth";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { deleteCookie, setSignedCookie } from "hono/cookie";
import { createFactory } from "hono/factory";
import { users } from "../db/schema";
import type { Bindings } from "../utils/createApp";

export const authLoginApi = createFactory().createHandlers(
  oidcAuthMiddleware(),
  async (c: Context<{ Bindings: Bindings }>) => {
    const auth = await getAuth(c);
    const sub = auth?.sub;

    if (typeof sub !== "string") {
      return c.redirect("/");
    }

    const db = drizzle(c.env.DB);

    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.googleUserId, sub))
      .all();

    if (existingUser.length === 0) {
      await db
        .insert(users)
        .values({ googleUserId: sub, name: "未設定" })
        .execute();

      existingUser = await db
        .select()
        .from(users)
        .where(eq(users.googleUserId, sub))
        .all();
    }

    const user = existingUser[0];

    await setSignedCookie(
      c,
      "session",
      user.id.toString(),
      c.env.COOKIE_SECRET,
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      },
    );

    return c.redirect("/");
  },
);

export const authCallbackApi = createFactory().createHandlers(
  async (c) => await processOAuthCallback(c),
);

export const authLogoutApi = createFactory().createHandlers(async (c) => {
  deleteCookie(c, "session");
  await revokeSession(c);
  return c.redirect("/");
});
