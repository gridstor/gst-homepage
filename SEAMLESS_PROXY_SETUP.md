# Seamless Proxy Setup Guide

## Goal
Achieve `gridstoranalytics.com/dayzer` URL that displays Dayzer content without 400 errors

## Current Configuration

### Netlify.toml
```toml
[[redirects]]
  from = "/dayzer"
  to = "https://gridstordayzer.netlify.app/"
  status = 200
  force = true

[[redirects]]
  from = "/dayzer/*"
  to = "https://gridstordayzer.netlify.app/:splat"
  status = 200
  force = true
```

### Key Points
- **Status 200**: Proxy (seamless URLs)
- **Force true**: Override any conflicting rules
- **No headers**: Minimal configuration to avoid conflicts

## Critical Netlify Dashboard Settings

### 1. Password Protection Configuration
⚠️ **CRITICAL**: If you have site password protection enabled:

**Correct Setting**:
- Go to Site Settings > Access control > Password protection
- Set to **"Visitor access"** (protects the whole site)
- NOT "Deploy previews only"

**Why**: Deploy preview protection can interfere with proxy redirects

### 2. Edge Functions Check
- Ensure no Edge Functions are processing `/dayzer` paths
- Check Site Settings > Functions for any custom functions

### 3. Build Settings
- Verify publish directory is `dist`
- Ensure `_redirects` file is generated correctly

## Troubleshooting Checklist

### If You Get 400 Errors Again:

#### 1. Check Netlify Deploy Logs
```
Look for:
- "Processing redirects"
- "_redirects file found"
- Any error messages about redirect processing
```

#### 2. Test Target Site Directly
```
Visit: https://gridstordayzer.netlify.app/
Ensure it loads without errors
```

#### 3. Check for Authentication Conflicts
```
Temporarily disable site password protection
Test if proxy works without auth
Re-enable auth and test again
```

#### 4. Browser Developer Tools
```
Network tab:
- Look for the request to /dayzer
- Check response headers
- Look for CORS errors
```

## Expected Behavior

### Working Seamless Proxy:
1. User visits `gridstoranalytics.com/dayzer`
2. URL stays `gridstoranalytics.com/dayzer`
3. Content loads from `gridstordayzer.netlify.app`
4. No authentication prompts
5. No 400/401/403 errors

### User Experience:
- ✅ Seamless URL (stays on your domain)
- ✅ No authentication required
- ✅ Fast loading
- ✅ All Dayzer functionality works

## Fallback Options

### If Proxy Still Causes Issues:

#### Option 1: 301 Permanent Redirect
```toml
[[redirects]]
  from = "/dayzer"
  to = "https://gridstordayzer.netlify.app/"
  status = 301
  force = true
```
- Better for SEO than 302
- Reliable, no 400 errors
- URL changes to target site

#### Option 2: Iframe Integration
- Embed Dayzer in iframe on your site
- Keeps your URL
- May have mobile compatibility issues

#### Option 3: Subdirectory Deployment
- Deploy Dayzer content as subdirectory in main site
- True seamless integration
- Requires build process changes

## Testing Steps

1. **Deploy** the current configuration
2. **Clear browser cache** completely
3. **Test** `gridstoranalytics.com/dayzer`
4. **Verify** URL stays on your domain
5. **Check** all Dayzer functionality works

## Success Metrics
- ✅ No 400 errors
- ✅ URL shows `gridstoranalytics.com/dayzer`
- ✅ Dayzer Market Ops dashboard loads
- ✅ All interactive elements work
- ✅ Performance data displays correctly
