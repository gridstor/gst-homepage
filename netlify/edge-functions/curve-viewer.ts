export default async (request: Request) => {
  const url = new URL(request.url);

  // Debug logging to understand what's happening
  console.log('Curve Viewer Edge Function - Request:', url.pathname);

  // Strip the /curve-viewer prefix so upstream receives root-relative paths
  let upstreamPath = url.pathname.replace(/^\/curve-viewer(\/)?/, '/');
  if (upstreamPath === '') upstreamPath = '/';
  const upstream = new URL(`https://gridstor.netlify.app${upstreamPath}${url.search}`);

  console.log('Curve Viewer Edge Function - Upstream:', upstream.toString());

  try {
    // Proxy the request to the upstream Curve Viewer site
    const upstreamResponse = await fetch(upstream.toString(), {
      method: request.method,
      headers: {
        'User-Agent': 'GridStor-Analytics-Proxy/1.0',
        'Accept': request.headers.get('Accept') || '*/*',
        'Accept-Language': request.headers.get('Accept-Language') || 'en-US,en;q=0.9',
      },
      redirect: 'follow' // Changed from 'manual' to 'follow' to handle redirects properly
    });

    console.log('Curve Viewer Edge Function - Response status:', upstreamResponse.status);

    // Check for redirect status codes that might cause loops
    if (upstreamResponse.status >= 300 && upstreamResponse.status < 400) {
      console.log('Curve Viewer Edge Function - Redirect detected:', upstreamResponse.headers.get('location'));
      // Return a simple error page instead of following redirects that might loop
      return new Response('Upstream redirect detected. Please check configuration.', {
        status: 500,
        headers: { 'content-type': 'text/plain' }
      });
    }

    // If HTML, rewrite absolute root-relative asset paths to keep them under /curve-viewer
    const contentType = upstreamResponse.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      let text = await upstreamResponse.text();
      // Ensure root-relative assets are prefixed with /curve-viewer
      text = text
        .replaceAll('href="/_astro/', 'href="/curve-viewer/_astro/')
        .replaceAll('src="/_astro/', 'src="/curve-viewer/_astro/')
        .replaceAll('href="/assets/', 'href="/curve-viewer/assets/')
        .replaceAll('src="/assets/', 'src="/curve-viewer/assets/')
        .replaceAll('href="/favicon', 'href="/curve-viewer/favicon')
        .replaceAll('src="/favicon', 'src="/curve-viewer/favicon')
        .replace('<base href="/">', '<base href="/curve-viewer/">');

      // Rewrite generic root-relative navigation links to stay under /curve-viewer
      text = text
        .replace(/href="\/"/g, 'href="/curve-viewer/"')
        .replace(/href="\/(?!curve-viewer\b)(?!_astro\/)(?!assets\/)(?!favicon)([^"#?\s]*)/g, 'href="/curve-viewer/$1')
        .replace(/action="\/(?!curve-viewer\b)([^"#?\s]*)/g, 'action="/curve-viewer/$1')
        .replace(/src="\/(?!curve-viewer\b)(?!_astro\/)(?!assets\/)(?!favicon)([^"#?\s]*)/g, 'src="/curve-viewer/$1');

      return new Response(text, {
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

  } catch (error) {
    console.error('Curve Viewer Edge Function - Error:', error);
    return new Response('Edge function error: ' + error.message, {
      status: 500,
      headers: { 'content-type': 'text/plain' }
    });
  }
};

export const config = {
  path: ["/curve-viewer", "/curve-viewer/*"],
};
