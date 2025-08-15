export default async (request: Request) => {
  const url = new URL(request.url);

  // Strip the /dayzer prefix so upstream receives root-relative paths
  let upstreamPath = url.pathname.replace(/^\/dayzer(\/)?/, '/');
  if (upstreamPath === '') upstreamPath = '/';
  const upstream = new URL(`https://gridstordayzer.netlify.app${upstreamPath}${url.search}`);

  // Proxy the request to the upstream Dayzer site
  const upstreamResponse = await fetch(upstream.toString(), {
    method: request.method,
    // Forward headers, but let the platform set correct Host
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().arrayBuffer() : undefined,
    redirect: 'manual'
  });

  // If HTML, rewrite absolute root-relative asset paths to keep them under /dayzer
  const contentType = upstreamResponse.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    let text = await upstreamResponse.text();
    // Ensure root-relative assets are prefixed with /dayzer
    // Replace href/src beginning with "/_astro/" or other root assets
    text = text
      .replaceAll('href="/_astro/', 'href="/dayzer/_astro/')
      .replaceAll('src="/_astro/', 'src="/dayzer/_astro/')
      .replaceAll('href="/assets/', 'href="/dayzer/assets/')
      .replaceAll('src="/assets/', 'src="/dayzer/assets/')
      .replaceAll('href="/favicon', 'href="/dayzer/favicon')
      .replaceAll('src="/favicon', 'src="/dayzer/favicon')
      .replace('<base href="/">', '<base href="/dayzer/">');

    // Rewrite generic root-relative navigation links to stay under /dayzer
    // Avoid double-prefixing already-correct paths and assets handled above
    text = text
      // href="/" -> href="/dayzer/"
      .replace(/href="\/"/g, 'href="/dayzer/"')
      // href="/foo" -> href="/dayzer/foo" (excluding dayzer, _astro, assets, favicon)
      .replace(/href="\/(?!dayzer\b)(?!_astro\/)(?!assets\/)(?!favicon)([^"#?\s]*)/g, 'href="/dayzer/$1')
      // action="/foo" -> action="/dayzer/foo"
      .replace(/action="\/(?!dayzer\b)([^"#?\s]*)/g, 'action="/dayzer/$1')
      // src="/foo" (non-asset)
      .replace(/src="\/(?!dayzer\b)(?!_astro\/)(?!assets\/)(?!favicon)([^"#?\s]*)/g, 'src="/dayzer/$1');

    const rewritten = text;

    return new Response(rewritten, {
      status: upstreamResponse.status,
      headers: {
        'content-type': contentType
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
  path: ["/dayzer", "/dayzer/*"],
};


