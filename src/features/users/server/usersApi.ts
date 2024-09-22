import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

export const usersApi = createFactory().createHandlers(
  zValidator(
    "query",
    z.object({
      limit: z.string().transform((v) => Number.parseInt(v, 10)),
      offset: z.string().transform((v) => Number.parseInt(v, 10)),
    }),
  ),
  (c) => {
    const { limit, offset } = c.req.valid("query");

    const users = Array.from({ length: limit }).map((_, i) => ({
      id: offset + i,
      name: `User ${offset + i}`,
    }));

    return c.json(users);
  },
);
