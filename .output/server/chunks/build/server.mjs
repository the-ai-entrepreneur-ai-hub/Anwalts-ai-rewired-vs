import { defineComponent, shallowRef, h, resolveComponent, computed, hasInjectionContext, getCurrentInstance, inject, createElementBlock, provide, cloneVNode, defineAsyncComponent, ref, Suspense, Fragment, useSSRContext, createApp, shallowReactive, mergeProps, reactive, withCtx, createTextVNode, unref, createVNode, resolveDynamicComponent, toRef, onErrorCaptured, onServerPrefetch, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, getCurrentScope } from 'vue';
import { y as parseQuery, z as getRequestHeaders, c as createError$1, A as klona, B as defuFn, C as hasProtocol, D as isScriptProtocol, E as joinURL, F as withQuery, G as sanitizeStatusCode, H as withTrailingSlash, I as withoutTrailingSlash, J as getContext, $ as $fetch$1, K as baseURL, L as createHooks, M as executeAsync, N as toRouteMatcher, O as createRouter$1, P as defu } from '../nitro/nitro.mjs';
import { defineStore, storeToRefs, createPinia, setActivePinia, shouldHydrate } from 'pinia';
import { RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import colors from 'tailwindcss/colors';
import { _api, addAPIProvider, setCustomIconsLoader } from '@iconify/vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderComponent, ssrRenderTeleport, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrRenderSuspense } from 'vue/server-renderer';
import { u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';
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
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.0.3";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta$b = {
  layout: false
};
const __nuxt_page_meta$a = {
  layout: false
};
const __nuxt_page_meta$9 = {
  layout: false
};
const __nuxt_page_meta$8 = {
  layout: false
};
const __nuxt_page_meta$7 = {
  layout: false
};
const __nuxt_page_meta$6 = {
  layout: false
};
const __nuxt_page_meta$5 = { layout: false };
const __nuxt_page_meta$4 = { layout: false };
const __nuxt_page_meta$3 = { layout: false };
const __nuxt_page_meta$2 = {
  layout: false
};
const __nuxt_page_meta$1 = {
  layout: false
};
const __nuxt_page_meta = {
  layout: "framer"
};
const _routes = [
  {
    name: "email",
    path: "/email",
    component: () => import('./email-BZKFXBvq.mjs')
  },
  {
    name: "index",
    path: "/",
    meta: __nuxt_page_meta$b || {},
    component: () => import('./index-BHAmJq76.mjs')
  },
  {
    name: "terms",
    path: "/terms",
    meta: __nuxt_page_meta$a || {},
    component: () => import('./terms-BKB_BTD3.mjs')
  },
  {
    name: "contact",
    path: "/contact",
    meta: __nuxt_page_meta$9 || {},
    component: () => import('./contact-BkGNploN.mjs')
  },
  {
    name: "privacy",
    path: "/privacy",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./privacy-TBevu6Rp.mjs')
  },
  {
    name: "register",
    path: "/register",
    meta: __nuxt_page_meta$7 || {},
    component: () => import('./register-DM5crRzO.mjs')
  },
  {
    name: "assistant",
    path: "/assistant",
    component: () => import('./assistant-ewff9Ejl.mjs')
  },
  {
    name: "changelog",
    path: "/changelog",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./changelog-CLBxCpST.mjs')
  },
  {
    name: "dashboard",
    path: "/dashboard",
    meta: { "middleware": ["dashboard-auth"] },
    component: () => import('./dashboard-DUFoPYJd.mjs'),
    children: [
      {
        name: "dashboard-cases",
        path: "cases",
        component: () => import('./cases-1zlMLQ2d.mjs')
      },
      {
        name: "dashboard-research",
        path: "research",
        meta: __nuxt_page_meta$5 || {},
        component: () => import('./research-C5LvIOKP.mjs')
      },
      {
        name: "dashboard-settings",
        path: "settings",
        meta: __nuxt_page_meta$4 || {},
        component: () => import('./settings-CsjBk77X.mjs')
      }
    ]
  },
  {
    name: "documents",
    path: "/documents",
    meta: { ...__nuxt_page_meta$3 || {}, ...{ "middleware": ["auth-guard"] } },
    component: () => import('./documents-xC9L1OsQ.mjs')
  },
  {
    name: "templates",
    path: "/templates",
    component: () => import('./templates-DkFSlR9G.mjs')
  },
  {
    name: "test-auth",
    path: "/test-auth",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./test-auth-DcCgmskc.mjs')
  },
  {
    name: "test-login",
    path: "/test-login",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./test-login-hDayUz8P.mjs')
  },
  {
    name: "templates-old",
    path: "/templates-old",
    component: () => import('./templates-old-BgH5kuo7.mjs')
  },
  {
    name: "framer-preview",
    path: "/framer-preview",
    meta: __nuxt_page_meta || {},
    component: () => import('./framer-preview--oaCeIoB.mjs')
  }
];
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
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
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to });
    const href = computed(() => {
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            return props.replace ? router.replace(href.value) : router.push(href.value);
          }
        }, slots.default?.());
      };
    }
    // }) as unknown as DefineComponent<NuxtLinkProps, object, object, ComputedOptions, MethodOptions, object, object, EmitsOptions, string, object, NuxtLinkProps, object, SlotsType<NuxtLinkSlots>>
  });
}
const __nuxt_component_0$1 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const inlineConfig = {
  "nuxt": {},
  "ui": {
    "colors": {
      "primary": "green",
      "secondary": "blue",
      "success": "green",
      "info": "blue",
      "warning": "yellow",
      "error": "red",
      "neutral": "slate"
    },
    "icons": {
      "arrowLeft": "i-lucide-arrow-left",
      "arrowRight": "i-lucide-arrow-right",
      "check": "i-lucide-check",
      "chevronDoubleLeft": "i-lucide-chevrons-left",
      "chevronDoubleRight": "i-lucide-chevrons-right",
      "chevronDown": "i-lucide-chevron-down",
      "chevronLeft": "i-lucide-chevron-left",
      "chevronRight": "i-lucide-chevron-right",
      "chevronUp": "i-lucide-chevron-up",
      "close": "i-lucide-x",
      "ellipsis": "i-lucide-ellipsis",
      "external": "i-lucide-arrow-up-right",
      "file": "i-lucide-file",
      "folder": "i-lucide-folder",
      "folderOpen": "i-lucide-folder-open",
      "loading": "i-lucide-loader-circle",
      "minus": "i-lucide-minus",
      "plus": "i-lucide-plus",
      "search": "i-lucide-search",
      "upload": "i-lucide-upload"
    }
  },
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "cssLayer": "components",
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};
const __appConfig = /* @__PURE__ */ defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  nuxtApp._appConfig ||= klona(__appConfig);
  return nuxtApp._appConfig;
}
const DEFAULT_CSRF = "stub-csrf-token";
const authApi = {
  async login(payload) {
    return $fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      body: {
        email: payload.email,
        password: payload.password,
        remember_me: payload.rememberMe ?? false,
        csrf_token: payload.csrfToken || DEFAULT_CSRF,
        device_fingerprint: payload.deviceFingerprint || null
      }
    });
  },
  async register(payload) {
    return $fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      body: {
        email: payload.email,
        password: payload.password,
        first_name: payload.first_name,
        last_name: payload.last_name,
        title: payload.title,
        firm_name: payload.firm_name,
        terms_accepted: payload.terms_accepted,
        csrf_token: payload.csrfToken || DEFAULT_CSRF
      }
    });
  },
  async refresh(payload = {}) {
    return $fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      body: { csrf_token: payload.csrfToken || DEFAULT_CSRF }
    });
  },
  async logout(payload = {}) {
    return $fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      body: { csrf_token: payload.csrfToken || DEFAULT_CSRF }
    });
  },
  async status() {
    return $fetch("/api/auth/status", { credentials: "include" });
  },
  async debugSessions(params = {}) {
    return $fetch("/api/auth/debug/sessions", {
      credentials: "include",
      query: params
    });
  },
  async debugLogs(params = {}) {
    return $fetch("/api/auth/debug/logs", {
      credentials: "include",
      query: params
    });
  },
  async initiateGoogleOAuth(redirectUri, state) {
    return $fetch("/api/auth/oauth/google/initiate", {
      method: "POST",
      credentials: "include",
      body: {
        redirect_uri: redirectUri,
        state: state ?? null
      }
    });
  }
};
function extractErrorMessage(err, fallback) {
  if (err?.data?.error?.message) return err.data.error.message;
  if (err?.data?.statusMessage) return err.data.statusMessage;
  if (err?.data?.message) return err.data.message;
  if (err?.data?.detail?.message) return err.data.detail.message;
  if (err?.message) return err.message;
  return fallback;
}
const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    session: null,
    tokens: null,
    csrfToken: null,
    sessionExpiresAt: null,
    authError: null,
    showAuthModal: false,
    authModalView: "login",
    isSubmitting: false,
    redirectAfterAuth: "/dashboard",
    lastStatusCheck: null
  }),
  actions: {
    open(view = "login", redirect) {
      this.authModalView = view;
      this.showAuthModal = true;
      this.authError = null;
      if (redirect) this.redirectAfterAuth = redirect;
    },
    setView(next) {
      this.authModalView = next;
      this.authError = null;
    },
    close() {
      this.showAuthModal = false;
      this.authError = null;
    },
    setRedirect(path) {
      this.redirectAfterAuth = path || "/dashboard";
    },
    async fetchStatus(force = false) {
      if (this.isSubmitting) return;
      if (!force && this.lastStatusCheck && Date.now() - this.lastStatusCheck < 3e4) return;
      this.isLoading = true;
      this.authError = null;
      try {
        const res = await authApi.status();
        this.isAuthenticated = !!res?.authenticated;
        this.user = res?.user || null;
        this.session = res?.session || null;
        this.tokens = this.isAuthenticated ? this.tokens : null;
        this.sessionExpiresAt = res?.session?.expires_at || null;
        if (res?.csrf_token) this.csrfToken = res.csrf_token;
        else if (this.isAuthenticated && !this.csrfToken) this.csrfToken = DEFAULT_CSRF;
      } catch (err) {
        this.isAuthenticated = false;
        this.user = null;
        this.session = null;
        this.tokens = null;
        this.csrfToken = null;
        if (force) this.authError = extractErrorMessage(err, "Sitzung konnte nicht geprüft werden");
      } finally {
        this.isLoading = false;
        this.lastStatusCheck = Date.now();
      }
    },
    async ensureAuthenticated(options = {}) {
      if (!this.isAuthenticated) {
        await this.fetchStatus(true);
      }
      if (!this.isAuthenticated) {
        if (options.redirect) this.setRedirect(options.redirect);
        this.open("login", options.redirect);
        throw new Error("UNAUTHORIZED");
      }
    },
    async login(payload) {
      this.isSubmitting = true;
      this.authError = null;
      try {
        const res = await authApi.login({
          email: payload.email,
          password: payload.password,
          rememberMe: payload.remember,
          csrfToken: this.csrfToken || DEFAULT_CSRF
        });
        this.applyAuthResponse(res);
        await this.afterAuthSuccess();
      } catch (err) {
        this.authError = extractErrorMessage(err, "Login fehlgeschlagen");
        throw err;
      } finally {
        this.isSubmitting = false;
      }
    },
    async register(payload) {
      this.isSubmitting = true;
      this.authError = null;
      try {
        const res = await authApi.register({
          email: payload.email,
          password: payload.password,
          first_name: payload.first_name,
          last_name: payload.last_name,
          title: payload.title,
          firm_name: payload.firm_name,
          terms_accepted: payload.terms_accepted,
          csrfToken: DEFAULT_CSRF
        });
        this.applyAuthResponse(res);
        await this.afterAuthSuccess();
      } catch (err) {
        this.authError = extractErrorMessage(err, "Registrierung fehlgeschlagen");
        throw err;
      } finally {
        this.isSubmitting = false;
      }
    },
    async loginWithGoogle() {
      try {
        const redirectUri = `${(void 0).location.origin}/api/auth/google/callback`;
        const res = await authApi.initiateGoogleOAuth(redirectUri);
        if ("auth_url" in res && res.auth_url) {
          (void 0).location.href = res.auth_url;
          return;
        }
      } catch (err) {
        console.error("Google OAuth start failed", err);
        this.authError = extractErrorMessage(err, "Google Anmeldung nicht verfügbar");
      }
    },
    async logout() {
      try {
        await authApi.logout({ csrfToken: this.csrfToken || DEFAULT_CSRF });
      } finally {
        this.resetState();
      }
    },
    async refreshSession() {
      try {
        const csrfToken = this.csrfToken || DEFAULT_CSRF;
        const res = await authApi.refresh({ csrfToken });
        this.applyAuthResponse(res);
        return res;
      } catch (err) {
        this.resetState();
        throw err;
      }
    },
    applyAuthResponse(data, csrfToken) {
      this.isAuthenticated = true;
      this.user = data.user;
      this.session = data.session;
      this.sessionExpiresAt = data.session?.expires_at || null;
      this.tokens = data.tokens;
      if (csrfToken) this.csrfToken = csrfToken;
      else if (!this.csrfToken) this.csrfToken = DEFAULT_CSRF;
    },
    resetState() {
      this.isAuthenticated = false;
      this.user = null;
      this.session = null;
      this.tokens = null;
      this.sessionExpiresAt = null;
      this.csrfToken = null;
      this.showAuthModal = false;
      this.authModalView = "login";
    },
    async afterAuthSuccess() {
      await this.fetchStatus(true);
      this.close();
      this.redirectAfterAuth || "/dashboard";
      this.setRedirect("/dashboard");
    }
  }
});
const PUBLIC_ROUTES = /* @__PURE__ */ new Set([
  "/",
  "/privacy",
  "/terms",
  "/contact",
  "/changelog",
  "/landing",
  "/landing-alt",
  "/framer-preview",
  "/test-login",
  "/test-auth"
]);
const auth_45global = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  if (PUBLIC_ROUTES.has(to.path)) return;
  const queryAuth = Array.isArray(to.query.auth) ? to.query.auth[0] : to.query.auth;
  if (queryAuth === "success") return;
  useAuthStore();
  {
    try {
      const headers = useRequestHeaders(["cookie"]);
      const status = ([__temp, __restore] = executeAsync(() => $fetch("/api/auth/status", {
        headers,
        credentials: "include"
      })), __temp = await __temp, __restore(), __temp);
      if (status?.authenticated) return;
    } catch (_) {
    }
    const target = new URL(to.fullPath, "http://localhost");
    if (!target.searchParams.has("auth")) target.searchParams.set("auth", "required");
    return navigateTo(target.pathname + "?" + target.searchParams.toString(), { redirectCode: 302 });
  }
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  auth_45global,
  manifest_45route_45rule
];
const namedMiddleware = {
  "auth-guard": () => import('./auth-guard-96V_-WS9.mjs'),
  "dashboard-auth": () => import('./dashboard-auth-DPibFTzT.mjs')
};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      if (to.matched[0]?.components?.default === from.matched[0]?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    useError();
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from) => {
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = toRaw(pinia.state.value);
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const LazyIcon = defineAsyncComponent(() => import('./index-B_FHYaq5.mjs').then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["Icon", LazyIcon]
];
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
function getColor(color, shade) {
  if (color in colors && typeof colors[color] === "object" && shade in colors[color]) {
    return colors[color][shade];
  }
  return "";
}
function generateShades(key, value) {
  return `${shades.map((shade) => `--ui-color-${key}-${shade}: var(--color-${value === "neutral" ? "old-neutral" : value}-${shade}, ${getColor(value, shade)});`).join("\n  ")}`;
}
function generateColor(key, shade) {
  return `--ui-${key}: var(--ui-color-${key}-${shade});`;
}
const colors_E7kSti5pGZ28QhUUurq6gGRU3l65WuXO_KJC3GQgzFo = /* @__PURE__ */ defineNuxtPlugin(() => {
  const appConfig = useAppConfig();
  useNuxtApp();
  const root = computed(() => {
    const { neutral, ...colors2 } = appConfig.ui.colors;
    return `@layer base {
  :root {
  ${Object.entries(appConfig.ui.colors).map(([key, value]) => generateShades(key, value)).join("\n  ")}
  }
  :root, .light {
  ${Object.keys(colors2).map((key) => generateColor(key, 500)).join("\n  ")}
  }
  .dark {
  ${Object.keys(colors2).map((key) => generateColor(key, 400)).join("\n  ")}
  }
}`;
  });
  const headData = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: "nuxt-ui-colors"
    }]
  };
  useHead(headData);
});
const preference = "system";
const plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const colorMode = nuxtApp.ssrContext?.islandContext ? ref({}) : useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "@nuxt/icon",
  setup() {
    const configs = /* @__PURE__ */ useRuntimeConfig();
    const options = useAppConfig().icon;
    _api.setFetch($fetch.native);
    const resources = [];
    if (options.provider === "server") {
      const baseURL2 = configs.app?.baseURL?.replace(/\/$/, "") ?? "";
      resources.push(baseURL2 + (options.localApiEndpoint || "/api/_nuxt_icon"));
      if (options.fallbackToApi === true || options.fallbackToApi === "client-only") {
        resources.push(options.iconifyApiEndpoint);
      }
    } else if (options.provider === "none") {
      _api.setFetch(() => Promise.resolve(new Response()));
    } else {
      resources.push(options.iconifyApiEndpoint);
    }
    async function customIconLoader(icons, prefix) {
      try {
        const data = await $fetch(resources[0] + "/" + prefix + ".json", {
          query: {
            icons: icons.join(",")
          }
        });
        if (!data || data.prefix !== prefix || !data.icons)
          throw new Error("Invalid data" + JSON.stringify(data));
        return data;
      } catch (e) {
        console.error("Failed to load custom icons", e);
        return null;
      }
    }
    addAPIProvider("", { resources });
    for (const prefix of options.customCollections || []) {
      if (prefix)
        setCustomIconsLoader(customIconLoader, prefix);
    }
  }
  // For type portability
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  colors_E7kSti5pGZ28QhUUurq6gGRU3l65WuXO_KJC3GQgzFo,
  plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A,
  plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8
];
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "StackAuthSocialButtons",
  __ssrInlineRender: true,
  props: {
    mode: {}
  },
  setup(__props) {
    const props = __props;
    const ctaLabel = computed(() => props.mode === "register" ? "registrieren" : "anmelden");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><button type="button" class="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"><svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 11.8v4.8h6.7a6.8 6.8 0 0 1-2.9 4.5l4.7 3.6C23.3 21.9 24 19.2 24 16.8A12 12 0 0 0 12 4v7.8z"></path><path fill="#34A853" d="M12 24c3.2 0 5.8-1 7.7-2.7l-4.7-3.6c-.8.5-1.8.8-3 .8-2.3 0-4.2-1.5-4.9-3.5l-4.8 3.7C4 21.7 7.7 24 12 24z"></path><path fill="#4A90E2" d="M7.1 11.9a5 5 0 0 1 0-3.2L2.3 5A12 12 0 0 0 0 12a12 12 0 0 0 2.3 7l4.8-3.6a5 5 0 0 1 0-3.5z"></path><path fill="#FBBC05" d="M12 4.8a6.5 6.5 0 0 1 4.6 1.8l3.4-3.4A11.3 11.3 0 0 0 12 0C7.7 0 4 2.3 2.3 5.9l4.9 3.8C7.8 7.3 9.7 5 12 5z"></path></svg><span>Mit Google ${ssrInterpolate(ctaLabel.value)}</span></button></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/StackAuthSocialButtons.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const AuthSocialButtons = Object.assign(_sfc_main$6, { __name: "AuthStackAuthSocialButtons" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "StackAuthLoginForm",
  __ssrInlineRender: true,
  props: {
    loading: { type: Boolean }
  },
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const form = reactive({
      email: "",
      password: "",
      remember: true
    });
    const showPassword = ref(false);
    const loading = computed(() => props.loading ?? false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))}><div class="space-y-2"><label for="auth-email" class="text-sm font-medium text-white/80">E-Mail-Adresse *</label><input id="auth-email"${ssrRenderAttr("value", form.email)} type="email" autocomplete="email" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none" placeholder="kanzlei@example.de" required></div><div class="space-y-2"><div class="flex items-center justify-between text-sm text-white/80"><label for="auth-password" class="font-medium">Passwort *</label><button type="button" class="text-xs text-blue-300 hover:text-blue-200">${ssrInterpolate(showPassword.value ? "Verbergen" : "Anzeigen")}</button></div><input id="auth-password"${ssrRenderDynamicModel(showPassword.value ? "text" : "password", form.password, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} autocomplete="current-password" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none" placeholder="Mindestens 8 Zeichen" required></div><label class="flex items-center gap-2 text-sm text-white/70"><input${ssrIncludeBooleanAttr(Array.isArray(form.remember) ? ssrLooseContain(form.remember, null) : form.remember) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-white/20 bg-transparent"><span>Angemeldet bleiben</span></label><button type="submit" class="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-400/90 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>`);
      if (loading.value) {
        _push(`<svg class="h-4 w-4 animate-spin text-slate-900" viewBox="0 0 24 24" aria-hidden="true"><circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3.5-3.5A12 12 0 0 0 4 12z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(loading.value ? "Wird geprüft…" : "Jetzt anmelden")}</span></button></form>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/StackAuthLoginForm.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const AuthLoginForm = Object.assign(_sfc_main$5, { __name: "AuthStackAuthLoginForm" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "StackAuthRegisterForm",
  __ssrInlineRender: true,
  props: {
    loading: { type: Boolean }
  },
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const form = reactive({
      firstName: "",
      lastName: "",
      title: "",
      firmName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false
    });
    const errors = reactive({
      password: "",
      terms: ""
    });
    const loading = computed(() => props.loading ?? false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))}><div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="space-y-2"><label for="signup-first-name" class="text-sm font-medium text-white/80">Vorname *</label><input id="signup-first-name"${ssrRenderAttr("value", form.firstName)} type="text" autocomplete="given-name" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none" placeholder="Max" required></div><div class="space-y-2"><label for="signup-last-name" class="text-sm font-medium text-white/80">Nachname *</label><input id="signup-last-name"${ssrRenderAttr("value", form.lastName)} type="text" autocomplete="family-name" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none" placeholder="Müller" required></div></div><div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="space-y-2"><label for="signup-title" class="text-sm font-medium text-white/80">Titel / Position *</label><input id="signup-title"${ssrRenderAttr("value", form.title)} type="text" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none" placeholder="Partner, RA" required></div><div class="space-y-2"><label for="signup-firm" class="text-sm font-medium text-white/80">Kanzleiname *</label><input id="signup-firm"${ssrRenderAttr("value", form.firmName)} type="text" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none" placeholder="Müller &amp; Partner" required></div></div><div class="space-y-2"><label for="signup-email" class="text-sm font-medium text-white/80">Geschäftliche E-Mail *</label><input id="signup-email"${ssrRenderAttr("value", form.email)} type="email" autocomplete="email" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none" placeholder="kanzlei@example.de" required></div><div class="grid grid-cols-1 gap-4 sm:grid-cols-2"><div class="space-y-2"><label for="signup-password" class="text-sm font-medium text-white/80">Passwort *</label><input id="signup-password"${ssrRenderAttr("value", form.password)} type="password" autocomplete="new-password" minlength="8" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none" placeholder="Mindestens 8 Zeichen" required></div><div class="space-y-2"><label for="signup-confirm" class="text-sm font-medium text-white/80">Passwort bestätigen *</label><input id="signup-confirm"${ssrRenderAttr("value", form.confirmPassword)} type="password" autocomplete="new-password" class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-300 focus:outline-none" placeholder="Passwort erneut eingeben" required></div></div>`);
      if (errors.password) {
        _push(`<p class="text-xs text-red-200">${ssrInterpolate(errors.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="flex items-start gap-2 text-sm text-white/70"><input${ssrIncludeBooleanAttr(Array.isArray(form.terms) ? ssrLooseContain(form.terms, null) : form.terms) ? " checked" : ""} type="checkbox" class="mt-1 h-4 w-4 rounded border-white/20 bg-transparent"><span> Ich akzeptiere die `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/terms",
        class: "text-blue-300 hover:text-blue-200",
        target: "_blank"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`AGB`);
          } else {
            return [
              createTextVNode("AGB")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` und die `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacy",
        class: "text-blue-300 hover:text-blue-200",
        target: "_blank"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Datenschutzerklärung`);
          } else {
            return [
              createTextVNode("Datenschutzerklärung")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`. </span></label>`);
      if (errors.terms) {
        _push(`<p class="text-xs text-red-200">${ssrInterpolate(errors.terms)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-400/90 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>`);
      if (loading.value) {
        _push(`<svg class="h-4 w-4 animate-spin text-slate-900" viewBox="0 0 24 24" aria-hidden="true"><circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4l3.5-3.5A12 12 0 0 0 4 12z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(loading.value ? "Wird erstellt…" : "Kostenlos registrieren")}</span></button></form>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/StackAuthRegisterForm.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const AuthRegisterForm = Object.assign(_sfc_main$4, { __name: "AuthStackAuthRegisterForm" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "StackAuthModal",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const { showAuthModal: isOpen, authModalView: view, isSubmitting, authError: error } = storeToRefs(authStore);
    const tabs = [
      { label: "Anmelden", value: "login" },
      { label: "Registrieren", value: "register" }
    ];
    const currentForm = computed(() => view.value === "login" ? AuthLoginForm : AuthRegisterForm);
    async function handleSubmit(payload) {
      try {
        if (view.value === "login") {
          await authStore.login(payload);
        } else {
          await authStore.register(payload);
        }
      } catch (error2) {
        console.warn("Auth submission failed", error2);
      }
    }
    function loginWithGoogle() {
      authStore.loginWithGoogle();
    }
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(isOpen)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4" tabindex="-1"><div class="w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl"><header class="flex items-center justify-between border-b border-white/10 px-8 py-6"><div><p class="text-xs uppercase tracking-[0.28em] text-blue-300">ANWALTS.AI</p><h2 class="mt-1 text-2xl font-semibold">${ssrInterpolate(unref(view) === "login" ? "Willkommen zurück" : "Konto erstellen")}</h2></div><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Modal schließen"><span class="text-lg leading-none">×</span></button></header><div class="border-b border-white/10 bg-slate-900/80 px-8 pt-5"><nav class="flex gap-3 text-sm font-medium"><!--[-->`);
          ssrRenderList(tabs, (tab) => {
            _push2(`<button type="button" class="${ssrRenderClass([
              "rounded-full px-4 py-2 transition focus:outline-none",
              unref(view) === tab.value ? "bg-white text-slate-900 shadow" : "text-white/60 hover:text-white"
            ])}">${ssrInterpolate(tab.label)}</button>`);
          });
          _push2(`<!--]--></nav></div><section class="space-y-6 px-8 py-7">`);
          _push2(ssrRenderComponent(AuthSocialButtons, {
            mode: unref(view),
            onGoogle: loginWithGoogle
          }, null, _parent));
          _push2(`<div class="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/40"><span class="h-px w-full bg-white/10" aria-hidden="true"></span><span>E-Mail Zugang</span><span class="h-px w-full bg-white/10" aria-hidden="true"></span></div>`);
          if (unref(error)) {
            _push2(`<p class="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">${ssrInterpolate(unref(error))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(currentForm.value), {
            loading: unref(isSubmitting),
            onSubmit: handleSubmit
          }, null), _parent);
          _push2(`</section><footer class="border-t border-white/10 bg-slate-900/70 px-8 py-5 text-sm text-white/70">`);
          if (unref(view) === "login") {
            _push2(`<!--[--> Noch kein Konto? <button type="button" class="ml-1 font-semibold text-blue-300 hover:text-blue-200"> Registrieren </button><!--]-->`);
          } else {
            _push2(`<!--[--> Bereits registriert? <button type="button" class="ml-1 font-semibold text-blue-300 hover:text-blue-200"> Jetzt anmelden </button><!--]-->`);
          }
          _push2(`</footer></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/auth/StackAuthModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const StackAuthModal = Object.assign(_sfc_main$3, { __name: "AuthStackAuthModal" });
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(ssrRenderComponent(StackAuthModal, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-C_Fry4Po.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-CgeQl0_t.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { __nuxt_component_0$1 as _, useAuthStore as a, useRuntimeConfig as b, useRouter as c, defineNuxtRouteMiddleware as d, entry$1 as default, useRequestHeaders as e, useNuxtApp as f, asyncDataDefaults as g, createError as h, useAppConfig as i, navigateTo as n, useHead as u };
//# sourceMappingURL=server.mjs.map
