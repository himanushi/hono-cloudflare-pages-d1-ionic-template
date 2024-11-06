import { env } from "cloudflare:test";
import { drizzle } from "drizzle-orm/d1";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { todo, users } from "~/db/schema";
import { app } from "~/server/routes";

const MOCK_ENV = {
  DB: env.DB,
};

const user1 = { id: 1, name: "Test User" };
const user2 = { id: 2, name: "Test User2" };

describe("GET /api/todo", () => {
  beforeEach(async () => {
    // 認証
    vi.doMock("~/server/utils/authMiddleware", () => ({
      authMiddleware: (c: any, next: any) => {
        c.set("me", user1);
        return next();
      },
    }));

    // テストデータ作成
    await drizzle(env.DB).insert(users).values(user1).execute();
    await drizzle(env.DB).insert(users).values(user2).execute();
    await drizzle(env.DB)
      .insert(todo)
      .values([
        { title: "Test Todo 1", userId: user1.id },
        { title: "Test Todo 2", userId: user1.id },
        { title: "Test Todo 3", userId: user2.id },
      ])
      .execute();
  });

  afterEach(() => {
    vi.clearAllMocks();
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

describe("Unauthorized GET /api/todo", () => {
  beforeEach(async () => {
    vi.doMock("~/server/utils/authMiddleware", () => ({
      authMiddleware: (c: any, next: any) => {
        c.set("me", null);
        return next();
      },
    }));
    // テストデータ作成
    await drizzle(env.DB).insert(users).values(user1).execute();
    await drizzle(env.DB).insert(users).values(user2).execute();
    await drizzle(env.DB)
      .insert(todo)
      .values([
        { title: "Test Todo 1", userId: user1.id },
        { title: "Test Todo 2", userId: user1.id },
        { title: "Test Todo 3", userId: user2.id },
      ])
      .execute();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("?limit=5&offset=0", async () => {
    const res = await app.request("/api/todo?limit=5&offset=0", {}, MOCK_ENV);
    expect(res.status).toBe(401);
  });
});
