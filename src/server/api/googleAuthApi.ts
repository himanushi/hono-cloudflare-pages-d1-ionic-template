import { getAuth, processOAuthCallback, revokeSession } from "@hono/oidc-auth";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import { setSignedCookie } from "hono/cookie";
import { createFactory } from "hono/factory";
import type { Bindings } from "~/server/routes";
import { users } from "../db/schema";

export const googleAuthLoginApi = createFactory().createHandlers(
  async (c: Context<{ Bindings: Bindings }>) => {
    const auth = await getAuth(c);
    const sub = auth?.sub;

    if (typeof sub !== "string") {
      return c.redirect("/");
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

    await setSignedCookie(c, "session", sub.toString(), c.env.COOKIE_SECRET, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return c.redirect("/");
  },
);

export const googleAuthCallbackApi = createFactory().createHandlers(
  async (c) => await processOAuthCallback(c),
);

export const googleAuthLogoutApi = createFactory().createHandlers(
  async (c) => await revokeSession(c),
);
