import { oidcAuthMiddleware } from "@hono/oidc-auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  googleAuthCallbackApi,
  googleAuthLoginApi,
  googleAuthLogoutApi,
} from "~/features/auth/server/googleAuthApi";
import { meApi } from "~/features/me/server/meApi";
import { getUsersApi, postUsersApi } from "~/features/users/server/usersApi";
import { serverApi } from "~/server";

export type Bindings = {
  DB: D1Database;
  COOKIE_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app
  .use("/auth/login", oidcAuthMiddleware())
  .get("/auth/login", ...googleAuthLoginApi)
  .get("/auth/callback", ...googleAuthCallbackApi)
  .get("/auth/logout", ...googleAuthLogoutApi);

const _usersApi = app
  .get("/api/users", ...getUsersApi)
  .post("/api/users", ...postUsersApi);
export type UsersAPI = typeof _usersApi;

const _meApi = app.get("/api/me", ...meApi);
export type MeAPI = typeof _meApi;

app.get("*", ...serverApi);

export { app };
