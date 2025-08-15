# 400 Error Troubleshooting Guide

## Current Issue
Getting a 400 Bad Request error when accessing `https://gridstoranalytics.com/dayzer`

## Potential Causes
1. **Headers Conflict**: Authentication headers interfering with proxy
2. **CORS Issues**: Cross-origin request blocks between domains
3. **Malformed Configuration**: Syntax issues in redirect rules
4. **Authentication Interference**: Main site password protection affecting proxy

## Solutions Tried

### 1. Simplified Proxy Configuration
- Removed complex headers from redirects
- Simplified _headers file
- Using basic status 200 proxy

### 2. Alternative Approaches to Try

#### Option A: Use 301 Permanent Redirect (SEO-friendly)
```toml
[[redirects]]
  from = "/dayzer"
  to = "https://gridstordayzer.netlify.app/"
  status = 301
  force = true
```

#### Option B: Use 302 Temporary Redirect (Original Working Version)
```toml
[[redirects]]
  from = "/dayzer"
  to = "https://gridstordayzer.netlify.app/"
  status = 302
  force = true
```

#### Option C: Conditional Redirect Based on Authentication
```toml
# If no authentication is needed, redirect to external site
[[redirects]]
  from = "/dayzer"
  to = "https://gridstordayzer.netlify.app/"
  status = 302
  force = true
  conditions = {Role = ["!authenticated"]}
```

## Debugging Steps

### 1. Check Netlify Deploy Logs
- Look for redirect processing errors
- Verify _redirects file generation
- Check for conflicting rules

### 2. Test Direct Access
- Test `https://gridstordayzer.netlify.app/` directly
- Ensure target site is accessible
- Check for CORS headers on target site

### 3. Browser Developer Tools
- Check Network tab for request details
- Look for specific error messages
- Verify request headers being sent

### 4. Test Different Redirect Types
1. Try 302 redirect first (known working)
2. If 302 works, gradually add proxy features
3. Test without any headers initially

## Recommended Solution

**Phase 1: Get it working with 302**
```toml
[[redirects]]
  from = "/dayzer"
  to = "https://gridstordayzer.netlify.app/"
  status = 302
  force = true
```

**Phase 2: If seamless URL is critical, try proxy with minimal config**
```toml
[[redirects]]
  from = "/dayzer"
  to = "https://gridstordayzer.netlify.app/"
  status = 200
  force = true
```

**Phase 3: Add headers only if proxy works**
```toml
[[redirects]]
  from = "/dayzer"
  to = "https://gridstordayzer.netlify.app/"
  status = 200
  force = true
  headers = {X-Frame-Options = "SAMEORIGIN"}
```

## Next Steps
1. Deploy simplified configuration
2. Test with 302 redirect
3. If working, gradually add proxy features
4. Monitor Netlify deploy logs for errors
