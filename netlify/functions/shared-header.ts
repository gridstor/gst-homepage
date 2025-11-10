/**
 * Netlify Serverless Function to serve shared-header.js publicly
 * This bypasses password protection and serves the file with CORS headers
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import * as fs from 'fs';
import * as path from 'path';

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Only allow GET and OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Read the shared-header.js file from the public directory
    // In production, this will be in the dist folder after build
    const filePath = path.join(process.cwd(), 'dist', 'shared-header.js');
    
    let content: string;
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8');
    } else {
      // Fallback: Try the public folder (for local dev)
      const publicPath = path.join(process.cwd(), 'public', 'shared-header.js');
      if (fs.existsSync(publicPath)) {
        content = fs.readFileSync(publicPath, 'utf-8');
      } else {
        throw new Error('shared-header.js not found');
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'X-Robots-Tag': 'none',
      },
      body: content,
    };
  } catch (error) {
    console.error('Error serving shared-header.js:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/javascript',
        'Access-Control-Allow-Origin': '*',
      },
      body: `console.error('Failed to load GridStor shared header: ${error instanceof Error ? error.message : 'Unknown error'}');`,
    };
  }
};

