# GridStor Market Sight - Navigation Synchronization Guide

**Last Updated:** November 10, 2025  
**Maintained By:** GridStor Development Team

---

## 📋 **Overview**

This guide explains how to keep navigation headers **consistent across all GridStor projects** using a centralized navigation system.

### **The Problem**
- Multiple repositories (gst-forecast, gst-homepage, gst-dayzer, etc.)
- Each proxied through gst-homepage
- Need consistent navigation across all pages
- Changes to navigation must sync everywhere

### **The Solution**
**Centralized Navigation Component** served from gst-homepage that all repos can use.

---

## 🎯 **Quick Start**

### **For New Repositories**

Add this to your HTML `<head>`:
```html
<!-- Include Tailwind CSS if not already present -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- GridStor Unified Header -->
<script src="https://gst-homepage.netlify.app/shared-header.js"></script>
```

Add this in your `<body>` where you want the header:
```html
<div id="gridstor-header"></div>
```

**That's it!** The navigation will automatically render.

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────┐
│  gst-homepage (Master)                                   │
│  ├── public/shared-header.js  ← SINGLE SOURCE OF TRUTH  │
│  └── Served at: gst-homepage.netlify.app/shared-header.js│
└─────────────────────────────────────────────────────────┘
                        ↓ (loaded by)
        ┌───────────────┴───────────────┐
        ↓                               ↓
┌──────────────────┐          ┌──────────────────┐
│  gst-forecast    │          │  gst-dayzer      │
│  (Long-term)     │          │  (Short-term)    │
│                  │          │                  │
│  <script src="   │          │  <script src="   │
│   .../shared-    │          │   .../shared-    │
│   header.js">    │          │   header.js">    │
└──────────────────┘          └──────────────────┘
```

---

## 📝 **How to Update Navigation**

### **Step 1: Edit the Configuration**

Open `gst-homepage/public/shared-header.js` and find the `NAVIGATION_CONFIG` object:

```javascript
const NAVIGATION_CONFIG = {
  logo: { ... },
  menuItems: [
    {
      id: 'long-term-outlook',
      title: 'Long-term outlook',
      type: 'dropdown',
      items: [ ... ]
    }
  ]
};
```

### **Step 2: Add a New Top-Level Navigation Item**

```javascript
menuItems: [
  // Existing items...
  
  // Add new top-level item
  {
    id: 'new-section',           // Unique ID
    title: 'New Section',        // Display text
    type: 'link',                // 'link' or 'dropdown'
    href: '/new-section'         // URL
  }
]
```

### **Step 3: Convert Link to Dropdown**

```javascript
{
  id: 'short-term-outlook',
  title: 'Short-term outlook',
  type: 'dropdown',  // Changed from 'link' to 'dropdown'
  items: [
    {
      label: 'Overview',
      href: '/short-term-outlook',
      description: 'Dashboard and summary',
      type: 'link'
    },
    {
      label: 'Market Operations',
      href: '/short-term-outlook/market-ops',
      description: 'Real-time market data',
      type: 'link'
    }
  ]
}
```

### **Step 4: Add Nested Submenu**

```javascript
items: [
  {
    id: 'forecasting',
    label: 'Forecasting',
    description: 'Forecast tools',
    type: 'submenu',  // Creates nested dropdown
    subItems: [
      {
        label: 'Revenue Forecasts',
        href: '/forecasts/revenue',
        description: 'Revenue projections'
      },
      {
        label: 'Load Forecasts',
        href: '/forecasts/load',
        description: 'Load predictions'
      }
    ]
  }
]
```

### **Step 5: Deploy Changes**

```bash
# In gst-homepage repository
git add public/shared-header.js
git commit -m "Update navigation: Add XYZ section"
git push

