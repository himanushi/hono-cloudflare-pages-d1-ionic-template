import { applyD1Migrations, env } from "cloudflare:test";

await applyD1Migrations(env.DATABASE, env.TEST_MIGRATIONS);
