import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { users } from "../../db/schema";
import { authMiddleware } from "../utils/authMiddleware";
import type { HonoPropsType } from "../utils/createApp";

export const getMeApi = createFactory<HonoPropsType>().createHandlers(
  authMiddleware,
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json(null);
    }
    return c.json(me);
  },
);

export const patchMeApi = createFactory().createHandlers(
  authMiddleware,
  zValidator(
    "json",
    z.object({
      name: z.string(),
    }),
  ),
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await drizzle(c.env.DB)
      .update(users)
      .set({
        name: c.req.valid("json").name,
      })
      .where(eq(users.id, Number(me.id)))
      .returning({ updatedUserId: users.id });

    return c.text("ok");
  },
);
