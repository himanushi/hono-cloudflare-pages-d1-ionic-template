import { Hono } from "hono";
import { meApi } from "~/features/me/workers/meApi";
import { usersApi } from "~/features/users/workers/usersApi";
import { workerApi } from "./worker";

const app = new Hono();

const _usersApi = app.get("/api/users", ...usersApi);
export type UsersAPI = typeof _usersApi;

const _meApi = app.get("/api/me", ...meApi);
export type MeAPI = typeof _meApi;

app.get("*", ...workerApi);

export { app };
