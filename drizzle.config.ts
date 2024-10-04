import type { Config } from "drizzle-kit";

export default (process.env.LOCAL_DB_PATH
  ? {
      schema: "./src/server/db/schema.ts",
      out: "./src/server/db/migrations",
      dialect: "sqlite",
      dbCredentials: {
        url: process.env.LOCAL_DB_PATH as string,
      },
    }
  : {
      schema: "./src/server/db/schema.ts",
      out: "./src/server/db/migrations",
      dialect: "sqlite",
      driver: "d1-http",
      dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID as string,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID as string,
        token: process.env.CLOUDFLARE_D1_TOKEN as string,
      },
    }) satisfies Config;
