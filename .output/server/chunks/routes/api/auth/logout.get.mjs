import { d as defineEventHandler, g as getHeader, e as buildBackendUrl, b as setCookie, s as sendRedirect } from '../../../nitro/nitro.mjs';
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

const logout_get = defineEventHandler(async (event) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    const cookies = getHeader(event, "cookie");
    if (cookies) headers.Cookie = cookies;
    const backendUrl = buildBackendUrl(event, "/api/auth/logout");
    await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ csrf_token: "stub-csrf-token" })
    });
  } catch (err) {
    console.warn("Logout GET proxy failed", err);
  }
  const host = getHeader(event, "host") || "";
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  try {
    setCookie(event, "user_data", "", {
      path: "/",
      httpOnly: false,
      secure: !isLocal,
      sameSite: !isLocal ? "none" : "lax",
      maxAge: 0
    });
  } catch {
  }
  return sendRedirect(event, "/", 302);
});

export { logout_get as default };
//# sourceMappingURL=logout.get.mjs.map
