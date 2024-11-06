import { Hono } from "hono";
import type { BlankSchema } from "hono/types";

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

export type HonoPropsType = { Bindings: Bindings; Variables: Variables };

export type HonoType = Hono<HonoPropsType, BlankSchema, "/">;

export const createApp = () => new Hono<HonoPropsType>();
