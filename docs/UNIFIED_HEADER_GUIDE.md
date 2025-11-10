# Unified Header Sync Guide

**Purpose:** Keep the navigation header consistent across all GridStor applications

**Status:** ✅ Implementation Ready

---

## 🎯 The Challenge

You have multiple separate Netlify applications:
- **gst-homepage** (this repo) - Main landing page
- **gridstor** - Long-term outlook & revenue forecasts
- **gridstordayzer** - Short-term outlook & market operations
- **gst-fundamentals** - Market fundamentals

Each app has its own codebase and deployment, but they need to share **one unified header** that stays in sync.

---

## 💡 Solutions Overview

### Option 1: Shared NPM Package (Best for Long-term)

**Pros:**
- Version controlled
- Type-safe with TypeScript
- Easy to update across all apps
- Best practices for component sharing

**Cons:**
- Requires npm publishing setup
- Need to update package version and reinstall in each app

**Steps:**
1. Create a `@gridstor/shared-header` npm package
2. Publish to npm (or private registry)
3. Install in all applications
4. Import and use in each app's layout

### Option 2: CDN-Hosted Component (Quickest - Implemented)

**Pros:**
- ✅ Works immediately
- ✅ Single source of truth
- ✅ No npm setup needed
- ✅ Updates propagate instantly

**Cons:**
- Network dependency
- Not version controlled per app
- Requires JavaScript enabled

**Implementation:** See below for detailed steps

### Option 3: Git Submodules

**Pros:**
- Git-based versioning
- Shared codebase
- Can update selectively

**Cons:**
- Complex to manage
- Easy to create sync issues
- Requires git knowledge

---

## 🚀 Implemented Solution: CDN-Hosted Header

### Files Created

1. **`public/shared-header.js`** - JavaScript component
2. **`public/shared-header.css`** - Consistent styles

These files are hosted on `gst-homepage.netlify.app` and can be loaded by all apps.

---

## 📋 How to Use in Other Apps

### Step 1: In gridstor.netlify.app

Update your layout file (e.g., `src/layouts/Layout.astro` or equivalent):

```astro
---
// Your existing imports
---

<html>
<head>
  <!-- Your existing head content -->
  
  <!-- ADD: Shared header styles -->
  <link rel="stylesheet" href="https://gst-homepage.netlify.app/shared-header.css">
</head>
<body>
  <!-- REPLACE your existing header with this: -->
  <div id="gridstor-header"></div>
  
  <!-- Your page content -->
  <main>
    <slot />
  </main>
  
  <!-- ADD: Shared header script (before closing body tag) -->
  <script src="https://gst-homepage.netlify.app/shared-header.js"></script>
</body>
</html>
```

### Step 2: In gridstordayzer.netlify.app

Same approach as above. Replace your header with:

```html
<div id="gridstor-header"></div>
<script src="https://gst-homepage.netlify.app/shared-header.js"></script>
```

### Step 3: In gst-fundamentals.netlify.app

Same approach. Add the div and script:

```html
<div id="gridstor-header"></div>
<script src="https://gst-homepage.netlify.app/shared-header.js"></script>
```

---

## 🎨 Customizing the Navigation

### Updating Menu Items

Edit `public/shared-header.js` in the **gst-homepage** repo:

```javascript
const NAVIGATION_CONFIG = {
  logo: {
    text: 'GridStor Market Sight',
    homeUrl: '/',
    imageUrl: '/gridstor-logo.png'
  },
  menuItems: [
    {
      title: 'Long Term Outlook',
      items: [
        { label: 'Overview', href: '/long-term-outlook' },
        { label: 'Revenue Forecast Grapher', href: '/long-term-outlook/revenue-forecasts' },
        // Add more items here
      ]
    },
    // Add more dropdowns here
  ]
};
```

### After Making Changes

1. Commit and push to **gst-homepage** repo
2. Deploy to Netlify
3. All apps will automatically see the updated header (no changes needed in other apps!)

---

## 🔧 Advanced: Per-App Customization

If you need slight variations per app (e.g., hiding certain menu items), you can check the current URL:

```javascript
// In shared-header.js
const currentDomain = window.location.hostname;

if (currentDomain.includes('gridstordayzer')) {
  // Hide certain menu items for dayzer
  // Or show additional items
}
```

---

## 📱 Responsive Navigation

The current implementation hides navigation on mobile (< 1024px). To add a mobile menu:

1. Add hamburger button to `shared-header.js`
2. Add mobile menu styles to `shared-header.css`
3. Add toggle JavaScript

