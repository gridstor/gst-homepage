export default async (request: Request) => {
  const url = new URL(request.url);
  const upstream = new URL(`https://gridstordayzer.netlify.app${url.pathname}${url.search}`);

  // Proxy the request to the upstream Dayzer site
  const upstreamResponse = await fetch(upstream.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().arrayBuffer() : undefined,
    redirect: 'manual'
  });

  // If HTML, rewrite absolute root-relative asset paths to keep them under /dayzer
  const contentType = upstreamResponse.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    const text = await upstreamResponse.text();
    // Ensure root-relative assets are prefixed with /dayzer
    // Replace href/src beginning with "/_astro/" or other root assets
    const rewritten = text
      .replaceAll('href="/_astro/', 'href="/dayzer/_astro/')
      .replaceAll('src="/_astro/', 'src="/dayzer/_astro/')
      .replaceAll('href="/assets/', 'href="/dayzer/assets/')
      .replaceAll('src="/assets/', 'src="/dayzer/assets/')
      .replaceAll('href="/favicon', 'href="/dayzer/favicon')
      .replaceAll('src="/favicon', 'src="/dayzer/favicon');

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


