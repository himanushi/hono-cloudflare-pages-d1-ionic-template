import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

export const usersApi = createFactory().createHandlers(
  zValidator(
    "query",
    z.object({
      limit: z.number(),
      offset: z.number(),
    }),
  ),
  (c) => {
    const { limit, offset } = c.req.valid("query");

    const users = Array.from({ length: limit }).map((_, i) => ({
      id: offset + i,
      name: `User ${offset + i}`,
    }));

    return c.json({
      users,
    });
  },
);
