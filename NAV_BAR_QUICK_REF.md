# Navigation Bar - Quick Reference Card

## ⚡ **AT A GLANCE**

```
┌─────────────────────────────────────────────────────────────────┐
│  [⚡32px] GridStor Market Sight  │  Links (16px, gap:32px)  │⚙️ │
│  #06B6D4  [20px bold, white]    │  [medium weight, white] │[40]│
└─────────────────────────────────────────────────────────────────┘
     12px gap    32px gap              32px between each      Settings
```

---

## 🎨 **COPY-PASTE VALUES**

### Colors
```css
Background:    #2A2A2A
Text:          #FFFFFF
Hover:         #D1D5DB
Logo Cyan:     #06B6D4
Settings Hover: #374151
Shadow:        0 1px 3px rgba(0,0,0,0.1)
```

### Sizes
```css
Header Height:   72px
Logo Icon:       32 × 32px
Logo Text:       20px (text-xl)
Nav Links:       16px (text-base)
Settings Button: 40 × 40px
Settings Icon:   20 × 20px
```

### Spacing
```css
Vertical Padding:    16px (py-4)
Horizontal Padding:  16/24/32px (responsive)
Logo Gap:            12px (gap-3)
Nav Section Gap:     32px (gap-8)
Nav Links Gap:       32px (gap-8)
Right Margin:        16px (ml-4)
```

### Typography
```css
Logo: Inter Bold, 20px, white
Links: Inter Medium, 16px, white
Line-height: 1.5
Letter-spacing: -0.01em (logo), 0 (links)
```

---

## 💻 **COMPLETE CODE**

```html
<header class="bg-[#2A2A2A] text-white shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center gap-8">
        <a href="/" class="flex items-center gap-3 text-xl font-bold hover:text-gray-300 transition-colors">
          <img src="/lightning-bolt.svg" alt="GridStor Market Sight Logo" class="w-8 h-8" />
          GridStor Market Sight
        </a>
        <nav class="hidden lg:flex items-center gap-8">
          <a href="/long-term-outlook" class="text-white hover:text-gray-300 transition-colors font-medium">
            Long Term Outlook
          </a>
          <a href="/short-term-outlook" class="text-white hover:text-gray-300 transition-colors font-medium">
            Short Term Outlook
          </a>
          <a href="/risk-structuring" class="text-white hover:text-gray-300 transition-colors font-medium">
            Risk/Structuring
          </a>
        </nav>
      </div>
      <div class="flex items-center gap-2 ml-4">
        <button class="p-2 hover:bg-gray-700 rounded-md transition-colors" title="Settings">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>
```

---

## 🎯 **FIGMA QUICK SETUP**

### 1. Create Frame
```
Name: NavigationBar
Width: 1440px (or fill parent)
Height: 72px
Fill: #2A2A2A
Shadow: 0 1px 3px rgba(0,0,0,0.1)
```

### 2. Add Auto-Layout
```
Direction: Horizontal
Justify: Space between
Align: Center
Padding: 16px vertical, 32px horizontal
Max-width: 1280px (add constraint)
Horizontal centering: Center in parent
```

### 3. Left Section
```
Auto-layout horizontal
Gap: 32px
Align: Center

Contents:
  - Logo group (horizontal, gap: 12px)
    - Lightning icon (32×32, cyan)
    - Text (20px bold)
  - Nav links (horizontal, gap: 32px)
    - Link 1 (16px medium)
    - Link 2 (16px medium)
    - Link 3 (16px medium)
```

### 4. Right Section
```
Auto-layout horizontal
Gap: 8px
Align: Center

Contents:
  - Settings button (40×40)
    - Icon (20×20)
```

---

## 📏 **MEASUREMENTS DIAGRAM**

```
←──────────────────── 1280px max-width ────────────────────→

├16px─┤                                              ├16px─┤
       ┌─────────────────────────────────────────────┐
       │  [⚡] GridStor Market Sight                │
       │  ↑32↑  ↑─12─↑ ↑─────20px text────↑        │
       │                                             │
       │        ├32px gap┤                           │
       │                                             │
       │        Long Term │ Short Term │ Risk        │
       │        ↑─16px──↑   ↑─16px──↑   ↑16px↑     │
       │        ├─32px──┤   ├─32px──┤              │
       │                                      [⚙40px]│
       └─────────────────────────────────────────────┘
       
Total: 72px height (16px + 40px content + 16px)
```

---

## 🎨 **COLOR SWATCHES**

```
Header BG:     ███ #2A2A2A
Text Default:  ███ #FFFFFF
Text Hover:    ███ #D1D5DB
Logo Cyan:     ███ #06B6D4
Icon Hover BG: ███ #374151
```

---

## ⚡ **LOGO SPECIFICATIONS**

### Lightning Bolt SVG
```svg
<svg width="32" height="32" viewBox="0 0 100 100">
  <path d="M55 10L30 55H50L45 90L70 45H50L55 10Z" 
        fill="#06B6D4" 
        stroke="#06B6D4" 
        stroke-width="2"/>
</svg>
```

**File:** `/lightning-bolt.svg`  
**Size:** 32 × 32px in header  
**Color:** Cyan (#06B6D4)  
**No background needed**

---

## 🔗 **NAVIGATION LINKS**

### Link Template
```html
<a href="[URL]" 
   class="text-white hover:text-gray-300 transition-colors font-medium">
  [Link Text]
</a>
```

### Current State (Active Page)
```html
<a href="[URL]" 
   class="text-white hover:text-gray-300 transition-colors font-medium text-gray-300">
  [Link Text]
</a>
```

**Note:** Active = text-gray-300 class added

---

## ⚙️ **SETTINGS BUTTON**

### Button Specs
```html
<button class="p-2 hover:bg-gray-700 rounded-md transition-colors" 
        title="Settings" 
        aria-label="Settings">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <!-- Settings icon paths -->
  </svg>
</button>
```

**Box:** 40×40px (8px padding + 24px icon area)  
**Icon:** 20×20px  
**Hover:** Gray-700 background  
**Radius:** 6px

---

## 📱 **RESPONSIVE BEHAVIOR**

### Breakpoints
```
< 1024px:  Nav links hidden (hamburger menu area)
>= 1024px: Full navigation visible
```

### Padding by Screen Size
```
Mobile (< 640px):    px-4  (16px)
Tablet (640-1024px): sm:px-6 (24px)
Desktop (>= 1024px): lg:px-8 (32px)
```

---

## ✅ **IMPLEMENTATION CHECKLIST**

Quick validation:
```
□ Background #2A2A2A
□ Height 72px total
□ Logo 32px cyan lightning
□ Logo text 20px bold white
□ 32px gap after logo
□ Nav links 16px medium white
□ 32px gaps between links
□ Settings 40×40px button
□ Shadow 0 1px 3px
□ Max-width 1280px
□ Centered container
□ All hovers gray-300
□ 200ms transitions
```

---

**Use this as your single source of truth for the navigation bar!** ⚡

**Full details in:** `NAVIGATION_BAR_SPEC.md`
