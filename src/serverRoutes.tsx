import { Hono } from "hono";
import { meApi } from "~/features/me/server/meApi";
import { usersApi } from "~/features/users/server/usersApi";
import { serverApi } from "./server";

const app = new Hono();

const _api = app.get("/api/users", ...usersApi).get("/api/me", ...meApi);
export type API = typeof _api;

app.get("*", ...serverApi);
export { app };
