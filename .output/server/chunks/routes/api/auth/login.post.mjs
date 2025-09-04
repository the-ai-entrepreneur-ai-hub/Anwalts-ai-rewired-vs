import { d as defineEventHandler, r as readBody, g as getHeader, b as setCookie, c as createError } from '../../../nitro/nitro.mjs';
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
  var _a, _b;
  try {
    const body = await readBody(event);
    console.log("\u{1F510} Login attempt:", { email: body.email });
    const backendUrl = "http://172.19.0.4:8000/auth/login-working";
    try {
      const backendResponse = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: body.email,
          password: body.password
        })
      });
      const result = await backendResponse.json();
      const normalizedToken = (result == null ? void 0 : result.token) || (result == null ? void 0 : result.access_token) || ((_a = result == null ? void 0 : result.data) == null ? void 0 : _a.token) || ((_b = result == null ? void 0 : result.data) == null ? void 0 : _b.access_token) || null;
      if ((result.success === true || backendResponse.ok) && result.user) {
        console.log("\u2705 Backend login successful for:", result.user.email);
        const host = getHeader(event, "host") || "";
        const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
        if (normalizedToken) {
          setCookie(event, "auth_token", String(normalizedToken), {
            httpOnly: true,
            secure: !isLocal,
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
            // 7 days
          });
        }
        try {
          setCookie(event, "user_data", JSON.stringify({
            id: result.user.id || result.user.user_id || result.user.email || "user",
            email: result.user.email,
            name: result.user.name || result.user.full_name || "",
            picture: result.user.picture || "",
            provider: "email"
          }), {
            httpOnly: false,
            secure: !isLocal,
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
          });
        } catch (e) {
          console.warn("Could not set user_data cookie:", e);
        }
        return {
          success: true,
          user: result.user,
          token: normalizedToken,
          message: "Login successful"
        };
      } else {
        console.log("\u274C Backend authentication failed:", result.error);
        throw createError({
          statusCode: 401,
          statusMessage: result.error || "Invalid email or password"
        });
      }
    } catch (backendError) {
      console.error("\u274C Backend connection error:", backendError);
      throw createError({
        statusCode: 500,
        statusMessage: "Authentication service unavailable"
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
