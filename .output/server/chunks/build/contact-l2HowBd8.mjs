import { a as __nuxt_component_0$1 } from './server.mjs';
import { reactive, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    const form = reactive({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    const loading = ref(false);
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
      _push(`</div></header><div class="container mx-auto px-4 py-12"><div class="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8"><h1 class="text-4xl font-bold text-white mb-6">Kontakt</h1><div class="text-white/90"><p class="text-lg mb-8">Haben Sie Fragen zu ANWALTS.AI? Wir helfen Ihnen gerne weiter!</p><form class="space-y-6"><div class="grid md:grid-cols-2 gap-6"><div><label class="block text-white mb-2">Name *</label><input${ssrRenderAttr("value", unref(form).name)} type="text" required class="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ihr Name"></div><div><label class="block text-white mb-2">E-Mail *</label><input${ssrRenderAttr("value", unref(form).email)} type="email" required class="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ihre@email.com"></div></div><div><label class="block text-white mb-2">Betreff</label><input${ssrRenderAttr("value", unref(form).subject)} type="text" class="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Worum geht es?"></div><div><label class="block text-white mb-2">Nachricht *</label><textarea rows="6" required class="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ihre Nachricht...">${ssrInterpolate(unref(form).message)}</textarea></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50">${ssrInterpolate(unref(loading) ? "Wird gesendet..." : "Nachricht senden")}</button></form><div class="mt-12 pt-6 border-t border-white/20">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact-l2HowBd8.mjs.map
