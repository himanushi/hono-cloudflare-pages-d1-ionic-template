import { zValidator } from "@hono/zod-validator";
import { desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { users } from "~/schema";

export const getUsersApi = createFactory().createHandlers(
  zValidator(
    "query",
    z.object({
      limit: z.string().transform((v) => Number.parseInt(v, 10)),
      offset: z.string().transform((v) => Number.parseInt(v, 10)),
    }),
  ),
  async (c) => {
    const { limit, offset } = c.req.valid("query");

    const db = drizzle(c.env.DB);
    const result = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.id))
      .all();

    return c.json(result);
  },
);

export const postUsersApi = createFactory().createHandlers(
  zValidator(
    "json",
    z.object({
      name: z.string(),
    }),
  ),
  async (c) => {
    const { name } = c.req.valid("json");

    const db = drizzle(c.env.DB);
    const result = await db.insert(users).values({ name }).execute();
    return c.json(result);
  },
);
