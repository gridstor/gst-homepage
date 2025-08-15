/* empty css                                 */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D0YNkI8Y.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DxhfP2md.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Home" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="text-center"> <h1 class="text-4xl font-bold text-gray-900 mb-8">
Welcome to GridStor Analytics
</h1> <p class="text-xl text-gray-600 mb-8">
Your comprehensive platform for data analysis and visualization
</p> <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"> <!-- Curve Viewer Card --> <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"> <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"> <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg> </div> <h2 class="text-xl font-semibold text-gray-900 ml-3">Curve Viewer</h2> </div> <p class="text-gray-600 mb-4">
Advanced curve analysis and visualization tools for complex data patterns.
</p> <a href="/curve-viewer" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
Launch Curve Viewer
<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> <!-- Dayzer Card --> <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"> <div class="flex items-center mb-4"> <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"> <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div> <h2 class="text-xl font-semibold text-gray-900 ml-3">Dayzer</h2> </div> <p class="text-gray-600 mb-4">
Comprehensive day-by-day analysis tools for tracking and optimization.
</p> <a href="/dayzer" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
Launch Dayzer
<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> </div> <!-- Features Section --> <div class="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto mt-8"> <h2 class="text-2xl font-semibold text-gray-900 mb-6">
Platform Features
</h2> <div class="grid md:grid-cols-3 gap-6 text-left"> <div class="flex flex-col items-center text-center"> <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3"> <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg> </div> <h3 class="font-semibold text-gray-900 mb-2">High Performance</h3> <p class="text-sm text-gray-600">Built on modern web technologies for lightning-fast performance</p> </div> <div class="flex flex-col items-center text-center"> <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3"> <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> </div> <h3 class="font-semibold text-gray-900 mb-2">Secure & Reliable</h3> <p class="text-sm text-gray-600">Enterprise-grade security with reliable data processing</p> </div> <div class="flex flex-col items-center text-center"> <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3"> <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path> </svg> </div> <h3 class="font-semibold text-gray-900 mb-2">User Friendly</h3> <p class="text-sm text-gray-600">Intuitive interface designed for efficient workflow</p> </div> </div> </div> </div> ` })}`;
}, "C:/Users/Administrator/Documents/gst-homepage/gst-homepage/src/pages/index.astro", void 0);

const $$file = "C:/Users/Administrator/Documents/gst-homepage/gst-homepage/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
