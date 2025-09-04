import { d as defineEventHandler, a as getQuery, s as sendRedirect, g as getHeader, b as setCookie } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';

const callback_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const code = query.code;
    if (!code) {
      console.error("No authorization code received");
      await sendRedirect(event, "/?error=auth_failed", 302);
      return;
    }
    const host = getHeader(event, "host") || "";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const protocol = isLocal ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const clientId = process.env.GOOGLE_CLIENT_ID || globalThis.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || globalThis.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || globalThis.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });
    const tokens = await tokenResponse.json();
    if (!tokens.access_token) {
      console.error("Failed to get access token");
      await sendRedirect(event, "/?error=token_failed", 302);
      return;
    }
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`);
    const userData = await userResponse.json();
    setCookie(event, "auth_token", `google_${userData.id}_${Date.now()}`, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    setCookie(event, "user_data", JSON.stringify({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      provider: "google"
    }), {
      httpOnly: false,
      secure: !isLocal,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    const setCookieHeader = event.node.res.getHeader("set-cookie");
    console.log("\u2705 Google auth successful for:", userData.email, " set-cookie count:", Array.isArray(setCookieHeader) ? setCookieHeader.length : setCookieHeader ? 1 : 0);
    await sendRedirect(event, "/dashboard?auth=success", 302);
  } catch (error) {
    console.error("Google auth callback error:", error);
    await sendRedirect(event, "/?error=callback_failed", 302);
  }
});

export { callback_get as default };
//# sourceMappingURL=callback.get.mjs.map
