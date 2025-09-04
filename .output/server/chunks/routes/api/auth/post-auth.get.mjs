import { d as defineEventHandler, a as getQuery, e as getCookie, s as sendRedirect } from '../../../nitro/nitro.mjs';
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

const postAuth_get = defineEventHandler(async (event) => {
  var _a;
  const next = ((_a = getQuery(event)) == null ? void 0 : _a.next) || "/dashboard";
  const userData = getCookie(event, "user_data");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      if (parsed && parsed.email) {
        await sendRedirect(event, next, 302);
        return;
      }
    } catch {
    }
  }
  await sendRedirect(event, "/?auth=required", 302);
});

export { postAuth_get as default };
//# sourceMappingURL=post-auth.get.mjs.map
