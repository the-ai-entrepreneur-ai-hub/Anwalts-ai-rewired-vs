import { I as executeAsync, M as getRequestHeaders } from '../nitro/nitro.mjs';
import { d as defineNuxtRouteMiddleware, n as navigateTo, b as useNuxtApp } from './server.mjs';
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
import 'vue';
import 'pinia';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'vue/server-renderer';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestHeaders(include) {
  const event = useRequestEvent();
  const _headers = event ? getRequestHeaders(event) : {};
  if (!include || !event) {
    return _headers;
  }
  const headers = /* @__PURE__ */ Object.create(null);
  for (const _key of include) {
    const key = _key.toLowerCase();
    const header = _headers[key];
    if (header) {
      headers[key] = header;
    }
  }
  return headers;
}
const authGuard = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const publicPaths = /* @__PURE__ */ new Set([
    "/",
    "/privacy",
    "/terms",
    "/contact",
    "/changelog",
    "/test-auth",
    "/test-login",
    "/framer-preview"
  ]);
  if (publicPaths.has(to.path)) return;
  const ok = async (path) => {
    try {
      const requestHeaders = true ? useRequestHeaders(["cookie"]) : void 0;
      const res = await $fetch(path, {
        // On server-side, forward incoming Cookie header to API route
        headers: true ? requestHeaders : void 0,
        // On client-side, ensure browser includes cookies
        ...false ? { credentials: "include" } : {}
      });
      return !!res?.success;
    } catch {
      return false;
    }
  };
  const nuxtOk = ([__temp, __restore] = executeAsync(() => ok("/api/auth/me")), __temp = await __temp, __restore(), __temp);
  if (nuxtOk) return;
  return navigateTo("/", { redirectCode: 302 });
});

export { authGuard as default };
//# sourceMappingURL=auth-guard-gu5rgFlW.mjs.map
