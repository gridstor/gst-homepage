# Admin Tools Access Configuration

## ✅ Admin Tools Now Available

The admin tools from `https://gridstor.netlify.app/admin/` are now proxied and accessible at:

```
https://gridstoranalytics.com/admin/
```

## 📝 What Was Added

### Netlify Configuration
Added two redirect rules to `netlify.toml`:

```toml
# Admin Tools proxy configuration (part of gridstor app)
[[redirects]]
  from = "/admin"
  to = "https://gridstor.netlify.app/admin/"
  status = 200
  force = true

[[redirects]]
  from = "/admin/*"
  to = "https://gridstor.netlify.app/admin/:splat"
  status = 200
  force = true
```

This seamlessly proxies all admin routes to the gridstor app.

## 🔐 Access Methods

### Direct URL Access
```
https://gridstoranalytics.com/admin/
```

### From Settings Menu (Recommended)
You can add an admin link to the settings dropdown in the navigation:

```astro
<!-- In src/layouts/Layout.astro -->
<button class="p-2 hover:bg-gray-700 rounded-md transition-colors">
  <a href="/admin">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
      </path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
      </path>
    </svg>
  </a>
</button>
```

## 📊 Admin Features Available

Based on the gridstor admin page, these features are now accessible:

### Data Management
- Upload New Curves
- Manage Inventory
- 📊 Curve Inventory
- 📅 Curve Schedule
- 📋 Activity Logs
- 🔍 API Health Check

### Documentation & Help
- 📚 Database Schema Docs
- 📅 Curve Schedule Workflow

### System Operations
- Check Database Health
- Clear Cache

### Analytics & Reports
- Generate Usage Report
- Export Data

### API Management
- 🔍 API Health Dashboard
- View API Logs

### Quick Actions
- Go to Curve Viewer
- Go to Curve Tracker

## 🔒 Security Considerations

### Password Protection
Admin tools inherit the same password protection as the rest of your GridStor sites:
- If Netlify password protection is enabled, it applies to `/admin` too
- Consider additional auth for admin-only access

### Recommended: Add Role-Based Access
For production, consider:
1. Custom authentication middleware
2. Admin-only roles/permissions
3. IP whitelisting for admin routes
4. Audit logging for admin actions

## 🚀 Deploy & Test

```bash
git add .
git commit -m "Add admin tools proxy configuration"
git push origin main
```

### After Deployment Test:
```
✅ Visit: https://gridstoranalytics.com/admin/
✅ Verify: Admin dashboard loads
✅ Check: All admin features accessible
✅ Test: Navigation between admin pages
```

## 🔗 Related Routes

All these gridstor routes are now accessible:

| Original | Proxied To |
|----------|------------|
| `gridstor.netlify.app/curve-viewer/` | `gridstoranalytics.com/curve-viewer` |
| `gridstor.netlify.app/admin/` | `gridstoranalytics.com/admin` |

## 🎯 Optional: Add to Homepage

You could add an admin tools card to your homepage Analytics Tools section:

```astro
<!-- Admin Tools Card -->
<div class="bg-white rounded-lg shadow-sm p-8 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
  <div class="flex items-center gap-3 mb-4">
    <div class="text-purple-600">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
        </path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
        </path>
      </svg>
    </div>
    <h3 class="text-xl font-semibold text-gray-800">Admin Tools</h3>
  </div>
  <p class="text-gray-600 mb-6 leading-relaxed">
    System administration, data management, and analytics tools for managing curve data and system operations.
  </p>
  <ul class="space-y-2 mb-6">
    <li class="flex items-start gap-2 text-gray-600">
      <span class="text-purple-600 mt-1">•</span>
      Upload and manage curve data
    </li>
    <li class="flex items-start gap-2 text-gray-600">
      <span class="text-purple-600 mt-1">•</span>
      API health monitoring
    </li>
    <li class="flex items-start gap-2 text-gray-600">
      <span class="text-purple-600 mt-1">•</span>
      System analytics and reports
    </li>
  </ul>
  <a href="/admin" class="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium">
    Launch Admin Tools
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </a>
</div>
```

## 📊 Current Proxy Routes Summary

```
Main Hub:
- / → gridstoranalytics.com (this repo)

Gridstor App:
- /curve-viewer → gridstor.netlify.app/curve-viewer
- /admin → gridstor.netlify.app/admin

Market Ops:
- /market-ops → gridstordayzer.netlify.app/market-ops

Fundamentals:
- /fundamentals → gst-fundamentals.netlify.app/fundamentals
```

All seamlessly integrated under one domain! 🎉
