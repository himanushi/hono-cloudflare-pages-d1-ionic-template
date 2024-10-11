import { expect, test, vi } from "vitest";
import { app } from "~/server/routes";

const MOCK_ENV = {
  DB: {
    prepare: vi.fn().mockReturnValue({
      bind: vi.fn().mockReturnThis(),
      raw: vi.fn().mockResolvedValue([
        { id: 1, title: "Test Todo 1", status: "pending" },
        { id: 2, title: "Test Todo 2", status: "pending" },
      ]),
      all: vi.fn().mockResolvedValue([
        { id: 1, title: "Test Todo 1", status: "pending" },
        { id: 2, title: "Test Todo 2", status: "pending" },
      ]),
      first: vi
        .fn()
        .mockResolvedValue({ id: 1, title: "Test Todo 1", status: "pending" }),
      execute: vi.fn().mockResolvedValue({ changes: 1 }),
    }),
  },
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
