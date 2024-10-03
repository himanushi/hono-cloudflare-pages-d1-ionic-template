import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { users } from "~/schema";
import { getMe } from "~/utils/getMe";

export const getMeApi = createFactory().createHandlers(async (c) => {
  const user = await getMe(c);
  return c.json(user);
});

export const patchMeApi = createFactory().createHandlers(
  zValidator(
    "json",
    z.object({
      name: z.string(),
    }),
  ),
  async (c) => {
    const user = await getMe(c);
    if (!user) return c.notFound();

    const db = drizzle(c.env.DB);
    const result = await db
      .update(users)
      .set({
        name: c.req.valid("json").name,
      })
      .where(eq(users.id, Number(user.id)))
      .returning({ updatedUserId: users.id });

    console.log(result);

    return c.text("ok");
  },
);
