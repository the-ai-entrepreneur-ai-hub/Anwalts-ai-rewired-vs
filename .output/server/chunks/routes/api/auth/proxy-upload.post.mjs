import { d as defineEventHandler, f as readMultipartFormData, h as setResponseStatus, e as getCookie } from '../../../nitro/nitro.mjs';
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

const proxyUpload_post = defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    if (!formData) {
      setResponseStatus(event, 400);
      return { error: "No form data" };
    }
    const filePart = formData.find((p) => p.type === "file");
    if (!filePart || !filePart.data || !filePart.filename) {
      setResponseStatus(event, 400);
      return { error: "No file" };
    }
    const boundary = "----anwaltsproxy" + Math.random().toString(36).slice(2);
    const chunks = [];
    const push = (s) => chunks.push(typeof s === "string" ? Buffer.from(s) : s);
    push(`--${boundary}\r
`);
    push(`Content-Disposition: form-data; name="file"; filename="${filePart.filename}"\r
`);
    push(`Content-Type: ${filePart.type || "application/octet-stream"}\r
\r
`);
    push(filePart.data);
    push(`\r
--${boundary}--\r
`);
    const authToken = getCookie(event, "auth_token");
    const headers = { "Content-Type": `multipart/form-data; boundary=${boundary}` };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    const backendUrl = "http://172.19.0.4:8000/api/files/upload";
    const res = await fetch(backendUrl, { method: "POST", headers, body: Buffer.concat(chunks) });
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

export { proxyUpload_post as default };
//# sourceMappingURL=proxy-upload.post.mjs.map
