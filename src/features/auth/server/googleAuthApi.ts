import { getAuth, processOAuthCallback, revokeSession } from "@hono/oidc-auth";
import { createFactory } from "hono/factory";

export const googleAuthLoginApi = createFactory().createHandlers(async (c) => {
  const auth = await getAuth(c);
  return c.text(`Hello ${auth?.sub}!`);
});

export const googleAuthCallbackApi = createFactory().createHandlers(
  async (c) => await processOAuthCallback(c),
);

export const googleAuthLogoutApi = createFactory().createHandlers(
  async (c) => await revokeSession(c),
);
