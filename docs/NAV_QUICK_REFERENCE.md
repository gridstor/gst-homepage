# Navigation Quick Reference Card

**File to Edit:** `gst-homepage/public/shared-header.js`  
**Deployment:** Push to gst-homepage → Auto-syncs to all repos

---

## 🎯 **Common Operations**

### **Add Simple Link**
```javascript
{
  id: 'my-page',
  title: 'My Page',
  type: 'link',
  href: '/my-page'
}
```

### **Add Dropdown with Items**
```javascript
{
  id: 'my-section',
  title: 'My Section',
  type: 'dropdown',
  items: [
    {
      label: 'Page 1',
      href: '/section/page1',
      description: 'Description here',
      type: 'link'
    }
  ]
}
```

### **Add Nested Submenu**
```javascript
{
  label: 'Parent Item',
  description: 'Has sub-items',
  type: 'submenu',
  subItems: [
    { label: 'Child 1', href: '/path1', description: 'Desc' },
    { label: 'Child 2', href: '/path2', description: 'Desc' }
  ]
}
```

---

## 🔄 **Sync Workflow**

```bash
# 1. Edit shared-header.js
nano gst-homepage/public/shared-header.js

# 2. Commit & Push
git add public/shared-header.js
git commit -m "Nav: Add XYZ"
git push

# 3. All repos auto-update! ✅
```

---

## ⚡ **Force Browser Refresh**
- **Windows:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

---

## 🏗️ **Current Structure**

```
Long-term outlook (dropdown)
  ├── Revenue Forecast (submenu) →
  │     ├── Revenue Forecast Grapher
  │     ├── Curve Browser
  │     ├── Curve Uploader
  │     ├── Curve Inventory
  │     └── Curve Schedule
  └── Futures Markets (link)

Short-term outlook (link)

Risk and structuring (link)
```

---

## 📍 **Integration Code**

**In other repos' HTML:**
```html
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://gst-homepage.netlify.app/shared-header.js"></script>
</head>
<body>
  <div id="gridstor-header"></div>
  <!-- Your content here -->
</body>
```

---

## 🎨 **Logo**
Lightning bolt SVG (cyan #06B6D4) is embedded in config.  
To change logo, edit `NAVIGATION_CONFIG.logo.svg`.

---

**Need More Help?** → See [NAVIGATION_SYNC_GUIDE.md](./NAVIGATION_SYNC_GUIDE.md)

