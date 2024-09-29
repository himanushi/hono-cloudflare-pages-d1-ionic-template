import { getAuth, processOAuthCallback, revokeSession } from "@hono/oidc-auth";
import { createFactory } from "hono/factory";

export const googleAuthLoginApi = createFactory().createHandlers(async (c) => {
  const auth = await getAuth(c);
  console.log(auth);
  return c.text(`Hello <${auth?.email}>!`);
});

export const googleAuthCallbackApi = createFactory().createHandlers(
  async (c) => {
    return processOAuthCallback(c);
  },
);

export const googleAuthLogoutApi = createFactory().createHandlers(async (c) => {
  await revokeSession(c);
});
