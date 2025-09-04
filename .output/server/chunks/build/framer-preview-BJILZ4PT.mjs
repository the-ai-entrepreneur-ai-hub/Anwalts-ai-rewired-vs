import { ssrRenderAttrs } from 'vue/server-renderer';
import { useSSRContext } from 'vue';

const _sfc_main = {
  __name: "framer-preview",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="min-h-screen bg-white"><div class="max-w-7xl mx-auto px-4 py-8"><h1 class="text-3xl font-bold mb-8">Framer Components Preview</h1><div class="space-y-8"><div class="p-6 border rounded-lg"><h2 class="text-xl font-semibold mb-4">Ready for Framer Components</h2><p class="text-gray-600 mb-4"> Once you export your Framer components, they will appear here. </p><p class="text-sm text-gray-500"> Run: <code class="bg-gray-100 px-2 py-1 rounded">npx unframer {PROJECT_ID} --outDir ./components/framer</code></p></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/framer-preview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=framer-preview-BJILZ4PT.mjs.map
