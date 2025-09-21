import { d as defineEventHandler, e as buildBackendUrl, g as getHeader, r as readBody, c as createError, b as setCookie } from '../../../nitro/nitro.mjs';
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

const logout_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const backendUrl = buildBackendUrl(event, "/api/auth/logout");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  const cookies = getHeader(event, "cookie");
  if (cookies) headers.Cookie = cookies;
  const body = await readBody(event);
  const backendResponse = await fetch(backendUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body != null ? body : { csrf_token: "stub-csrf-token" })
  }).catch((err) => {
    console.error("Logout proxy error", err);
    throw createError({ statusCode: 502, statusMessage: "Logout service unavailable" });
  });
  const rawCookies = ((_b = (_a = backendResponse.headers).raw) == null ? void 0 : _b.call(_a)["set-cookie"]) || backendResponse.headers.get("set-cookie");
  if (rawCookies) {
    event.node.res.setHeader("set-cookie", Array.isArray(rawCookies) ? rawCookies : [rawCookies]);
  }
  event.node.res.statusCode = backendResponse.status;
  const text = await backendResponse.text();
  let result = {};
  if (text) {
    try {
      result = JSON.parse(text);
    } catch (err) {
      console.warn("Auth logout: failed to parse backend response", err);
    }
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
  if (!backendResponse.ok) {
    const message = ((_c = result == null ? void 0 : result.error) == null ? void 0 : _c.message) || (result == null ? void 0 : result.message) || "Logout failed";
    throw createError({ statusCode: backendResponse.status || 500, statusMessage: message });
  }
  return result;
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
