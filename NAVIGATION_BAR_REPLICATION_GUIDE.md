# 📋 GridStor Analytics Navigation Bar Replication Guide

**Objective:** Replicate the exact navigation bar styling and layout from the main GridStor Analytics site to ensure consistent branding across all sub-sites.

## 🎨 Visual Specifications

**Header Container:**
- Background color: `#2A2A2A` (dark gray)
- Text color: White
- Shadow: `shadow-sm`
- Full width with max-width container

**Layout Structure:**
```html
<header class="bg-[#2A2A2A] text-white shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <!-- Left side: Logo + Navigation -->
      <div class="flex items-center gap-8">
        <a href="/" class="flex items-center gap-3 text-xl font-bold hover:text-gray-300 transition-colors">
          <div class="bg-white p-1 flex items-center justify-center">
            <img src="/GST_logo.svg" alt="GridStor Analytics Logo" class="w-6 h-6" />
          </div>
          [SITE NAME HERE]
        </a>
        <nav class="hidden lg:flex items-center gap-8">
          <!-- Navigation items go here -->
        </nav>
      </div>
      
      <!-- Right side: Settings + User icons -->
      <div class="flex items-center gap-2 ml-4">
        <!-- Settings and user icons -->
      </div>
    </div>
  </div>
</header>
```

## 📝 Typography & Fonts

**Required Font Imports:**
```html
<!-- Add to <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<!-- GST Logo Favicon -->
<link rel="icon" type="image/svg+xml" href="/GST_logo.svg" />
```

**Font Specifications:**
- **Primary font:** Inter (400, 500, 600, 700 weights)
- **Monospace font:** JetBrains Mono (400, 500 weights)

## 📏 Font Sizes (CRITICAL - Match Exactly!)

**Logo Text:**
- **Class:** `text-xl font-bold`
- **Size:** 20px (1.25rem)
- **Weight:** 700 (bold)
- **Font:** Inter

**Navigation Links:**
- **Class:** `font-medium` (no text-size class)
- **Size:** 16px (1rem) - browser default
- **Weight:** 500 (medium)
- **Font:** Inter

## 🎯 Navigation Link Styling

**Active Links:**
```html
<a href="/page" class="text-white hover:text-gray-300 transition-colors font-medium">
  Page Name
</a>
```

**Active State (when on current page):**
```html
<a href="/page" class="text-white hover:text-gray-300 transition-colors font-medium text-gray-300">
  Page Name
</a>
```

**Disabled/Coming Soon Links:**
```html
<span class="text-gray-400 font-medium cursor-not-allowed">
  Coming Soon
</span>
```

## ⚙️ Right Side Icons

**Settings Icon:**
```html
<button class="p-2 hover:bg-gray-700 rounded-md transition-colors">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
</button>
```

**User Profile Icon:**
```html
<button class="p-2 hover:bg-gray-700 rounded-md transition-colors">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
</button>
```

## 🎨 Tailwind CSS Classes Reference

**Essential Classes Used:**
- `bg-[#2A2A2A]` - Exact background color
- `text-white` - White text
- `shadow-sm` - Subtle shadow
- `max-w-7xl mx-auto` - Centered container
- `px-4 sm:px-6 lg:px-8` - Responsive padding
- `flex justify-between items-center` - Layout
- `py-4` - Vertical padding
- `gap-8` - Spacing between items
- `hidden lg:flex` - Responsive visibility
- `hover:text-gray-300` - Hover effect
- `transition-colors` - Smooth transitions
- `text-xl font-bold` - Logo text styling (20px, 700 weight)
- `bg-white` - White square background for logo
- `p-1` - Padding inside white square (4px)
- `w-6 h-6` - Logo image size (24x24px)
- `gap-3` - Space between logo and text
- `font-medium` - Navigation link weight (16px default, 500 weight)

## 📱 Responsive Behavior

**Desktop (lg+):**
- Full navigation visible
- Logo and nav items on left
- Settings/user icons on right

**Mobile (<lg):**
- Navigation hidden (`hidden lg:flex`)
- Logo and icons still visible
- Implement mobile menu as needed for your site

## 🔧 Implementation Notes

1. **Replace `[SITE NAME HERE]`** with your specific site name (e.g., "Market Ops", "Fundamentals", etc.)
2. **Update navigation items** to match your site's specific pages
3. **Logo link** should point to your site's home page
4. **Copy GST_logo.svg** to your `public/` directory for the favicon
5. **Maintain exact spacing** with `gap-8` between elements
6. **Keep hover effects** and transitions for professional feel

## ✅ Testing Checklist

- [ ] Background color matches exactly (`#2A2A2A`)
- [ ] Fonts are Inter and JetBrains Mono
- [ ] GST logo favicon displays in browser tab
- [ ] GST logo displays in navigation bar next to site name
- [ ] Logo and text combination is clickable and styled correctly
- [ ] Navigation links have proper hover effects
- [ ] Settings and user icons display correctly
- [ ] Layout is responsive (navigation hides on mobile)
- [ ] Spacing and alignment match the main site

## 📋 Complete Example Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Site Name</title>
  
  <!-- Required Font Imports -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- GST Logo Favicon -->
  <link rel="icon" type="image/svg+xml" href="/GST_logo.svg" />
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <header class="bg-[#2A2A2A] text-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Left side: Logo + Navigation -->
        <div class="flex items-center gap-8">
          <a href="/" class="flex items-center gap-3 text-xl font-bold hover:text-gray-300 transition-colors">
            <div class="bg-white p-1 flex items-center justify-center">
              <img src="/GST_logo.svg" alt="GridStor Analytics Logo" class="w-6 h-6" />
            </div>
            Your Site Name
          </a>
          <nav class="hidden lg:flex items-center gap-8">
            <a href="/page1" class="text-white hover:text-gray-300 transition-colors font-medium">
              Page 1
            </a>
            <a href="/page2" class="text-white hover:text-gray-300 transition-colors font-medium">
              Page 2
            </a>
            <span class="text-gray-400 font-medium cursor-not-allowed">
              Coming Soon
            </span>
          </nav>
        </div>
        
        <!-- Right side: Settings + User icons -->
        <div class="flex items-center gap-2 ml-4">
          <button class="p-2 hover:bg-gray-700 rounded-md transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.5 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
          <button class="p-2 hover:bg-gray-700 rounded-md transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Your page content goes here -->
</body>
</html>
```

---

**Copy this entire file and implement it in your sub-site to achieve perfect navigation bar consistency across the GridStor Analytics platform!**