---

## 🔄 Syncing Checklist

When you want all headers to look the same:

- [ ] Update `src/layouts/Layout.astro` in **gst-homepage** (this repo)
- [ ] Update `public/shared-header.js` (for external apps using CDN)
- [ ] Add corresponding routes to `netlify.toml`
- [ ] Deploy **gst-homepage**
- [ ] Replace headers in other apps with `<div id="gridstor-header"></div>`
- [ ] Test navigation on all sites

---

## 🎯 Current Navigation Structure

```
GridStor Market Sight
│
├─ Long Term Outlook
│  ├─ Overview
│  ├─ Revenue Forecast Grapher
│  ├─ Curve Browser
│  ├─ Curve Schedule
│  ├─ Curve Tracker
│  └─ Market Fundamentals
│
├─ Curve Admin
│  ├─ Curve Uploader
│  ├─ Curve Inventory
│  └─ Manage Schedules
│
├─ Short Term Outlook
│  ├─ Overview
│  ├─ Market Operations
│  └─ Performance Tracking
│
├─ Forecast Admin
│  ├─ Manage Curves
│  ├─ Manage Schedules
│  └─ Documentation
│
├─ Risk/Structuring (simple link)
│
└─ Dev Ops
   ├─ Database Health
   └─ API Health
```

---

## 🐛 Troubleshooting

### Header Not Showing

1. Check browser console for errors
2. Verify the CDN URLs are accessible
3. Ensure `<div id="gridstor-header"></div>` exists

### Styles Look Wrong

1. Make sure `shared-header.css` is loaded
2. Check for CSS conflicts with existing styles
3. Verify Tailwind classes are available

### Links Not Working

1. Check `netlify.toml` routes in **gst-homepage**
2. Verify proxy rules are correct
3. Test links manually

### Header Loads Slowly

1. Consider adding a loading state
2. Add preconnect hints:
   ```html
   <link rel="preconnect" href="https://gst-homepage.netlify.app">
   ```

---

## 🔐 Security Considerations

- The shared header is loaded from `gst-homepage.netlify.app`
- If that site is compromised, all apps could be affected
- Consider:
  - Using Subresource Integrity (SRI) hashes
  - Hosting on a separate CDN domain
  - Version pinning the header script

Example with SRI:

```html
<script 
  src="https://gst-homepage.netlify.app/shared-header.js"
  integrity="sha384-YOUR-HASH-HERE"
  crossorigin="anonymous"
></script>
```

---

## 📦 Alternative: NPM Package Setup

If you want to go the npm route later:

### 1. Create Package

```bash
# In gst-homepage repo
mkdir packages/shared-header
cd packages/shared-header
npm init -y
```

### 2. Structure

```
packages/shared-header/
├── src/
│   ├── Header.tsx
│   └── types.ts
├── package.json
├── tsconfig.json
└── README.md
```

### 3. Publish

```bash
npm publish --access public
```

### 4. Use in Apps

```bash
npm install @gridstor/shared-header
```

```tsx
import { Header } from '@gridstor/shared-header';

<Header />
```

---

## 📊 Monitoring

Track header consistency:
- [ ] Set up visual regression testing
- [ ] Add header version indicator
- [ ] Monitor load times across apps

---

## 🎓 Best Practices

1. **Single Source of Truth:** Always update headers in `gst-homepage` first
2. **Test Before Deploy:** Check all navigation links work
3. **Version Comments:** Add comments when updating navigation
4. **Communicate Changes:** Let team know when navigation structure changes
5. **Document Routes:** Keep `netlify.toml` comments up to date

---

## 📝 Quick Reference

### Files to Edit

| What to Change | File to Edit | Repo |
|----------------|--------------|------|
| Navigation Items | `src/layouts/Layout.astro` | gst-homepage |
| Shared Header (CDN) | `public/shared-header.js` | gst-homepage |
| Shared Styles | `public/shared-header.css` | gst-homepage |
| Route Mappings | `netlify.toml` | gst-homepage |

### URLs for External Apps

```html
<!-- CSS -->
<link rel="stylesheet" href="https://gst-homepage.netlify.app/shared-header.css">

<!-- JavaScript -->
<script src="https://gst-homepage.netlify.app/shared-header.js"></script>

<!-- Container -->
<div id="gridstor-header"></div>
```

---

**Last Updated:** November 10, 2025  
**Version:** 1.0  
**Maintained By:** GridStor Development Team

