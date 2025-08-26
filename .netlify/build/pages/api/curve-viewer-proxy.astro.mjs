export { renderers } from '../../renderers.mjs';

async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get("path") || "/curve-viewer/";
    console.log("Curve Viewer Proxy - Fetching:", `https://gridstor.netlify.app${path}`);
    const response = await fetch(`https://gridstor.netlify.app${path}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    console.log("Curve Viewer Proxy - Response status:", response.status);
    if (!response.ok) {
      return new Response(`Proxy error: ${response.status} ${response.statusText}`, {
        status: response.status,
        headers: {
          "Content-Type": "text/plain"
        }
      });
    }
    const contentType = response.headers.get("content-type") || "text/html";
    if (contentType.includes("text/html")) {
      let html = await response.text();
      html = html.replace(/href="\/(?!curve-viewer-proxy)/g, 'href="/api/curve-viewer-proxy?path=/').replace(/src="\/(?!curve-viewer-proxy)/g, 'src="/api/curve-viewer-proxy?path=/').replace(/action="\/(?!curve-viewer-proxy)/g, 'action="/api/curve-viewer-proxy?path=/').replace(/url\(\/(?!curve-viewer-proxy)/g, "url(/api/curve-viewer-proxy?path=/").replace(/"\/\_astro\//g, '"/api/curve-viewer-proxy?path=/_astro/').replace(/"\/assets\//g, '"/api/curve-viewer-proxy?path=/assets/');
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "no-cache"
        }
      });
    }
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Curve Viewer Proxy Error:", error);
    return new Response(`Proxy error: ${error.message}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
