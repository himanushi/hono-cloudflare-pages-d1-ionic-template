import { Hono } from "hono";

export type Variables = {
  me:
    | {
        id: number;
        name: string;
      }
    | undefined;
};

export type Bindings = {
  DB: D1Database;
  COOKIE_SECRET: string;
  APP_URL: string;
};

export type HonoType = { Bindings: Bindings; Variables: Variables };

export const createApp = () => new Hono<HonoType>();
