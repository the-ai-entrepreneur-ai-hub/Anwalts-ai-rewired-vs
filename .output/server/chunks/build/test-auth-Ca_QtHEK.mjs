import { a as __nuxt_component_0$1 } from './server.mjs';
import { ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "test-auth",
  __ssrInlineRender: true,
  setup(__props) {
    const showModal = ref(false);
    const clickCount = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center" }, _attrs))}><div class="max-w-md w-full p-8"><h1 class="text-3xl font-bold text-white text-center mb-8">AUTH TEST PAGE</h1><div class="space-y-4"><button class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all"> TEST: Open Modal </button><button class="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all"> TEST: Direct Auth </button><a href="/api/auth/test" class="block w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-all text-center"> TEST: Server Auth </a>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard?auth=test&demo=true",
        class: "block w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-all text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` TEST: Direct Dashboard `);
          } else {
            return [
              createTextVNode(" TEST: Direct Dashboard ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-8 text-white text-center"><p>Modal State: ${ssrInterpolate(showModal.value ? "OPEN" : "CLOSED")}</p><p>Click Count: ${ssrInterpolate(clickCount.value)}</p></div></div>`);
      if (showModal.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white p-8 rounded-lg max-w-sm w-full mx-4"><h2 class="text-xl font-bold mb-4">AUTH MODAL WORKS!</h2><p class="mb-4">This proves the modal system is working correctly.</p><button class="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2"> Google Auth </button><button class="w-full bg-gray-500 text-white py-2 px-4 rounded mb-2"> Email Auth </button><button class="w-full bg-red-500 text-white py-2 px-4 rounded"> Close </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/test-auth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=test-auth-Ca_QtHEK.mjs.map
