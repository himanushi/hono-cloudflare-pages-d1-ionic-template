import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name"),
    googleUserId: text("googleUserId").unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`,
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`,
    ),
  },
  (table) => ({
    googleUserIdIndex: index("idx_googleUserId").on(table.googleUserId),
  }),
);

export const todoStatusEnum = ['pending', 'completed'] as const;
export type TodoStatus = typeof todoStatusEnum[number];

export const todo = sqliteTable(
  "todo",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    status: text("status").$type<TodoStatus>().default('pending'),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`,
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`,
    ),
  },
  (table) => ({
    statusIndex: index("idx_status").on(table.status),
    userIdIndex: index("idx_userId").on(table.userId),
  }),
);
