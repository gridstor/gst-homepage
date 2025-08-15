/* empty css                                 */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D0YNkI8Y.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_DxhfP2md.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$About = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto"> <h1 class="text-4xl font-bold text-gray-900 mb-8">About Teal Trappist</h1> <div class="bg-white rounded-lg shadow p-6 mb-8"> <h2 class="text-2xl font-semibold text-gray-900 mb-4">Project Overview</h2> <p class="text-gray-600 mb-4">
This project was created using the GridStor Analytics template, providing a modern, 
        full-stack web application foundation with data visualization, database integration, 
        and cloud deployment capabilities.
</p> <h3 class="text-xl font-semibold text-gray-900 mb-3">Tech Stack</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <h4 class="font-medium text-gray-900 mb-2">Frontend</h4> <ul class="text-sm text-gray-600 space-y-1"> <li>• Astro.js v5.8.1</li> <li>• React 18.2.0</li> <li>• TypeScript</li> <li>• Tailwind CSS</li> </ul> </div> <div> <h4 class="font-medium text-gray-900 mb-2">Backend</h4> <ul class="text-sm text-gray-600 space-y-1"> <li>• PostgreSQL</li> <li>• Prisma ORM</li> <li>• Netlify Functions</li> <li>• Chart.js</li> </ul> </div> </div> </div> <div class="bg-white rounded-lg shadow p-6"> <h2 class="text-2xl font-semibold text-gray-900 mb-4">Ready to Build</h2> <p class="text-gray-600">
Your project is now set up with all the essential components and configurations. 
        You can start building your features right away!
</p> </div> </div> ` })}`;
}, "C:/Users/Administrator/Documents/gst-homepage/gst-homepage/src/pages/about.astro", void 0);

const $$file = "C:/Users/Administrator/Documents/gst-homepage/gst-homepage/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
