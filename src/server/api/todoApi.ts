import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { getMe } from "~/server/utils/getMe";
import { todo } from "../db/schema";

export const getTodoApi = createFactory().createHandlers(
  zValidator(
    "query",
    z.object({
      limit: z.string().transform((v) => Number.parseInt(v, 10)),
      offset: z.string().transform((v) => Number.parseInt(v, 10)),
    }),
  ),
  async (c) => {
    const me = await getMe(c);

    if (!me) {
      return c.json([]);
    }

    const { limit, offset } = c.req.valid("query");
    const results = await drizzle(c.env.DB)
      .select({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        status: todo.status,
      })
      .from(todo)
      .where(and(eq(todo.userId, me.id), eq(todo.status, "pending")))
      .limit(limit)
      .offset(offset)
      .all();

    return c.json(results);
  },
);

export const postTodoApi = createFactory().createHandlers(
  zValidator(
    "json",
    z.object({
      title: z.string(),
      description: z.string().nullable(),
    }),
  ),
  async (c) => {
    const { title, description } = c.req.valid("json");
    const me = await getMe(c);

    if (!me) {
      return c.notFound();
    }

    await drizzle(c.env.DB)
      .insert(todo)
      .values({ title, description, userId: me.id })
      .execute();

    return c.text("ok");
  },
);

export const patchTodoApi = createFactory().createHandlers(
  zValidator(
    "json",
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string().nullable(),
      status: z.string(),
    }),
  ),
  async (c) => {
    const { id, title, description, status } = c.req.valid("json");
    const me = await getMe(c);

    if (!me) {
      return c.notFound();
    }

    await drizzle(c.env.DB)
      .update(todo)
      .set({ title, description, status, userId: me.id })
      .where(eq(todo.id, id))
      .execute();

    return c.text("ok");
  },
);
