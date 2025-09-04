import { d as defineEventHandler, g as getHeader, b as setCookie } from '../../../nitro/nitro.mjs';
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
  try {
    const host = getHeader(event, "host") || "";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const common = { secure: !isLocal, sameSite: "none", path: "/" };
    try {
      setCookie(event, "auth_token", "", { ...common, httpOnly: true, maxAge: 0 });
    } catch {
    }
    try {
      setCookie(event, "user_data", "", { ...common, httpOnly: false, maxAge: 0 });
    } catch {
    }
  } catch {
  }
  return { success: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
