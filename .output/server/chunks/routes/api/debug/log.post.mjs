import { d as defineEventHandler, r as readBody, g as getHeader } from '../../../nitro/nitro.mjs';
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

const log_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const entry = {
      ts: (/* @__PURE__ */ new Date()).toISOString(),
      ip: getHeader(event, "x-forwarded-for") || getHeader(event, "x-real-ip") || "unknown",
      ...body
    };
    console.info("[client-debug]", JSON.stringify(entry));
    return { ok: true };
  } catch (err) {
    console.error("[client-debug-error]", err);
    return { ok: false };
  }
});

export { log_post as default };
//# sourceMappingURL=log.post.mjs.map
