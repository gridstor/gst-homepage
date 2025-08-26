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
    // Use a different approach - try to mimic the exact headers that work
    // when accessing gridstor.netlify.app directly
    const proxyHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      // Try without referer to avoid cross-origin issues
    };

    const upstreamResponse = await fetch(upstream.toString(), {
      method: request.method,
      headers: proxyHeaders,
      redirect: 'follow'
    });

    console.log('Curve Viewer Edge Function - Response status:', upstreamResponse.status);

    // If we're still getting 401, try a fallback approach
    if (upstreamResponse.status === 401) {
      console.log('Curve Viewer Edge Function - 401 detected, trying fallback');
      
      // Return a simple HTML page that loads the content via iframe
      // This bypasses CORS and authentication issues
      const fallbackHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revenue Forecasts - GridStor Analytics</title>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        iframe { width: 100%; height: 100vh; border: none; }
        .loading { 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            font-family: Arial, sans-serif;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="loading">Loading Revenue Forecasts...</div>
    <iframe src="https://gridstor.netlify.app${upstreamPath}" 
            onload="document.querySelector('.loading').style.display='none'"
            title="Revenue Forecasts"></iframe>
</body>
</html>`;

      return new Response(fallbackHTML, {
        status: 200,
        headers: {
          'content-type': 'text/html',
          'cache-control': 'no-cache'
        }
      });
    }

    // Check for redirect status codes that might cause loops
    if (upstreamResponse.status >= 300 && upstreamResponse.status < 400) {
      console.log('Curve Viewer Edge Function - Redirect detected:', upstreamResponse.headers.get('location'));
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