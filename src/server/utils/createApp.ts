import { Hono } from "hono";

export type Bindings = {
  DB: D1Database;
  COOKIE_SECRET: string;
  APP_URL: string;
};

export const createApp = () => new Hono<{ Bindings: Bindings }>();
