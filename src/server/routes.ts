import { authCallbackApi, authLoginApi, authLogoutApi } from "./api/authApi";
import { getMeApi, patchMeApi } from "./api/meApi";
import { getTodoApi, patchTodoApi, postTodoApi } from "./api/todoApi";
import { middleware } from "./middleware";
import { server } from "./server";
import { createApp } from "./utils/createApp";

const app = createApp();

app.route("/", middleware);

app
  .get("/auth/login", ...authLoginApi)
  .get("/auth/callback", ...authCallbackApi)
  .get("/auth/logout", ...authLogoutApi);

const _todoApi = app
  .get("/api/todo", ...getTodoApi)
  .post("/api/todo", ...postTodoApi)
  .patch("/api/todo/:id", ...patchTodoApi);
export type TodoAPI = typeof _todoApi;

const _meApi = app.get("/api/me", ...getMeApi).patch("/api/me", ...patchMeApi);
export type MeAPI = typeof _meApi;

app.get("*", ...server);

export { app };
