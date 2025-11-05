import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const referer = request.headers.get('referer') || '';
  const path = url.pathname;
  
  console.log(`Asset request: ${path}, Referer: ${referer}`);
  
  // If referer is empty or is the homepage/main site pages, pass through to local assets
  // This allows the main site's own assets to be served normally
  if (!referer || 
      referer.endsWith('/') || 
      referer.includes('/risk-structuring') ||
      referer.includes('/docs') ||
      (!referer.includes('/short-term-outlook') && 
       !referer.includes('/admin') && 
       !referer.includes('/long-term-outlook') && 
       !referer.includes('/curve-viewer') && 
       !referer.includes('/fundamentals'))) {
    console.log('Passing through to local assets (main site)');
    return context.next();
  }
  
  // Determine which backend to proxy to based on the referer
  let targetOrigin: string;
  
  if (referer.includes('/short-term-outlook')) {
    targetOrigin = 'https://gridstordayzer.netlify.app';
    console.log('Routing to gridstordayzer (short-term-outlook)');
  } else if (referer.includes('/admin')) {
    targetOrigin = 'https://gridstordayzer.netlify.app';
    console.log('Routing to gridstordayzer (admin)');
  } else if (referer.includes('/long-term-outlook')) {
    targetOrigin = 'https://gridstor.netlify.app';
    console.log('Routing to gridstor (long-term-outlook)');
  } else if (referer.includes('/curve-viewer')) {
    targetOrigin = 'https://gridstor.netlify.app';
    console.log('Routing to gridstor (curve-viewer)');
  } else if (referer.includes('/fundamentals')) {
    targetOrigin = 'https://gst-fundamentals.netlify.app';
    console.log('Routing to fundamentals');
  } else {
    // This shouldn't happen now, but fallback to passing through
    console.log('Unexpected referer, passing through to local assets');
    return context.next();
  }
  
  // Construct the target URL
  const targetUrl = `${targetOrigin}${url.pathname}${url.search}`;
  
  try {
    // Fetch from the target origin
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
    });
    
    // Return the response
    return response;
  } catch (error) {
    console.error(`Error proxying asset: ${error}`);
    return new Response('Asset proxy error', { status: 500 });
  }
};

