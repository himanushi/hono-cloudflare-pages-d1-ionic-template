import { oidcAuthMiddleware } from "@hono/oidc-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { showRoutes } from "hono/dev";
import { secureHeaders } from "hono/secure-headers";
import {
  googleAuthCallbackApi,
  googleAuthLoginApi,
  googleAuthLogoutApi,
} from "./api/googleAuthApi";
import { getMeApi, patchMeApi } from "./api/meApi";
import { getTodoApi, patchTodoApi, postTodoApi } from "./api/todoApi";
import { server } from "./server";

export type Bindings = {
  DB: D1Database;
  COOKIE_SECRET: string;
  APP_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) =>
  cors({
    origin: [c.env.APP_URL],
  })(c, next),
);

app.use("*", async (c, next) =>
  csrf({
    origin: [c.env.APP_URL],
  })(c, next),
);

app.use("*", secureHeaders());

app
  .use("/auth/login", oidcAuthMiddleware())
  .get("/auth/login", ...googleAuthLoginApi)
  .get("/auth/callback", ...googleAuthCallbackApi)
  .get("/auth/logout", ...googleAuthLogoutApi);

const _todoApi = app
  .get("/api/todo", ...getTodoApi)
  .post("/api/todo", ...postTodoApi)
  .patch("/api/todo", ...patchTodoApi);
export type TodoAPI = typeof _todoApi;

const _meApi = app.get("/api/me", ...getMeApi).patch("/api/me", ...patchMeApi);
export type MeAPI = typeof _meApi;

app.get("*", ...server);

showRoutes(app);

export { app };
