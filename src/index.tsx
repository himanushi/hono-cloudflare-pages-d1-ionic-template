import { showRoutes } from "hono/dev";
import { app } from "~/server/routes";

showRoutes(app);

export default app;
