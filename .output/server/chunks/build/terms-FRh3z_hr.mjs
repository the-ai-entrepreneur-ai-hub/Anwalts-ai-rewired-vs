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
  __name: "terms",
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
      _push(`</div></header><div class="container mx-auto px-4 py-12"><div class="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8"><h1 class="text-4xl font-bold text-white mb-6">Terms of Service</h1><div class="text-white/90 prose prose-invert max-w-none"><p class="text-lg mb-6">Last updated: January 23, 2025</p><p class="mb-6">Welcome to ANWALTS.AI (&quot;we&quot; or &quot;us&quot;). These Terms of Service govern your use of our website and related services.</p><h2 class="text-2xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2><p class="mb-4">We may collect personal information such as your name, email address, and other contact details when you register for an account or use our services.</p><h2 class="text-2xl font-semibold text-white mt-8 mb-4">2. How We Use Your Information</h2><ul class="list-disc list-inside mb-6 space-y-2"><li>Providing and maintaining our services</li><li>Communicating with you about your account</li><li>Improving our services and user experience</li><li>Complying with legal obligations</li></ul><h2 class="text-2xl font-semibold text-white mt-8 mb-4">3. Data Protection</h2><p class="mb-4">We implement appropriate security measures to protect your personal information in accordance with applicable data protection laws.</p><h2 class="text-2xl font-semibold text-white mt-8 mb-4">4. Your Rights</h2><p class="mb-4">You have the right to access, update, or delete your personal information. Contact us if you need assistance with your data rights.</p><h2 class="text-2xl font-semibold text-white mt-8 mb-4">5. Contact Information</h2><p class="mb-4">If you have any questions about these Terms of Service, please contact us through our website.</p><div class="mt-12 pt-6 border-t border-white/20">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=terms-FRh3z_hr.mjs.map
