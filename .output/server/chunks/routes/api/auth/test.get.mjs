import { d as defineEventHandler, b as setCookie, s as sendRedirect } from '../../../nitro/nitro.mjs';
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

const test_get = defineEventHandler(async (event) => {
  console.log("Test auth endpoint hit");
  setCookie(event, "auth_token", "test-token-123", {
    httpOnly: true,
    secure: false,
    // Set to true in production
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7
    // 7 days
  });
  await sendRedirect(event, "/dashboard?auth_success=true&provider=test&demo=true", 302);
});

export { test_get as default };
//# sourceMappingURL=test.get.mjs.map
