import { createFactory } from "hono/factory";
import { createRemoteJWKSet, jwtVerify } from "jose";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://www.googleapis.com/oauth2/v4/token";
const USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";
const JWKS_URI = "https://www.googleapis.com/oauth2/v3/certs";
const REDIRECT_URI = "http://localhost:8080/callback";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID as string;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_SECRET as string;

export const googleAuthApi = createFactory().createHandlers((c) => {
  const responseType = "code";
  const scope = encodeURIComponent("openid");
  const authUrl = `${AUTH_ENDPOINT}?response_type=${responseType}&client_id=${encodeURIComponent(
    CLIENT_ID,
  )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}`;
  console.log(`Redirecting to: ${authUrl}`);
  return c.redirect(authUrl);
});

export const googleAuthCallbackApi = createFactory().createHandlers(
  async (c) => {
    const url = new URL(c.req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return c.text("Authorization code not found", 400);
    }

    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json<{
      id_token: string;
      access_token: string;
    }>();
    console.log("Token response:", tokenData);

    if (!tokenData.id_token) {
      return c.text("Failed to obtain ID token", 400);
    }

    try {
      const JWKS = createRemoteJWKSet(new URL(JWKS_URI));

      const idToken = tokenData.id_token;
      const { payload } = await jwtVerify(idToken, JWKS, {
        issuer: "https://accounts.google.com",
        audience: CLIENT_ID,
      });
      console.log("ID Token verified successfully:", payload);
    } catch (error) {
      console.error("ID Token verification failed:", error);
      return c.text("ID Token verification failed", 400);
    }

    const userInfoResponse = await fetch(USERINFO_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json<{
      sub: string;
      picture: string;
    }>();
    console.log("User info:", userInfo);

    return c.json(userInfo);
  },
);
