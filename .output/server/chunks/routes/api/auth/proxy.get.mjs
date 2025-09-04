import { d as defineEventHandler, a as getQuery, h as setResponseStatus, e as getCookie, i as setHeader, j as send } from '../../../nitro/nitro.mjs';
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

const proxy_get = defineEventHandler(async (event) => {
  try {
    const q = getQuery(event);
    const p = typeof q.path === "string" ? q.path : "";
    if (!p || !/^\/api\//.test(p)) {
      setResponseStatus(event, 400);
      return { error: "Invalid path" };
    }
    const backendUrl = "http://172.19.0.4:8000" + p.replace(/^\/api\//, "/api/");
    const authToken = getCookie(event, "auth_token");
    const headers = { "Accept": "application/json" };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    const res = await fetch(backendUrl, { headers });
    const buf = await res.arrayBuffer();
    setResponseStatus(event, res.status);
    setHeader(event, "Content-Type", res.headers.get("content-type") || "application/octet-stream");
    return send(event, Buffer.from(buf));
  } catch (e) {
    setResponseStatus(event, 500);
    return { error: String(e) };
  }
});

export { proxy_get as default };
//# sourceMappingURL=proxy.get.mjs.map