# Deploy to Netlify
# (Automatic if you have continuous deployment)
```

**Changes are immediately available to all repos!** 🎉

---

## 🔄 **Syncing Process**

### **Automatic Sync** (Recommended)
All repos that use `<script src="https://gst-homepage.netlify.app/shared-header.js">` automatically get updates when gst-homepage deploys.

**Pros:**
- ✅ Instant sync across all sites
- ✅ No manual work required
- ✅ Single source of truth

**Cons:**
- ⚠️ Breaking changes affect all sites immediately
- ⚠️ Requires cache busting for updates

### **Manual Sync** (For repos with local Layout.astro)
If a repo has its own `src/layouts/Layout.astro` with embedded navigation:

1. **Copy the navigation structure** from `shared-header.js` `NAVIGATION_CONFIG`
2. **Update Layout.astro** to match the structure
3. **Test locally**
4. **Deploy**

---

## 📚 **Common Tasks**

### **Task 1: Add a New Page Under Existing Dropdown**

**Example:** Add "Curve Tracker" under Revenue Forecast

```javascript
// In shared-header.js, find the Revenue Forecast submenu:
{
  id: 'revenue-forecast',
  label: 'Revenue Forecast',
  type: 'submenu',
  subItems: [
    // ... existing items ...
    {
      label: 'Curve Tracker',     // ← Add this
      href: '/curve-tracker',
      description: 'Track curve updates'
    }
  ]
}
```

### **Task 2: Remove a Navigation Item**

Simply delete the item from the `menuItems` array or `items` array.

### **Task 3: Reorder Navigation Items**

Move items up/down in the array. The order in the array = order on screen.

### **Task 4: Change a URL**

Update the `href` property:
```javascript
{
  label: 'Market Ops',
  href: '/short-term-outlook/operations',  // Changed
  description: 'Real-time operations'
}
```

---

## 🚨 **Important Notes**

### **Cache Busting**
Browsers may cache `shared-header.js`. To force refresh:

**Option 1: Version Query Parameter**
```html
<script src="https://gst-homepage.netlify.app/shared-header.js?v=2"></script>
```

**Option 2: Clear Browser Cache**
```
Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### **Testing Changes**
Before deploying navigation changes:

1. **Test locally** in gst-homepage
2. **Check all dropdown behaviors**
3. **Verify mobile responsiveness** (if applicable)
4. **Test with other repos locally** if possible

### **Breaking Changes**
If making major structural changes:
1. Create a new version: `shared-header-v2.js`
2. Update one repo at a time
3. Once all migrated, deprecate old version

---

## 📋 **Navigation Configuration Reference**

### **Top-Level Item Properties**
```javascript
{
  id: string,           // Required: Unique identifier
  title: string,        // Required: Display text
  type: 'link' | 'dropdown',  // Required
  href: string,         // Required if type='link'
  items: array          // Required if type='dropdown'
}
```

### **Dropdown Item Properties**
```javascript
{
  id: string,           // Optional: For debugging
  label: string,        // Required: Display text
  description: string,  // Optional: Subtitle text
  type: 'link' | 'submenu',  // Required
  href: string,         // Required if type='link'
  subItems: array       // Required if type='submenu'
}
```

### **Submenu Item Properties**
```javascript
{
  label: string,        // Required: Display text
  href: string,         // Required: Link URL
  description: string   // Optional: Subtitle text
}
```

---

## 🛠️ **Troubleshooting**

### **Navigation Not Showing**
1. Check `<div id="gridstor-header"></div>` exists in HTML
2. Check script loads successfully (Network tab)
3. Check JavaScript console for errors
4. Verify Tailwind CSS is loaded

### **Dropdown Not Working**
1. Check browser console for CSS errors
2. Verify styles are injected (Inspect → Styles → look for `gridstor-header-styles`)
3. Clear browser cache

### **Navigation Out of Date**
1. Hard refresh (Ctrl+Shift+R)
2. Check deployed version of `shared-header.js`
3. Verify you're not using a cached version

---

## 📞 **Support**

If you need help with navigation:
1. Check this guide first
2. Review `shared-header.js` comments
3. Ask in team Slack channel
4. Contact frontend lead

---

## 🔗 **Related Documentation**

- [Design System - Navigation Spec](./design-system/NAVIGATION_BAR_SPEC.md)
- [Unified Header Guide](./UNIFIED_HEADER_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## ✅ **Checklist for Adding New Pages**

- [ ] Decide where it belongs in navigation hierarchy
- [ ] Update `NAVIGATION_CONFIG` in `shared-header.js`
- [ ] Test locally
- [ ] Commit and deploy to gst-homepage
- [ ] Verify it appears in all repos (hard refresh)
- [ ] Update this documentation if needed

---

**Remember:** One change to `shared-header.js` = Navigation updates everywhere! 🚀

