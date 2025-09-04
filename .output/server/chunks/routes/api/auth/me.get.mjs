import { d as defineEventHandler, e as getCookie, c as createError } from '../../../nitro/nitro.mjs';
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
  try {
    const userDataCookie = getCookie(event, "user_data");
    if (userDataCookie) {
      try {
        const parsed = JSON.parse(userDataCookie);
        if (parsed && parsed.email) {
          return { success: true, user: parsed };
        }
      } catch (_) {
      }
    }
    const authToken = getCookie(event, "auth_token");
    if (authToken) {
      const backendCandidates = [
        "http://172.19.0.4:8000/auth/me",
        "http://172.19.0.4:8000/auth/users/me",
        "http://172.19.0.4:8000/api/auth/me"
      ];
      for (const url of backendCandidates) {
        try {
          const r = await fetch(url, {
            headers: { "Authorization": `Bearer ${authToken}`, "Accept": "application/json" }
          });
          if (r.ok) {
            const u = await r.json().catch(() => ({}));
            const user = (u == null ? void 0 : u.user) || u || {};
            if (user && (user.email || user.id || user.name)) {
              return { success: true, user };
            }
          }
        } catch (_) {
        }
      }
      return {
        success: true,
        user: { id: "session", email: "", name: "Benutzer", provider: "email" }
      };
    }
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  } catch (error) {
    throw error;
  }
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
