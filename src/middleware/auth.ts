// Authentication middleware for GridStor Analytics
// Handles authentication exclusions for public sub-sites

import type { MiddlewareHandler } from 'astro';

export const authMiddleware: MiddlewareHandler = (context, next) => {
  const { url } = context;
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/dayzer',
    '/dayzer/',
  ];
  
  // Paths that start with these prefixes are public
  const publicPrefixes = [
    '/dayzer/',
  ];
  
  // Check if current path is public
  const isPublicPath = publicPaths.includes(url.pathname) || 
                      publicPrefixes.some(prefix => url.pathname.startsWith(prefix));
  
  if (isPublicPath) {
    // Skip authentication for public paths
    return next();
  }
  
  // For all other paths, authentication logic would go here
  // This is just a template - actual auth implementation depends on your setup
  return next();
};

export const onRequest = authMiddleware;
