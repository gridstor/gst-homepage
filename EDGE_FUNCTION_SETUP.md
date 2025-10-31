# Edge Function Asset Proxy Setup

## Overview

This document explains the Edge Function implementation for intelligent asset routing across multiple proxied Netlify sites.

## Problem

When proxying multiple Netlify sites (Short Term Outlook, Long Term Outlook, etc.) under one domain, static redirects in `netlify.toml` cannot determine which site's assets to serve. This causes CSS/JS from the wrong site to load, breaking the page styling.

## Solution

Implemented a Netlify Edge Function (`asset-proxy.ts`) that:
1. Checks the `Referer` header to determine which page the user is viewing
2. Dynamically routes asset requests to the appropriate backend
3. Falls back to alternative backends if assets aren't found

## Implementation

### Edge Function: `netlify/edge-functions/asset-proxy.ts`

Routes assets based on referer:
- `/short-term-outlook` → `gridstordayzer.netlify.app`
- `/long-term-outlook` → `gridstor.netlify.app`
- `/curve-viewer` → `gridstor.netlify.app`
- `/admin` → `gridstor.netlify.app`
- `/fundamentals` → `gst-fundamentals.netlify.app`

### Configuration: `netlify.toml`

```toml
[[edge_functions]]
  function = "asset-proxy"
  path = "/_astro/*"

[[edge_functions]]
  function = "asset-proxy"
  path = "/assets/*"
```

## How It Works

1. User visits `/short-term-outlook`
2. Page HTML is proxied from `gridstordayzer.netlify.app`
3. Browser requests assets like `/_astro/index.abc123.js`
4. Edge Function intercepts the request
5. Checks referer header → sees `/short-term-outlook`
6. Fetches asset from `gridstordayzer.netlify.app/_astro/index.abc123.js`
7. Returns asset to browser

## Benefits

- ✅ Each proxied page loads its correct assets
- ✅ No hardcoded asset hashes in redirects
- ✅ Automatic fallback to alternative backends
- ✅ Seamless user experience (URL stays on main domain)
- ✅ Runs at edge for low latency

## Testing

After deployment:
1. Visit `/short-term-outlook`
2. Open browser DevTools → Network tab
3. Verify assets load with status 200
4. Check styling matches expected design
5. Repeat for other proxied pages

## Debugging

Check Edge Function logs in Netlify dashboard:
- Site → Functions → Edge Functions → asset-proxy
- Look for "Routing to..." log messages
- Verify assets are being fetched from correct origins

## Maintenance

When adding new proxied sites:
1. Add proxy redirect in `netlify.toml` (already done for pages)
2. Add routing logic in `asset-proxy.ts` referer check
3. Deploy and test

## Related Files

- `/netlify/edge-functions/asset-proxy.ts` - Edge Function implementation
- `/netlify.toml` - Edge Function configuration
- `/netlify/edge-functions/dayzer.ts` - Example of path-based proxying

---

**Created**: October 31, 2025  
**Last Updated**: October 31, 2025  
**Status**: Implemented, awaiting deployment testing

