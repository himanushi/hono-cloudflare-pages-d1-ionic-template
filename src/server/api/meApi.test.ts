import { env } from "cloudflare:test";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { users } from "~/db/schema";
import type { HonoType } from "../utils/createApp";

const MOCK_ENV = {
  DB: env.DB,
};

let app: HonoType;
const user1 = { id: 1, name: "Test User", googleUserId: "test-google-id" };

const setupAuthMiddleware = async (user: any) => {
  vi.resetModules();
  vi.doMock("~/server/utils/getMe", () => ({
    getMe: () => user,
  }));
  app = (await import("~/server/routes")).app;
};

const setupTestData = async () => {
  await drizzle(env.DB).insert(users).values(user1).execute();
};

describe("GET /api/me - Authenticated", () => {
  beforeEach(async () => {
    await setupAuthMiddleware(user1);
    await setupTestData();
  });

  it("ユーザー情報の取得", async () => {
    const res = await app.request("/api/me", {}, MOCK_ENV);
    expect(res.status).toBe(200);
    const jsonResponse = await res.json();

    expect(jsonResponse).toEqual({
      id: user1.id,
      name: user1.name,
      googleUserId: user1.googleUserId,
    });
  });
});

describe("GET /api/me - Unauthorized", () => {
  beforeEach(async () => {
    await setupAuthMiddleware(null);
    await setupTestData();
  });

  it("認証なしでユーザー情報取得はエラー", async () => {
    const res = await app.request("/api/me", {}, MOCK_ENV);
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/me - Authenticated", () => {
  beforeEach(async () => {
    await setupAuthMiddleware(user1);
    await setupTestData();
  });

  it("ユーザー名の更新", async () => {
    const newName = "Updated User Name";
    const res = await app.request(
      "/api/me",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      },
      MOCK_ENV,
    );
    expect(res.status).toBe(200);
    const textResponse = await res.text();
    expect(textResponse).toBe("ok");

    const updatedUser = await drizzle(env.DB)
      .select()
      .from(users)
      .where(eq(users.id, user1.id))
      .get();
    expect(updatedUser?.name).toBe(newName);
  });
});

describe("PATCH /api/me - Unauthorized", () => {
  beforeEach(async () => {
    await setupAuthMiddleware(null);
    await setupTestData();
  });

  it("認証なしでのユーザー情報更新はエラー", async () => {
    const res = await app.request(
      "/api/me",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Name" }),
      },
      MOCK_ENV,
    );
    expect(res.status).toBe(401);
  });
});
