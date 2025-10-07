# API Routing Configuration Guide

## 🔴 Problem: Admin Upload Page 404 Error

### The Issue
When accessing `https://gridstoranalytics.com/admin/upload`, the page was getting a 404 error:
```
GET https://gridstoranalytics.com/api/curves/definitions 404 (Not Found)
Error: Unexpected token '<', "<!doctype "... is not valid JSON
```

**Why:** The API call was returning an HTML 404 page instead of JSON data.

## 🎯 Root Cause

### Before Fix ❌
```toml
/api/delivery* → gridstor ✅
/api/* → gridstordayzer (fallback) ❌

Result: /api/curves/definitions → gridstordayzer (doesn't exist!) → 404
```

Admin tools are part of the **gridstor** app, so their API endpoints should route to gridstor, not gridstordayzer!

## ✅ Solution

### After Fix ✅
Added specific routes for gridstor admin APIs:

```toml
# Gridstor-specific APIs (BEFORE general fallback)
/api/admin* → gridstor.netlify.app
/api/curves* → gridstor.netlify.app
/api/delivery* → gridstor.netlify.app
/api/delivery-request/* → gridstor.netlify.app

# General fallback (Market Ops)
/api/* → gridstordayzer.netlify.app
```

Now `/api/curves/definitions` correctly routes to gridstor! ✅

---

## 📋 Complete API Routing Map

### Gridstor APIs (Curve Viewer & Admin Tools)
```
/api/admin/*              → gridstor.netlify.app
/api/curves/*             → gridstor.netlify.app
/api/delivery/*           → gridstor.netlify.app
/api/delivery-request/*   → gridstor.netlify.app
```

**Used by:**
- Admin tools (upload, management, system ops)
- Curve viewer (data display, delivery requests)
- Data management features

### Market Ops APIs
```
/api/* (fallback)         → gridstordayzer.netlify.app
```

**Used by:**
- Market operations dashboard
- Performance analytics
- Real-time market data

### Fundamentals APIs
Currently no specific API routes defined. If needed, add:
```toml
[[redirects]]
  from = "/api/fundamentals*"
  to = "https://gst-fundamentals.netlify.app/api/fundamentals:splat"
  status = 200
  force = true
```

---

## 🔍 Debugging API Issues

### Step 1: Check Browser Console
```javascript
// Look for 404 errors
GET /api/some-endpoint 404 (Not Found)

// Check if HTML returned instead of JSON
Error: Unexpected token '<', "<!doctype "... is not valid JSON
```

### Step 2: Identify Which App Needs It
- `/admin/*` pages → Gridstor APIs
- `/curve-viewer/*` → Gridstor APIs
- `/market-ops/*` → Gridstordayzer APIs
- `/fundamentals/*` → Fundamentals APIs

### Step 3: Check Current Routing
Look at `netlify.toml` API section (lines 111-140):
- Does the endpoint match an existing pattern?
- Is it falling through to the wrong app?

### Step 4: Add Specific Route
If needed, add BEFORE the general `/api/*` fallback:
```toml
[[redirects]]
  from = "/api/your-endpoint*"
  to = "https://[correct-origin]/api/your-endpoint:splat"
  status = 200
  force = true
```

---

## 🎯 Key Rules

### Rule 1: Specific Before General
```toml
# ✅ CORRECT ORDER
/api/curves* → gridstor (specific)
/api/admin* → gridstor (specific)
/api/* → gridstordayzer (general fallback)

# ❌ WRONG ORDER
/api/* → gridstordayzer (general - catches everything!)
/api/curves* → gridstor (never reached!)
```

### Rule 2: Match the App
Route API calls to the same app that serves the page:
- Admin pages → Gridstor APIs
- Market ops pages → Gridstordayzer APIs
- Fundamentals pages → Fundamentals APIs

### Rule 3: Use `force = true` for Specific Routes
Specific API routes should use `force = true` to ensure they're always proxied:
```toml
from = "/api/curves*"
force = true  # ✅ Always proxy to gridstor
```

General fallback should use `force = false`:
```toml
from = "/api/*"
force = false  # ✅ Check local /dist first
```

---

## 🧪 Testing Checklist

After adding new API routes:

### Test Admin Tools
```
✅ Visit: https://gridstoranalytics.com/admin/upload
✅ Open browser console (F12)
✅ Check: No 404 errors for /api/curves/*
✅ Check: Data loads correctly
✅ Test: Upload functionality works
```

### Test Curve Viewer
```
✅ Visit: https://gridstoranalytics.com/curve-viewer
✅ Check: No API errors
✅ Check: Delivery requests work
✅ Test: All interactive features
```

### Test Market Ops
```
✅ Visit: https://gridstoranalytics.com/market-ops
✅ Check: Performance data loads
✅ Check: Charts display correctly
✅ Test: All market ops APIs work
```

---

## 📊 Common Admin API Endpoints

Based on the admin tools, these endpoints should route to gridstor:

### Data Management
```
GET  /api/curves/definitions    - Get curve definitions
POST /api/curves/upload         - Upload new curves
GET  /api/curves/inventory      - Get curve inventory
PUT  /api/curves/:id            - Update curve data
DELETE /api/curves/:id          - Delete curve
```

### System Operations
```
GET  /api/admin/health          - System health check
POST /api/admin/cache/clear     - Clear cache
GET  /api/admin/logs            - View system logs
GET  /api/admin/analytics       - Get analytics data
```

### Delivery Management
```
GET  /api/delivery-requests     - List delivery requests
POST /api/delivery-requests     - Create delivery request
GET  /api/delivery/:id          - Get delivery details
PUT  /api/delivery/:id          - Update delivery
```

All of these now route correctly to gridstor.netlify.app! ✅

---

## 🚀 Deploy & Test

```bash
git add .
git commit -m "Fix admin API routing - add curves and admin endpoints to gridstor"
git push origin main
```

### After Deployment:
1. Clear browser cache
2. Visit: `https://gridstoranalytics.com/admin/upload`
3. Open browser console (F12 → Console tab)
4. Check for any 404 errors
5. Test upload functionality

**The `/api/curves/definitions` endpoint should now return JSON data instead of 404!** ✅

---

## 💡 Adding More API Routes

If you encounter more API 404 errors:

1. **Identify the endpoint** from browser console
2. **Determine the app** that needs it
3. **Add specific route** in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/api/[your-endpoint]*"
     to = "https://[correct-app]/api/[your-endpoint]:splat"
     status = 200
     force = true
   ```
4. **Place BEFORE** the general `/api/*` fallback
5. **Deploy and test**

---

## 📝 Current API Architecture

```
gridstoranalytics.com API Routing:

┌─────────────────────────────────────┐
│  /api/admin/*         → gridstor    │ Admin operations
│  /api/curves/*        → gridstor    │ Curve data
│  /api/delivery/*      → gridstor    │ Delivery mgmt
│  /api/delivery-request/* → gridstor │ Delivery requests
├─────────────────────────────────────┤
│  /api/*              → gridstordayzer│ Market Ops (fallback)
└─────────────────────────────────────┘
```

Clean, organized, and functional! 🎉
