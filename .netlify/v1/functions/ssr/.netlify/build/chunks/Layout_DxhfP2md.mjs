import { e as createComponent, f as createAstro, l as renderHead, h as addAttribute, n as renderSlot, r as renderTemplate } from './astro/server_D0YNkI8Y.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  const currentPath = Astro2.url.pathname;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>${title} | GridStor Analytics</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body> <header class="bg-white border-b border-gray-200"> <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between h-16"> <div class="flex"> <div class="flex-shrink-0 flex items-center"> <img src="/favicon.svg" alt="GridStor Analytics" class="h-8 w-auto"> <span class="ml-2 text-xl font-semibold text-gray-900">GridStor Analytics</span> </div> <div class="hidden sm:ml-6 sm:flex sm:space-x-8"> <a href="/"${addAttribute(`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentPath === "/" ? "border-indigo-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`, "class")}>
Home
</a> <a href="/curve-viewer"${addAttribute(`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentPath === "/curve-viewer" ? "border-indigo-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`, "class")}>
Curve Viewer
</a> <a href="/dayzer"${addAttribute(`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentPath === "/dayzer" ? "border-indigo-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`, "class")}>
Dayzer
</a> <a href="/about"${addAttribute(`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentPath === "/about" ? "border-indigo-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`, "class")}>
About
</a> </div> </div> </div> </nav> </header> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "C:/Users/Administrator/Documents/gst-homepage/gst-homepage/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
