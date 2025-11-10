/**
 * Edge Function to serve shared-header.js publicly
 * Bypasses password protection for this specific file
 */

import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  // Read the shared-header.js file from the public directory
  const headerJsPath = new URL('/shared-header.js', context.site.url);
  
  try {
    // Fetch the actual file (bypassing auth)
    const response = await fetch(headerJsPath, {
      // Pass through original request but bypass auth
      headers: {
        'x-nf-bypass-password': 'true' // Netlify internal header
      }
    });
    
    const content = await response.text();
    
    // Return with CORS headers
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    });
  } catch (error) {
    return new Response(
      `console.error('Failed to load shared header: ${error}');`,
      {
        status: 500,
        headers: {
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
};

export const config = {
  path: "/api/shared-header.js",
  cache: "manual"
};

