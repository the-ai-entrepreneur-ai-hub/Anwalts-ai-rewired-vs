import { d as defineEventHandler, r as readBody, h as setResponseStatus, g as getHeader, e as getCookie } from '../../../nitro/nitro.mjs';
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

const proxy_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const path = (body == null ? void 0 : body.path) || "";
    const method = ((body == null ? void 0 : body.method) || "POST").toUpperCase();
    const payload = (body == null ? void 0 : body.body) || {};
    if (!path || !/^\/api\//.test(path)) {
      setResponseStatus(event, 400);
      return { error: "Invalid path" };
    }
    const backendUrl = "http://172.19.0.4:8000" + path.replace(/^\/api\//, "/api/");
    const incomingAuth = getHeader(event, "authorization");
    const cookieToken = getCookie(event, "auth_token");
    const headers = { "Content-Type": "application/json", "Accept": "application/json" };
    if (incomingAuth) headers["Authorization"] = incomingAuth;
    else if (cookieToken) headers["Authorization"] = `Bearer ${cookieToken}`;
    const res = await fetch(backendUrl, { method, headers, body: JSON.stringify(payload) });
    const text = await res.text();
    setResponseStatus(event, res.status);
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (e) {
    setResponseStatus(event, 500);
    return { error: String(e) };
  }
});

export { proxy_post as default };
//# sourceMappingURL=proxy.post.mjs.map
