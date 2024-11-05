import { zValidator } from "@hono/zod-validator";
import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { z } from "zod";
import { getMeMiddleware } from "~/server/utils/getMeMiddleware";
import { todo, todoStatusEnum } from "../../db/schema";
import type { HonoType } from "../utils/createApp";

export const getTodoApi = createFactory<HonoType>().createHandlers(
  getMeMiddleware,
  zValidator(
    "query",
    z.object({
      order: z.enum(["asc", "desc"]).default("asc").nullable(),
      limit: z.string().transform((v) => Number.parseInt(v, 10)),
      offset: z.string().transform((v) => Number.parseInt(v, 10)),
    }),
  ),
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { limit, offset, order } = c.req.valid("query");
    const results = await drizzle(c.env.DB)
      .select({
        id: todo.id,
        title: todo.title,
        status: todo.status,
      })
      .from(todo)
      .where(and(eq(todo.userId, me.id), eq(todo.status, "pending")))
      .limit(limit)
      .offset(offset)
      .orderBy(order === "asc" ? asc(todo.id) : desc(todo.id))
      .all();

    return c.json({ data: results });
  },
);

export const postTodoApi = createFactory().createHandlers(
  getMeMiddleware,
  zValidator(
    "json",
    z.object({
      title: z.string(),
    }),
  ),
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const { title } = c.req.valid("json");
    await drizzle(c.env.DB)
      .insert(todo)
      .values({ title, userId: me.id })
      .execute();

    return c.json({ data: "ok" });
  },
);

export const patchTodoApi = createFactory().createHandlers(
  getMeMiddleware,
  zValidator(
    "param",
    z.object({
      id: z.string().transform((v) => Number.parseInt(v, 10)),
    }),
  ),
  zValidator(
    "json",
    z.object({
      status: z.enum(todoStatusEnum),
    }),
  ),
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const { id } = c.req.valid("param");
    const { status } = c.req.valid("json");
    await drizzle(c.env.DB)
      .update(todo)
      .set({ status, userId: me.id })
      .where(and(eq(todo.id, id), eq(todo.userId, me.id)))
      .execute();

    return c.json({ data: "ok" });
  },
);
