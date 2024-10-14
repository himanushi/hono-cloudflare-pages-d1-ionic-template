import { env } from "cloudflare:test";
import { expect, test, vi } from "vitest";
import { app } from "~/server/routes";

const MOCK_ENV = {
  DB: env,
};

vi.mock("~/server/utils/getMeMiddleware", () => ({
  getMeMiddleware: (c: any, next: any) => {
    c.set("me", { id: 1, name: "Test User" });
    return next();
  },
}));

test("GET /api/todo should return list of todos", async () => {
  const res = await app.request("/api/todo?limit=5&offset=0", {}, MOCK_ENV);
  expect(res.status).toBe(200);
  const jsonResponse = await res.json();
  console.log(jsonResponse);
  expect(jsonResponse).toEqual([
    { id: 1, title: "Test Todo 1", status: "pending" },
    { id: 2, title: "Test Todo 2", status: "pending" },
  ]);
});
