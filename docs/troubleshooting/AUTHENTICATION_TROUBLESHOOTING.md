# Authentication Troubleshooting Guide

## Current Issue: 401 Error on Dayzer Site

### Problem Description
Getting a 401 Unauthorized error when navigating from the main GridStor Analytics site to the Dayzer sub-site.

### Potential Causes
1. **Password Protection Mismatch**: Sub-sites have different authentication settings
2. **Proxy Authentication**: Status 200 proxying doesn't pass authentication headers properly
3. **Cross-Site Authentication**: Browser security policies blocking authentication

### Solutions Implemented

#### 1. Changed to 302 Redirects
- **Before**: Using status 200 (proxy)
- **After**: Using status 302 (redirect)
- **Why**: 302 redirects let the browser handle authentication directly with the target site

#### 2. Added _headers File
Created `public/_headers` for unified authentication (if using Basic Auth).

### Testing Steps

#### Option A: Test 302 Redirects (Current Setup)
1. Deploy the changes
2. Click "Launch Dayzer" button
3. Should redirect to the actual Dayzer URL where you can authenticate
4. User will see the actual Netlify URL in browser

#### Option B: Revert to Proxy with Authentication
If you prefer seamless URLs (status 200), you need to:

1. **Coordinate Authentication** across all sites:
   ```
   Main Site: gridstoranalytics.com (password: X)
   Dayzer: gridstordayzer.netlify.app (password: X)
   Curve Viewer: gridstor.netlify.app (password: X)
   ```

2. **Use Same Environment Variables**:
   ```
   SITE_PASSWORD=same_password_for_all_sites
   ```

3. **Configure Basic Auth Headers** in `_headers`:
   ```
   /dayzer/*
     Basic-Auth: username:password
   /curve-viewer/*
     Basic-Auth: username:password
   ```

### Current Configuration Status

✅ **Curve Viewer**: Fixed redirect URL
✅ **Dayzer**: Fixed redirect URL  
✅ **Security Headers**: Added frame protection
🔄 **Authentication**: Changed to 302 redirects for compatibility

### Next Steps

1. **Deploy and Test**: Try the 302 redirect approach first
2. **If 302 Works**: Users will see actual URLs but authentication will work
3. **If You Need Seamless URLs**: Coordinate password settings across all sites

### Authentication Flow Options

#### Current (302 Redirect):
```
User clicks "Launch Dayzer" 
→ Redirects to gridstordayzer.netlify.app 
→ User authenticates directly with Dayzer site
→ User sees actual Dayzer URL
```

#### Alternative (Proxy with Unified Auth):
```
User clicks "Launch Dayzer"
→ Stays on gridstoranalytics.com/dayzer
→ Main site passes authentication to Dayzer
→ User sees seamless URL
```

### Testing Commands

Test the sites directly:
- Main site: https://gridstoranalytics.com
- Dayzer direct: https://gridstordayzer.netlify.app
- Curve Viewer direct: https://gridstor.netlify.app/curve-viewer

### Contact Information

If issues persist:
1. Check Netlify deployment logs
2. Test in different browsers
3. Verify authentication settings in Netlify dashboard
4. Consider unified authentication setup
