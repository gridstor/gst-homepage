export default async (request: Request) => {
  const url = new URL(request.url);

  // Strip the /curve-viewer prefix so upstream receives root-relative paths
  let upstreamPath = url.pathname.replace(/^\/curve-viewer(\/)?/, '/');
  // If the browser requests root-level assets from a /curve-viewer page,
  // proxy them to the upstream root without prefixing, so they resolve correctly.
  const referer = request.headers.get('referer') || '';
  const isFromCurveViewer = referer.includes('/curve-viewer');
  const isRootAsset = url.pathname.startsWith('/curve-viewer/_astro/')
    || url.pathname.startsWith('/curve-viewer/assets/')
    || url.pathname.startsWith('/favicon')
    || url.pathname.startsWith('/images/')
    || url.pathname.endsWith('.js')
    || url.pathname.endsWith('.css');
  if (isFromCurveViewer && isRootAsset) {
    // Map /curve-viewer/_astro/* -> /_astro/* for upstream
    upstreamPath = url.pathname.replace(/^\/curve-viewer\//, '/');
  }
  if (upstreamPath === '') upstreamPath = '/';
  const upstream = new URL(`https://gridstor.netlify.app/curve-viewer${upstreamPath}${url.search}`);

  // Proxy the request to the upstream Curve Viewer site
  const upstreamResponse = await fetch(upstream.toString(), {
    method: request.method,
    // Forward headers, but let the platform set correct Host
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().arrayBuffer() : undefined,
    redirect: 'manual'
  });

  // If HTML, rewrite absolute root-relative asset paths to keep them under /curve-viewer
  const contentType = upstreamResponse.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    let text = await upstreamResponse.text();
    // Ensure root-relative assets are prefixed with /curve-viewer
    // Replace href/src beginning with "/_astro/" or other root assets
    text = text
      .replaceAll('href="/_astro/', 'href="/curve-viewer/_astro/')
      .replaceAll('src="/_astro/', 'src="/curve-viewer/_astro/')
      .replaceAll('href="/assets/', 'href="/curve-viewer/assets/')
      .replaceAll('src="/assets/', 'src="/curve-viewer/assets/')
      .replaceAll('href="/favicon', 'href="/curve-viewer/favicon')
      .replaceAll('src="/favicon', 'src="/curve-viewer/favicon')
      .replace('<base href="/">', '<base href="/curve-viewer/">');

    // Rewrite generic root-relative navigation links to stay under /curve-viewer
    // Avoid double-prefixing already-correct paths and assets handled above
    text = text
      // href="/" -> href="/curve-viewer/"
      .replace(/href="\/"/g, 'href="/curve-viewer/"')
      // href="/foo" -> href="/curve-viewer/foo" (excluding curve-viewer, _astro, assets, favicon)
      .replace(/href="\/(?!curve-viewer\b)(?!_astro\/)(?!assets\/)(?!favicon)([^"#?\s]*)/g, 'href="/curve-viewer/$1')
      // action="/foo" -> action="/curve-viewer/foo"
      .replace(/action="\/(?!curve-viewer\b)([^"#?\s]*)/g, 'action="/curve-viewer/$1')
      // src="/foo" (non-asset)
      .replace(/src="\/(?!curve-viewer\b)(?!_astro\/)(?!assets\/)(?!favicon)([^"#?\s]*)/g, 'src="/curve-viewer/$1');

    const rewritten = text;

    return new Response(rewritten, {
      status: upstreamResponse.status,
      headers: {
        'content-type': contentType,
        'Set-Cookie': 'netlify-curve-viewer-active=true; Path=/; Max-Age=3600; SameSite=Lax'
      }
    });
  }

  // For non-HTML responses (css/js/assets), stream through unchanged
  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: upstreamResponse.headers
  });
};

export const config = {
  path: ["/curve-viewer", "/curve-viewer/*"],
};
