import { a as __nuxt_component_0$1 } from './server.mjs';
import { ref, reactive, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import '../nitro/nitro.mjs';
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
import 'pinia';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = {
  __name: "test-login",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const result = ref(null);
    const loginForm = reactive({
      email: "",
      password: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8" }, _attrs))}><div class="max-w-4xl mx-auto"><h1 class="text-4xl font-bold text-white mb-8 text-center">🔐 AUTH TESTING PAGE</h1><div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8"><h2 class="text-2xl font-bold text-white mb-4">📋 Available Test Credentials</h2><div class="grid md:grid-cols-2 gap-4"><div class="bg-green-500/20 p-4 rounded-lg"><h3 class="text-lg font-semibold text-white">Admin User</h3><p class="text-green-200">Email: <code>admin@anwalts.ai</code></p><p class="text-green-200">Password: <code>admin123</code></p><p class="text-sm text-green-300">Role: Administrator</p></div><div class="bg-blue-500/20 p-4 rounded-lg"><h3 class="text-lg font-semibold text-white">Demo User</h3><p class="text-blue-200">Email: <code>demo@anwalts.ai</code></p><p class="text-blue-200">Password: <code>demo123</code></p><p class="text-sm text-blue-300">Role: Demo</p></div><div class="bg-purple-500/20 p-4 rounded-lg"><h3 class="text-lg font-semibold text-white">Regular User</h3><p class="text-purple-200">Email: <code>user@anwalts.ai</code></p><p class="text-purple-200">Password: <code>user123</code></p><p class="text-sm text-purple-300">Role: User</p></div><div class="bg-orange-500/20 p-4 rounded-lg"><h3 class="text-lg font-semibold text-white">Test User</h3><p class="text-orange-200">Email: <code>test@example.com</code></p><p class="text-orange-200">Password: <code>test123</code></p><p class="text-sm text-orange-300">Role: User</p></div></div></div><div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8"><h2 class="text-2xl font-bold text-white mb-4">🔑 Test Login Form</h2><form class="space-y-4"><div><label class="block text-white mb-2">Email:</label><input${ssrRenderAttr("value", loginForm.email)} type="email" class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60" placeholder="Enter email (try admin@anwalts.ai)"></div><div><label class="block text-white mb-2">Password:</label><input${ssrRenderAttr("value", loginForm.password)} type="password" class="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60" placeholder="Enter password (try admin123)"></div><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">${ssrInterpolate(loading.value ? "Testing..." : "Test Login")}</button></form>`);
      if (result.value) {
        _push(`<div class="${ssrRenderClass([result.value.success ? "bg-green-500/20" : "bg-red-500/20", "mt-4 p-4 rounded-lg"])}"><pre class="text-white text-sm">${ssrInterpolate(JSON.stringify(result.value, null, 2))}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8"><h2 class="text-2xl font-bold text-white mb-4">⚡ Quick Tests</h2><div class="grid md:grid-cols-4 gap-4"><button class="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"> Test Admin </button><button class="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"> Test Demo </button><button class="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"> Test User </button><button class="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"> Test Wrong </button></div></div><div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl"><h2 class="text-2xl font-bold text-white mb-4">🧭 Navigation</h2><div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Back to Landing `);
          } else {
            return [
              createTextVNode(" ← Back to Landing ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Dashboard → `);
          } else {
            return [
              createTextVNode(" Dashboard → ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/test-auth",
        class: "bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Button Tests `);
          } else {
            return [
              createTextVNode(" Button Tests ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/test-login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=test-login-aNAdaR34.mjs.map
