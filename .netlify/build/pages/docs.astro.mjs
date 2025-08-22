/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D0YNkI8Y.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout__798Nc9-.mjs';
export { renderers } from '../renderers.mjs';

const $$Docs = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "GridStor Analytics Documentation" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <h1 class="text-4xl font-bold text-gray-900 mb-8">GridStor Analytics Documentation</h1> <div class="bg-white rounded-lg shadow p-6 mb-8"> <h2 class="text-2xl font-semibold text-gray-900 mb-4">Platform Overview</h2> <p class="text-gray-600 mb-4">
GridStor Analytics provides comprehensive energy storage market analysis tools, 
        revenue forecasting, and operational insights for battery energy storage systems.
</p> <h3 class="text-xl font-semibold text-gray-900 mb-3">Available Tools</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <h4 class="font-medium text-gray-900 mb-2">Analytics Modules</h4> <ul class="text-sm text-gray-600 space-y-1"> <li>• Revenue Forecasts</li> <li>• Market Operations</li> <li>• Risk Assessment (Coming Soon)</li> <li>• Market Fundamentals (Coming Soon)</li> </ul> </div> <div> <h4 class="font-medium text-gray-900 mb-2">Technical Stack</h4> <ul class="text-sm text-gray-600 space-y-1"> <li>• Real-time market data</li> <li>• PostgreSQL database</li> <li>• Interactive visualizations</li> <li>• Cloud-based deployment</li> </ul> </div> </div> </div> <div class="bg-white rounded-lg shadow p-6"> <h2 class="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2> <p class="text-gray-600 mb-4">
Navigate through the main sections using the top navigation bar:
</p> <ul class="text-gray-600 space-y-2"> <li><strong>Revenue Forecasts:</strong> Analyze potential revenue streams and market opportunities</li> <li><strong>Market Ops:</strong> Monitor real-time market operations and performance metrics</li> <li><strong>Risk & Fundamentals:</strong> Advanced analytics modules (coming soon)</li> </ul> </div> </div> ` })}`;
}, "C:/Users/Administrator/Documents/gst-homepage/gst-homepage/src/pages/docs.astro", void 0);

const $$file = "C:/Users/Administrator/Documents/gst-homepage/gst-homepage/src/pages/docs.astro";
const $$url = "/docs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Docs,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
