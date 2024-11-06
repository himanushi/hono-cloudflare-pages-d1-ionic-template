import { env } from "cloudflare:test";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { todo, users } from "~/db/schema";
import type { HonoType } from "../utils/createApp";

const MOCK_ENV = {
  DB: env.DB,
};

let app: HonoType;
const user1 = { id: 1, name: "Test User" };
const user2 = { id: 2, name: "Test User2" };

const setupAuthMiddleware = async (user: any) => {
  vi.resetModules();
  vi.doMock("~/server/utils/authMiddleware", () => ({
    authMiddleware: (c: any, next: any) => {
      c.set("me", user);
      return next();
    },
  }));
  app = (await import("~/server/routes")).app;
};

const setupTestData = async () => {
  await drizzle(env.DB).insert(users).values([user1, user2]).execute();
  await drizzle(env.DB)
    .insert(todo)
    .values([
      { title: "Test Todo 1", userId: user1.id },
      { title: "Test Todo 2", userId: user1.id },
      { title: "Test Todo 3", userId: user2.id },
    ])
    .execute();
};

describe("GET /api/todo - Authenticated", () => {
  beforeEach(async () => {
    await setupAuthMiddleware(user1);
    await setupTestData();
  });

  it("?limit=5&offset=0", async () => {
    const res = await app.request("/api/todo?limit=5&offset=0", {}, MOCK_ENV);
    expect(res.status).toBe(200);
    const jsonResponse = (await res.json()) as { data: any[] };

    expect(jsonResponse.data).toEqual([
      { id: 1, title: "Test Todo 1", status: "pending" },
      { id: 2, title: "Test Todo 2", status: "pending" },
    ]);
  });

  it("?limit=1&offset=0&order=desc", async () => {
    const res = await app.request(
      "/api/todo?limit=1&offset=0&order=desc",
      {},
      MOCK_ENV,
    );
    expect(res.status).toBe(200);
    const jsonResponse = (await res.json()) as { data: any[] };

    expect(jsonResponse.data).toEqual([
      { id: 2, title: "Test Todo 2", status: "pending" },
    ]);
  });
});

describe("GET /api/todo - Unauthorized", () => {
  beforeEach(async () => {
    await setupAuthMiddleware(null);
    await setupTestData();
  });

  it("?limit=5&offset=0", async () => {
    const res = await app.request("/api/todo?limit=5&offset=0", {}, MOCK_ENV);
    expect(res.status).toBe(401);
  });
});

describe("POST /api/todo - Authenticated", () => {
  beforeEach(async () => {
    await setupAuthMiddleware(user1);
    await setupTestData();
  });

  it("追加したToDoが返却される", async () => {
    const res = await app.request(
      "/api/todo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Todo" }),
      },
      MOCK_ENV,
    );
    expect(res.status).toBe(200);
    const jsonResponse = (await res.json()) as { data: string };
    expect(jsonResponse.data).toBe("ok");

    const todos = await drizzle(env.DB)
      .select()
      .from(todo)
      .where(eq(todo.title, "New Todo"))
      .execute();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe("New Todo");
    expect(todos[0].userId).toBe(user1.id);
  });
});

describe("POST /api/todo - Unauthorized", () => {
  beforeEach(async () => {
    await setupAuthMiddleware(null);
    await setupTestData();
  });

  it("認証なしでの追加はエラー", async () => {
    const res = await app.request(
      "/api/todo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Todo" }),
      },
      MOCK_ENV,
    );
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/todo/:id - Authenticated", () => {
  beforeEach(async () => {
    await setupAuthMiddleware(user1);
    await setupTestData();
  });

  it("ToDoのステータス更新", async () => {
    const res = await app.request(
      "/api/todo/1",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      },
      MOCK_ENV,
    );
    expect(res.status).toBe(200);
    const jsonResponse = (await res.json()) as { data: string };
    expect(jsonResponse.data).toBe("ok");

    const todos = await drizzle(env.DB)
      .select()
      .from(todo)
      .where(eq(todo.id, 1))
      .execute();
    expect(todos.length).toBe(1);
    expect(todos[0].status).toBe("completed");
  });
});

describe("PATCH /api/todo/:id - Unauthorized", () => {
  beforeEach(async () => {
    await setupAuthMiddleware(null);
    await setupTestData();
  });

  it("認証なしでの更新はエラー", async () => {
    const res = await app.request(
      "/api/todo/1",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      },
      MOCK_ENV,
    );
    expect(res.status).toBe(401);
  });
});
