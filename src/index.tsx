import { Hono } from "hono";
import { usersApi } from "~/features/users/workers/usersApi";
import { workerApi } from "./worker";

const app = new Hono();

app.get("*", ...workerApi);

const _usersApi = app.get("/users", ...usersApi);
export type UsersAPI = typeof _usersApi;

export default app;
