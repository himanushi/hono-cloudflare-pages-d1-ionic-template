import { env } from "cloudflare:test";
import { drizzle } from "drizzle-orm/d1";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { todo, users } from "~/db/schema";
import type { HonoType } from "../utils/createApp";

const MOCK_ENV = {
  DB: env.DB,
};

const user1 = { id: 1, name: "Test User" };
const user2 = { id: 2, name: "Test User2" };
let app: HonoType;

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
