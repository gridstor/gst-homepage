import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const referer = request.headers.get('referer') || '';
  const path = url.pathname;
  
  console.log(`Asset request: ${path}, Referer: ${referer}`);
  
  // Determine which backend to proxy to based on the referer
  let targetOrigin: string;
  let fallbackOrigin: string | null = null;
  
  if (referer.includes('/short-term-outlook')) {
    targetOrigin = 'https://gridstordayzer.netlify.app';
    console.log('Routing to gridstordayzer (short-term-outlook)');
  } else if (referer.includes('/long-term-outlook')) {
    targetOrigin = 'https://gridstor.netlify.app';
    console.log('Routing to gridstor (long-term-outlook)');
  } else if (referer.includes('/curve-viewer')) {
    targetOrigin = 'https://gridstor.netlify.app';
    console.log('Routing to gridstor (curve-viewer)');
  } else if (referer.includes('/admin')) {
    targetOrigin = 'https://gridstor.netlify.app';
    console.log('Routing to gridstor (admin)');
  } else if (referer.includes('/fundamentals')) {
    targetOrigin = 'https://gst-fundamentals.netlify.app';
    console.log('Routing to fundamentals');
  } else {
    // Check if it's an asset from the main site by trying locally first
    // For unknown referers, try gridstordayzer first with gridstor as fallback
    targetOrigin = 'https://gridstordayzer.netlify.app';
    fallbackOrigin = 'https://gridstor.netlify.app';
    console.log('Default routing to gridstordayzer with gridstor fallback');
  }
  
  // Construct the target URL
  const targetUrl = `${targetOrigin}${url.pathname}${url.search}`;
  
  try {
    // Fetch from the target origin
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
    });
    
    // If we get a 404 and have a fallback origin, try the fallback
    if (!response.ok && response.status === 404 && fallbackOrigin) {
      console.log(`Asset not found at ${targetOrigin}, trying ${fallbackOrigin} fallback`);
      const fallbackUrl = `${fallbackOrigin}${url.pathname}${url.search}`;
      const fallbackResponse = await fetch(fallbackUrl, {
        method: request.method,
        headers: request.headers,
      });
      
      if (fallbackResponse.ok) {
        console.log(`Asset found at fallback ${fallbackOrigin}`);
        return fallbackResponse;
      }
    }
    
    // Return the response (even if 404 - let the browser handle it)
    return response;
  } catch (error) {
    console.error(`Error proxying asset: ${error}`);
    return new Response('Asset proxy error', { status: 500 });
  }
};

