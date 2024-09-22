import { Hono } from "hono";
import { meApi } from "~/features/me/server/meApi";
import { usersApi } from "~/features/users/server/usersApi";
import { serverApi } from "./server";

const app = new Hono();

const _usersApi = app.get("/api/users", ...usersApi);
export type UsersAPI = typeof _usersApi;

const _meApi = app.get("/api/me", ...meApi);
export type MeAPI = typeof _meApi;

app.get("*", ...serverApi);

export { app };
