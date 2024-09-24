import { Hono } from "hono";
import { cors } from "hono/cors";
import { meApi } from "~/features/me/server/meApi";
import { getUsersApi, postUsersApi } from "~/features/users/server/usersApi";
import { serverApi } from "~/server";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

const _usersApi = app
  .get("/api/users", ...getUsersApi)
  .post("/api/users", ...postUsersApi);
export type UsersAPI = typeof _usersApi;

const _meApi = app.get("/api/me", ...meApi);
export type MeAPI = typeof _meApi;

app.get("*", ...serverApi);

export { app };
