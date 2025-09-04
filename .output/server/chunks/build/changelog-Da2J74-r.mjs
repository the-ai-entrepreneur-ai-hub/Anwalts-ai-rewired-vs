import { a as __nuxt_component_0$1 } from './server.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "changelog",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" }, _attrs))}><header class="bg-white/10 backdrop-blur-md border-b border-white/20"><div class="container mx-auto px-4 py-4 flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-2xl font-bold text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`ANWALTS.AI`);
          } else {
            return [
              createTextVNode("ANWALTS.AI")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-white/80 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Zurück`);
          } else {
            return [
              createTextVNode("← Zurück")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header><div class="container mx-auto px-4 py-12"><div class="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8"><h1 class="text-4xl font-bold text-white mb-6">Changelog</h1><div class="text-white/90 space-y-8"><div class="border-l-4 border-blue-500 pl-6"><div class="flex items-center gap-3 mb-2"><h2 class="text-2xl font-semibold text-white">Version 1.0.7</h2><span class="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Latest</span></div><p class="text-sm text-white/70 mb-4">Released: January 2025</p><ul class="list-disc list-inside space-y-2"><li>🔧 Fixed authentication flow and removed external dependencies</li><li>✨ Improved glassmorphism design across all pages</li><li>🛡️ Enhanced security and data protection</li><li>🚀 Performance optimizations</li></ul></div><div class="border-l-4 border-gray-500 pl-6"><h2 class="text-2xl font-semibold text-white mb-2">Version 1.0.6</h2><p class="text-sm text-white/70 mb-4">Released: December 2024</p><ul class="list-disc list-inside space-y-2"><li>📄 Enhanced document analysis capabilities</li><li>🤖 Improved AI assistant responses</li><li>🎨 UI/UX improvements</li></ul></div><div class="border-l-4 border-gray-500 pl-6"><h2 class="text-2xl font-semibold text-white mb-2">Version 1.0.5</h2><p class="text-sm text-white/70 mb-4">Released: November 2024</p><ul class="list-disc list-inside space-y-2"><li>⚖️ Extended legal database coverage</li><li>🔍 Improved search functionality</li><li>📊 Added analytics dashboard</li></ul></div><div class="border-l-4 border-gray-500 pl-6"><h2 class="text-2xl font-semibold text-white mb-2">Version 1.0.4</h2><p class="text-sm text-white/70 mb-4">Released: October 2024</p><ul class="list-disc list-inside space-y-2"><li>🔐 Enhanced user authentication</li><li>💾 Improved data storage and backup</li><li>🐛 Various bug fixes and improvements</li></ul></div><div class="mt-12 pt-6 border-t border-white/20">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Zurück zur Startseite `);
          } else {
            return [
              createTextVNode(" Zurück zur Startseite ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/changelog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=changelog-Da2J74-r.mjs.map
