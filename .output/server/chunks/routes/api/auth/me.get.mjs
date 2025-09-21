import { d as defineEventHandler, e as buildBackendUrl, g as getHeader, c as createError } from '../../../nitro/nitro.mjs';
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

const me_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const backendUrl = buildBackendUrl(event, "/api/auth/status");
  const headers = {
    Accept: "application/json"
  };
  const cookies = getHeader(event, "cookie");
  if (cookies) headers.Cookie = cookies;
  const backendResponse = await fetch(backendUrl, { headers }).catch((err) => {
    console.error("Auth me proxy error", err);
    throw createError({ statusCode: 502, statusMessage: "Authentication service unavailable" });
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
      console.warn("Auth me: failed to parse backend response", err);
    }
  }
  if (!backendResponse.ok || (result == null ? void 0 : result.authenticated) === false) {
    const message = ((_c = result == null ? void 0 : result.error) == null ? void 0 : _c.message) || (result == null ? void 0 : result.message) || "Not authenticated";
    throw createError({ statusCode: backendResponse.status || 401, statusMessage: message });
  }
  return { success: true, user: (result == null ? void 0 : result.user) || null };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
