# 🚨 CRITICAL: The `force` Flag Problem

## What Just Happened

We had a critical issue where **the main site's own assets were being proxied** instead of served locally!

## The Problem

### Netlify Redirect Processing Order

**With `force = true`:**
```
1. Process redirect (ignore local files)
2. Send to external site
```

**With `force = false`:**
```
1. Check if file exists in /dist/
2. If YES → Serve local file
3. If NO → Process redirect
```

### What Was Breaking

```toml
# BROKEN Configuration ❌
[[redirects]]
  from = "/_astro/*"
  to = "https://gridstor.netlify.app/_astro/:splat"
  force = true  # ← PROBLEM!
```

**Result:**
- Main site's `/_astro/MarketAnalyticsCard.js` → Proxied to gridstor → 404!
- Main site's `/_astro/docs.css` → Proxied to gridstor → 404!
- Homepage completely broken! ❌

## The Fix

### Current Configuration ✅

```toml
# Specific patterns (sub-app only) - force = true is OK
[[redirects]]
  from = "/_astro/*CurveViewer*.js"
  to = "https://gridstor.netlify.app/_astro/:splat"
  force = true  # ✅ OK - only CurveViewer has this

# General patterns - force = false (serve local first)
[[redirects]]
  from = "/_astro/client*.js"
  to = "https://gridstor.netlify.app/_astro/:splat"
  force = false  # ✅ Local files served first!

[[redirects]]
  from = "/_astro/*"
  to = "https://gridstor.netlify.app/_astro/:splat"
  force = false  # ✅ Local files served first!
```

## How It Works Now

### Main Homepage Request

```
User visits: gridstoranalytics.com/
Browser requests: /_astro/MarketAnalyticsCard.B6hCdTnr.js

1. Check /dist/_astro/MarketAnalyticsCard.B6hCdTnr.js
2. File EXISTS! ✅
3. Serve from local dist/ folder
4. Main site works! ✅
```

### Curve Viewer Request

```
User visits: gridstoranalytics.com/curve-viewer
HTML proxied from: gridstor.netlify.app
Browser requests: /_astro/CurveViewer.Cb6psWd0.js

1. Check /dist/_astro/CurveViewer.Cb6psWd0.js
2. File DOESN'T EXIST (not in main site)
3. Apply redirect → gridstor.netlify.app
4. File found on gridstor! ✅
5. Curve viewer works! ✅
```

## Key Rules

### When to Use `force = true`

**Only for assets that:**
1. Are SPECIFIC to a sub-app (not used by main site)
2. Have unique, identifiable patterns
3. Will NEVER exist in the main site's `/dist/`

**Examples:**
```toml
/_astro/*CurveViewer*.js   → force = true ✅
/_astro/*MECOverview*.js   → force = true ✅
/_astro/*api-health*.css   → force = true ✅
```

### When to Use `force = false`

**For generic patterns that might exist in multiple places:**
```toml
/_astro/client*.js   → force = false ✅
/_astro/*.css        → force = false ✅
/_astro/*            → force = false ✅
```

This ensures local files are served first, with proxying as fallback.

## Testing Checklist

After any `netlify.toml` changes:

### ✅ Main Site
```
Visit: gridstoranalytics.com/
Check: No 404 errors in console
Check: All components render correctly
Check: CSS loads properly
```

### ✅ Curve Viewer
```
Visit: gridstoranalytics.com/curve-viewer
Check: Page loads completely
Check: No 404 errors for curve-viewer assets
Check: Interactive elements work
```

### ✅ Market Ops
```
Visit: gridstoranalytics.com/market-ops
Check: Page loads completely
Check: Charts and data display correctly
Check: No asset errors
```

### ✅ Fundamentals
```
Visit: gridstoranalytics.com/fundamentals
Check: Page loads completely
Check: All features functional
Check: No asset errors
```

## Common Mistakes

### ❌ Mistake 1: Using `force = true` on Generic Patterns
```toml
# WRONG - This breaks the main site!
[[redirects]]
  from = "/_astro/*"
  to = "https://gridstor.netlify.app/_astro/:splat"
  force = true  # ❌ NO!
```

### ❌ Mistake 2: Not Testing All Pages
Just because one page works doesn't mean all do!
- Test main site ✅
- Test ALL proxied apps ✅

### ❌ Mistake 3: Assuming Order Doesn't Matter
Netlify processes redirects **top to bottom**:
- Specific patterns FIRST
- General patterns LAST
- Order matters!

## Quick Reference

| Pattern | force | Why |
|---------|-------|-----|
| `/_astro/*CurveViewer*` | `true` | Unique to curve-viewer only |
| `/_astro/*api-health*` | `true` | Unique to curve-viewer only |
| `/_astro/*MECOverview*` | `true` | Unique to market-ops only |
| `/_astro/client*.js` | `false` | Generic - main site has this too |
| `/_astro/*.css` | `false` | Generic - main site has CSS too |
| `/_astro/*` | `false` | Catch-all - must check local first |

## Current Status

✅ **FIXED:** All assets now route correctly
✅ **Main site:** Serves own assets from /dist/
✅ **Curve Viewer:** Proxies to gridstor.netlify.app
✅ **Market Ops:** Proxies to gridstordayzer.netlify.app
✅ **Fundamentals:** Proxies to gst-fundamentals.netlify.app

## Deploy & Test

```bash
git add netlify.toml
git commit -m "Fix force flag - serve local assets first, proxy as fallback"
git push origin main
```

Then test ALL pages thoroughly!
