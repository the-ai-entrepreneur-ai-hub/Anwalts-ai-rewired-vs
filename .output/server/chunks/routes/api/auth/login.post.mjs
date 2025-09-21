import { d as defineEventHandler, r as readBody, c as createError, e as buildBackendUrl, g as getHeader, b as setCookie } from '../../../nitro/nitro.mjs';
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

const login_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  try {
    const body = await readBody(event);
    const email = (_b = (_a = body == null ? void 0 : body.email) == null ? void 0 : _a.trim) == null ? void 0 : _b.call(_a);
    const password = body == null ? void 0 : body.password;
    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: "Email and password are required" });
    }
    const backendUrl = buildBackendUrl(event, "/api/auth/login");
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    const incomingCookies = getHeader(event, "cookie");
    if (incomingCookies) headers.Cookie = incomingCookies;
    const payload = {
      email,
      password,
      remember_me: !!(body == null ? void 0 : body.remember_me),
      csrf_token: (body == null ? void 0 : body.csrf_token) || "stub-csrf-token",
      device_fingerprint: (_c = body == null ? void 0 : body.device_fingerprint) != null ? _c : null
    };
    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    }).catch((err) => {
      console.error("\u274C Authentication service unreachable", err);
      throw createError({ statusCode: 502, statusMessage: "Authentication service unavailable" });
    });
    const rawCookies = ((_e = (_d = backendResponse.headers).raw) == null ? void 0 : _e.call(_d)["set-cookie"]) || backendResponse.headers.get("set-cookie");
    if (rawCookies) {
      event.node.res.setHeader("set-cookie", Array.isArray(rawCookies) ? rawCookies : [rawCookies]);
    }
    const text = await backendResponse.text();
    let result = {};
    if (text) {
      try {
        result = JSON.parse(text);
      } catch (err) {
        console.warn("Auth login: failed to parse backend response", err);
      }
    }
    event.node.res.statusCode = backendResponse.status;
    if (!backendResponse.ok || (result == null ? void 0 : result.success) === false) {
      const message = ((_f = result == null ? void 0 : result.error) == null ? void 0 : _f.message) || ((_g = result == null ? void 0 : result.error) == null ? void 0 : _g.code) || (result == null ? void 0 : result.message) || "Invalid email or password";
      throw createError({ statusCode: backendResponse.status || 401, statusMessage: message });
    }
    if (result == null ? void 0 : result.user) {
      const host = getHeader(event, "host") || "";
      const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
      setCookie(event, "user_data", JSON.stringify(result.user), {
        path: "/",
        httpOnly: false,
        secure: !isLocal,
        sameSite: !isLocal ? "none" : "lax",
        maxAge: 60 * 60
      });
    }
    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
