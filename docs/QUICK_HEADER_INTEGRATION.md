# Quick Header Integration - Copy & Paste Guide

**Goal:** Replace your existing header with the unified GridStor header in 3 steps

---

## ✂️ Copy-Paste Templates

### For Astro Apps (gridstor, gst-fundamentals)

Replace your `<header>` tag with this:

```astro
---
// Your existing imports stay here
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Title</title>
  
  <!-- Your existing head content -->
  
  <!-- ✅ ADD: Unified Header CSS -->
  <link rel="stylesheet" href="https://gst-homepage.netlify.app/shared-header.css">
  
  <!-- Tailwind (if you have it) -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <!-- ✅ REPLACE your <header> tag with this single div: -->
  <div id="gridstor-header"></div>
  
  <!-- Your page content stays here -->
  <main>
    <slot />
  </main>
  
  <!-- ✅ ADD: Unified Header Script (before closing body tag) -->
  <script src="https://gst-homepage.netlify.app/shared-header.js"></script>
</body>
</html>
```

---

### For React Apps (if any)

```tsx
// In your Layout.tsx or App.tsx

import { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    // Load shared header script
    const script = document.createElement('script');
    script.src = 'https://gst-homepage.netlify.app/shared-header.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* Replace your header with this: */}
      <div id="gridstor-header"></div>
      
      {/* Your content */}
      <main>{children}</main>
    </>
  );
}
```

Add to your global CSS or `index.html`:

```html
<link rel="stylesheet" href="https://gst-homepage.netlify.app/shared-header.css">
```

---

### For Plain HTML (if any)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Title</title>
  
  <!-- ✅ ADD: Unified Header CSS -->
  <link rel="stylesheet" href="https://gst-homepage.netlify.app/shared-header.css">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <!-- ✅ REPLACE your header with this: -->
  <div id="gridstor-header"></div>
  
  <!-- Your content -->
  <main>
    <!-- Page content here -->
  </main>
  
  <!-- ✅ ADD: Unified Header Script -->
  <script src="https://gst-homepage.netlify.app/shared-header.js"></script>
</body>
</html>
```

---

## 🔍 Before & After Example

### ❌ Before (Your Current Code)

```astro
<header class="bg-[#2A2A2A] text-white">
  <div class="max-w-7xl mx-auto">
    <nav>
      <a href="/">Home</a>
      <a href="/revenue-forecasts">Revenue Forecasts</a>
      <!-- ... lots of navigation code ... -->
    </nav>
  </div>
</header>
```

### ✅ After (Unified Header)

```astro
<!-- Add to <head> -->
<link rel="stylesheet" href="https://gst-homepage.netlify.app/shared-header.css">

<!-- Replace header -->
<div id="gridstor-header"></div>

<!-- Add before </body> -->
<script src="https://gst-homepage.netlify.app/shared-header.js"></script>
```

---

## 🧪 Testing Checklist

After integration:

- [ ] Header appears on page load
- [ ] Logo shows correctly
- [ ] All dropdown menus work
- [ ] Hover effects work
- [ ] Links navigate correctly
- [ ] Mobile view looks good (if applicable)
- [ ] Dark mode works (if you support it)

---

## 🐛 If Something Goes Wrong

### Header Doesn't Appear

1. Open browser console (F12)
2. Check for errors
3. Verify the div exists: `document.getElementById('gridstor-header')`
4. Check if script loaded: Look in Network tab

### Styles Look Broken

1. Make sure you have Tailwind CSS available
2. Check for CSS conflicts
3. Try adding this to your CSS:
   ```css
   #gridstor-header * {
     all: revert;
   }
   ```

### Links Don't Work

The header links use absolute paths starting with `/`. Make sure your Netlify proxy rules are set up correctly in your app's `netlify.toml`.

---

## 📞 Need Help?

1. Check the main guide: `docs/UNIFIED_HEADER_GUIDE.md`
2. Review the reference implementation in `gst-homepage/src/layouts/Layout.astro`
3. Test the header locally at: `http://localhost:4321`

---

## 🚀 Quick Deploy Commands

After making changes:

```bash
# In gst-homepage repo
git add .
git commit -m "Update unified header navigation"
git push

# Netlify will auto-deploy
# Wait 2-3 minutes for deployment
# All apps will automatically get the new header!
```

---

**That's it!** Your app now uses the unified GridStor header. 🎉

