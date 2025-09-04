import { d as defineEventHandler, g as getHeader, s as sendRedirect } from '../../../nitro/nitro.mjs';
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

const google_get = defineEventHandler(async (event) => {
  const host = getHeader(event, "host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const protocol = isLocal ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const clientId = process.env.GOOGLE_CLIENT_ID || globalThis.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || globalThis.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`;
  if (!clientId) {
    console.error("Missing GOOGLE_CLIENT_ID in environment");
    await sendRedirect(event, "/assistant?auth=google&error=missing_client_id", 302);
    return;
  }
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  await sendRedirect(event, authUrl.toString(), 302);
});

export { google_get as default };
//# sourceMappingURL=google.get.mjs.map
