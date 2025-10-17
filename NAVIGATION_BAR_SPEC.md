# GridStor Market Sight - Navigation Bar Design Specification

**Component:** Global Navigation Header  
**Version:** 2.0  
**Date:** October 2025  
**Status:** ✅ Production Standard

---

## 📐 **COMPONENT ANATOMY**

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [max-width: 1280px, centered, padding: 0 16/24/32px]                   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  [⚡] GridStor Market Sight  │  Long Term │ Short Term │ Risk  │⚙️ │  │
│  │  [Logo + Text - 32px tall]   │  [Navigation Links - 16px]    │[24]│  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
    ↑                                ↑                              ↑
  Logo Area                    Navigation Links              Settings Icon
```

---

## 📏 **DIMENSIONS & SPACING**

### Header Container

```css
Height: 72px (including padding)
Background: #2A2A2A (near-black)
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Position: Fixed top OR Static (depending on page)
Z-index: 50 (if fixed)
```

### Content Wrapper

```css
Max-width: 1280px (max-w-7xl)
Horizontal Padding: 
  - Mobile: 16px (px-4)
  - Tablet: 24px (sm:px-6)
  - Desktop: 32px (lg:px-8)
Vertical Padding: 16px (py-4)
Display: Flex
Justify: space-between
Align: items-center
```

### Internal Spacing

| Element | Gap/Margin | Purpose |
|---------|------------|---------|
| Left section (logo + nav) | 32px gap | Separation between logo and nav links |
| Logo icon → text | 12px gap | Tight association |
| Navigation links | 32px gap | Comfortable click targets |
| Right section margin | 16px left | Separation from nav |

---

## 🎨 **COLOR PALETTE**

### Background

```css
Primary: #2A2A2A (near-black)
/* HSL: 0, 0%, 16% */
/* RGB: 42, 42, 42 */
```

### Text Colors

```css
Default (links): #FFFFFF (pure white)
Hover: #D1D5DB (gray-300)
Active/Current: #D1D5DB (gray-300)
Disabled: #9CA3AF (gray-400)
```

### Logo

```css
Lightning Bolt: #06B6D4 (cyan-500)
/* HSL: 187, 95%, 43% */
/* RGB: 6, 182, 212 */
```

### Settings Icon

```css
Icon: #FFFFFF (white)
Hover Background: #374151 (gray-700)
```

---

## 🔤 **TYPOGRAPHY**

### Logo Text

```
Font: Inter
Size: 20px (text-xl)
Weight: Bold (700)
Color: White (#FFFFFF)
Line-height: 1.2
Letter-spacing: -0.01em (tight)
```

**HTML:**
```html
<span class="text-xl font-bold">GridStor Market Sight</span>
```

### Navigation Links

```
Font: Inter
Size: 16px (text-base)
Weight: Medium (500)
Color: White (#FFFFFF)
Hover: Gray-300 (#D1D5DB)
Active: Gray-300 (#D1D5DB)
Line-height: 1.5
Letter-spacing: 0
```

**HTML:**
```html
<a class="text-white hover:text-gray-300 transition-colors font-medium">
  Long Term Outlook
</a>
```

---

## ⚡ **LOGO SPECIFICATIONS**

### Lightning Bolt Icon

**Dimensions:**
```
Width: 32px (w-8)
Height: 32px (h-8)
Viewbox: 0 0 100 100
Color: #06B6D4 (cyan-500)
```

**SVG Path:**
```svg
<path d="M55 10L30 55H50L45 90L70 45H50L55 10Z" 
      fill="#06B6D4" 
      stroke="#06B6D4" 
      stroke-width="2" 
      stroke-linejoin="round"/>
```

**Visual Properties:**
- Shape: Geometric lightning bolt
- Style: Angular, modern, energetic
- Fill: Solid cyan
- Stroke: Cyan (2px for definition)
- No background container needed

### Logo Group (Icon + Text)

```
Display: Flex
Align: items-center
Gap: 12px
Padding: 0
Hover: Entire group changes to gray-300
Transition: 200ms colors
Cursor: pointer
```

**Link Wrapper:**
```html
<a href="/" class="flex items-center gap-3 text-xl font-bold hover:text-gray-300 transition-colors">
  <img src="/lightning-bolt.svg" alt="GridStor Market Sight Logo" class="w-8 h-8" />
  GridStor Market Sight
</a>
```

---

## 🔗 **NAVIGATION LINKS**

### Link Structure

**Three Primary Links:**

1. **Long Term Outlook**
   - Route: `/long-term-outlook`
   - Color: Blue association (#3B82F6)
   - Purpose: Strategic planning

2. **Short Term Outlook**
   - Route: `/short-term-outlook`
   - Color: Green association (#10B981)
   - Purpose: Daily operations

3. **Risk/Structuring**
   - Route: `/risk-structuring`
   - Color: Purple association (#8B5CF6)
   - Purpose: Risk analytics

### Link Specifications

**Dimensions:**
```css
Height: 40px (clickable area with padding)
Padding: 8px 0 (vertical only, no horizontal)
Min-width: Auto (content-based)
```

**Typography:**
```css
Font: Inter
Size: 16px
Weight: 500 (medium)
Color: #FFFFFF
Line-height: 1.5 (24px)
```

**States:**

**Default:**
```css
color: #FFFFFF
cursor: pointer
```

**Hover:**
```css
color: #D1D5DB (gray-300)
transition: colors 200ms ease-in-out
```

**Active (current page):**
```css
color: #D1D5DB (gray-300)
font-weight: 500 (same as default)
/* No underline or additional styling */
```

**Focus (keyboard navigation):**
```css
outline: 2px solid #06B6D4 (cyan)
outline-offset: 4px
border-radius: 4px
```

### Navigation Container

```css
Display: Flex (hidden on mobile, visible lg+)
Gap: 32px (gap-8)
Align: items-center
Visibility: hidden on < 1024px, flex on >= 1024px
```

**Responsive:**
```
Mobile (< 1024px): Hidden (burger menu would go here)
Desktop (>= 1024px): Visible flex layout
```

---

## ⚙️ **SETTINGS ICON**

### Icon Button Specifications

**Container:**
```css
Width: 40px
Height: 40px
Padding: 8px (p-2)
Border-radius: 6px (rounded-md)
Background: Transparent
Hover Background: #374151 (gray-700)
Transition: background-color 200ms
```

**Icon:**
```css
Width: 20px (w-5)
Height: 20px (h-5)
Stroke: currentColor (white)
Stroke-width: 2
Fill: none
```

**SVG Path:**
```svg
<!-- Settings/Gear Icon -->
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
```

**States:**

**Default:**
```css
background: transparent
color: white
```

**Hover:**
```css
background: #374151 (gray-700)
border-radius: 6px
transition: 200ms
```

**Focus:**
```css
outline: 2px solid #06B6D4
outline-offset: 2px
```

**Active (clicked):**
```css
background: #4B5563 (gray-600)
transform: scale(0.95)
transition: 100ms
```

---

## 📱 **RESPONSIVE BEHAVIOR**

### Breakpoints

```css
Mobile:  < 1024px
Desktop: >= 1024px
```

### Desktop Layout (>= 1024px)

```
┌────────────────────────────────────────────────────────────┐
│ [⚡] GridStor Market Sight  │  Long Term │ Short Term │ ⚙️ │
│ [32px gap]──────────────────│  [32px gaps between links]  │
└────────────────────────────────────────────────────────────┘
```

**Full width displayed**
- Logo + text visible
- All navigation links visible
- Settings icon visible

### Mobile Layout (< 1024px)

```
┌────────────────────────────────────┐
│ [⚡] GridStor Market Sight      ⚙️│
│ [Logo + text only]   [Settings only]│
└────────────────────────────────────┘
```

**Collapsed navigation**
- Logo + text visible
- Navigation links hidden (burger menu can be added)
- Settings icon visible

### Padding Adjustments

| Breakpoint | Horizontal Padding |
|------------|-------------------|
| < 640px | 16px (px-4) |
| 640-1024px | 24px (sm:px-6) |
| >= 1024px | 32px (lg:px-8) |

---

## 🎨 **FIGMA SETUP INSTRUCTIONS**

### Step 1: Create Color Styles

**Create these color styles:**
- Header-BG / #2A2A2A
- Header-Text / #FFFFFF
- Header-Text-Hover / #D1D5DB
- Header-Icon-Hover-BG / #374151
- Logo-Cyan / #06B6D4

### Step 2: Create Text Styles

**Logo Text Style:**
- Name: "Nav/Logo"
- Font: Inter Bold
- Size: 20px
- Line height: 1.2 (24px)
- Color: White
- Letter-spacing: -0.2px

**Nav Link Style:**
- Name: "Nav/Link"
- Font: Inter Medium
- Size: 16px
- Line height: 1.5 (24px)
- Color: White
- Letter-spacing: 0

### Step 3: Create Component - Lightning Bolt Icon

```
Component: Icon/Lightning-Bolt
Size: 32 × 32px
Content: Vector lightning bolt shape
Color: Cyan (#06B6D4)
Export: SVG
```

**Vector Path in Figma:**
Use pen tool to create lightning bolt or import `public/lightning-bolt.svg`

### Step 4: Create Component - Settings Icon

```
Component: Icon/Settings
Size: 20 × 20px
Stroke: 2px
Color: White
Background: 40×40px button container
```

### Step 5: Create Navigation Bar Component

**Component Structure:**

```
NavigationBar (Component)
├── Container (Frame, fill parent width, height: 72px)
│   ├── Background (Fill: #2A2A2A)
│   └── Content-Wrapper (Auto-layout horizontal, max-width: 1280px, centered)
│       ├── Left-Section (Auto-layout horizontal, gap: 32px)
│       │   ├── Logo-Group (Auto-layout horizontal, gap: 12px)
│       │   │   ├── Lightning-Icon (32×32)
│       │   │   └── Site-Name (Text: "GridStor Market Sight")
│       │   └── Nav-Links (Auto-layout horizontal, gap: 32px)
│       │       ├── Link-1 ("Long Term Outlook")
│       │       ├── Link-2 ("Short Term Outlook")
│       │       └── Link-3 ("Risk/Structuring")
│       └── Right-Section (Auto-layout horizontal, gap: 8px, margin-left: 16px)
│           └── Settings-Button (40×40, icon 20×20)
```

### Component Properties (Variants)

**Create variants for:**
1. **Active Page:**
   - Property: activePage
   - Values: none, long-term, short-term, risk
   - Effect: Applies gray-300 color to active link

2. **Responsive:**
   - Property: breakpoint
   - Values: mobile, desktop
   - Effect: Shows/hides navigation links

---

## 🎯 **EXACT MEASUREMENTS**

### Header Height
```
Total: 72px
├─ Vertical padding: 16px × 2 = 32px
└─ Content height: 40px (logo/links/icons)
```

### Logo Area
```
Icon: 32 × 32px
Gap: 12px
Text height: 24px (20px font × 1.2 line-height)
Total width: ~280px (dynamic based on text)
```

### Navigation Links
```
Each link:
  Height: 24px (text line-height)
  Padding: 8px vertical (clickable area = 40px)
  Gap between: 32px
  Total width: ~600px (3 links + gaps)
```

### Settings Icon
```
Button: 40 × 40px
Icon: 20 × 20px (centered)
Border-radius: 6px
```

---

## 🎨 **COLOR SPECIFICATIONS**

### Primary Colors

| Element | Color | Hex | RGB | Use Case |
|---------|-------|-----|-----|----------|
| **Header BG** | Near-Black | #2A2A2A | 42,42,42 | Main background |
| **Text Default** | White | #FFFFFF | 255,255,255 | Logo, links |
| **Text Hover** | Gray-300 | #D1D5DB | 209,213,219 | Link hover |
| **Logo Icon** | Cyan-500 | #06B6D4 | 6,182,212 | Lightning bolt |
| **Icon Hover BG** | Gray-700 | #374151 | 55,65,81 | Button hover |

### Shadow

```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
/* Subtle depth, professional */
```

---

## ✨ **INTERACTION STATES**

### Logo Hover

```css
/* Default */
color: #FFFFFF;

/* Hover */
color: #D1D5DB;
transition: color 200ms ease-in-out;
cursor: pointer;

/* Both icon and text change color together */
```

### Navigation Link States

**Default:**
```css
color: #FFFFFF;
font-weight: 500;
text-decoration: none;
```

**Hover:**
```css
color: #D1D5DB;
transition: color 200ms ease-in-out;
cursor: pointer;
```

**Active (Current Page):**
```css
color: #D1D5DB;
/* Visually same as hover but persistent */
```

**Focus (Keyboard):**
```css
outline: 2px solid #06B6D4;
outline-offset: 4px;
border-radius: 4px;
```

### Settings Button States

**Default:**
```css
background: transparent;
color: #FFFFFF;
border-radius: 6px;
```

**Hover:**
```css
background: #374151;
color: #FFFFFF;
transition: background-color 200ms;
```

**Active (Clicked):**
```css
background: #4B5563;
transform: scale(0.95);
transition: 100ms;
```

**Focus:**
```css
outline: 2px solid #06B6D4;
outline-offset: 2px;
```

---

## 📐 **LAYOUT GRID**

### Desktop Layout (>= 1024px)

```
Total Width: 1280px max
├─ Left Section (~920px flex-grow)
│  ├─ Logo Area (~280px)
│  │  ├─ Icon: 32px
│  │  ├─ Gap: 12px
│  │  └─ Text: ~236px
│  ├─ Gap: 32px
│  └─ Nav Links (~600px)
│     ├─ Link 1: ~160px
│     ├─ Gap: 32px
│     ├─ Link 2: ~170px
│     ├─ Gap: 32px
│     └─ Link 3: ~150px
├─ Spacer (flex-grow)
└─ Right Section (56px)
   ├─ Margin: 16px
   └─ Settings: 40px
```

### Alignment Rules

```css
Horizontal: justify-between (max space between left/right)
Vertical: items-center (perfect centering)
```

---

## 🎨 **DESIGN TOKENS**

```css
/* Header Tokens */
--nav-height: 72px;
--nav-bg: #2A2A2A;
--nav-text: #FFFFFF;
--nav-text-hover: #D1D5DB;
--nav-shadow: 0 1px 3px rgba(0,0,0,0.1);

/* Logo Tokens */
--logo-icon-size: 32px;
--logo-icon-color: #06B6D4;
--logo-text-size: 20px;
--logo-gap: 12px;

/* Navigation Tokens */
--nav-link-size: 16px;
--nav-link-weight: 500;
--nav-link-gap: 32px;
--nav-link-padding: 8px 0;

/* Settings Tokens */
--settings-button-size: 40px;
--settings-icon-size: 20px;
--settings-hover-bg: #374151;

/* Spacing Tokens */
--nav-padding-y: 16px;
--nav-padding-x-mobile: 16px;
--nav-padding-x-tablet: 24px;
--nav-padding-x-desktop: 32px;
--nav-section-gap: 32px;

/* Transition Tokens */
--nav-transition: 200ms ease-in-out;
--nav-transition-fast: 100ms ease-in-out;
```

---

## 🎯 **ACCESSIBILITY**

### Semantic HTML

```html
<header role="banner">
  <div> <!-- Container -->
    <div> <!-- Flex wrapper -->
      <!-- Logo -->
      <a href="/" aria-label="GridStor Market Sight Home">
        <img src="/lightning-bolt.svg" alt="" role="presentation" />
        <span>GridStor Market Sight</span>
      </a>
      
      <!-- Navigation -->
      <nav role="navigation" aria-label="Primary">
        <a href="/long-term-outlook" aria-current="page">Long Term Outlook</a>
        <a href="/short-term-outlook">Short Term Outlook</a>
        <a href="/risk-structuring">Risk/Structuring</a>
      </nav>
      
      <!-- Settings -->
      <button aria-label="Settings" title="Settings">
        <!-- Icon -->
      </button>
    </div>
  </div>
</header>
```

### Keyboard Navigation

```
Tab Order:
1. Logo (focusable link)
2. Long Term Outlook (focusable link)
3. Short Term Outlook (focusable link)
4. Risk/Structuring (focusable link)
5. Settings button (focusable button)

Focus Indicators:
- Cyan outline (#06B6D4)
- 2px width
- 4px offset
- Visible and clear
```

### Screen Reader Support

```html
<!-- Current page indicator -->
<a aria-current="page">Long Term Outlook</a>

<!-- Logo alt text -->
<img alt="GridStor Market Sight Logo" />

<!-- Button labels -->
<button aria-label="Settings" title="Settings">
```

---

## 📱 **RESPONSIVE SPECIFICATIONS**

### Desktop (>= 1024px)

```
Full Navigation Bar:
├─ Logo: 32px icon + text
├─ Gap: 32px
├─ All 3 nav links visible
├─ Spacer (flex-grow)
└─ Settings: 40px button

Total min-width: ~1000px
Max-width: 1280px (centered)
```

### Tablet (640-1024px)

```
Collapsed Navigation:
├─ Logo: 32px icon + text
├─ Navigation: Hidden (would show burger menu)
├─ Spacer
└─ Settings: 40px button

Recommendation: Add hamburger menu
```

### Mobile (< 640px)

```
Minimal Header:
├─ Logo: 32px icon + text
├─ Spacer
└─ Settings: 40px button

Padding: 16px horizontal
Logo text: May wrap on very small screens
```

---

## 🎨 **FIGMA LAYERS**

### Layer Naming Convention

```
NavigationBar
├─ BG (Rectangle, #2A2A2A)
├─ Shadow (Effect)
└─ Content-Wrapper (Auto-layout horizontal)
    ├─ Left-Group (Auto-layout horizontal, gap: 32px)
    │   ├─ Logo-Link (Auto-layout horizontal, gap: 12px)
    │   │   ├─ Icon-Lightning (32×32)
    │   │   └─ Text-SiteName (Text, 20px bold)
    │   └─ NavLinks-Group (Auto-layout horizontal, gap: 32px)
    │       ├─ Link-LongTerm (Text, 16px medium)
    │       ├─ Link-ShortTerm (Text, 16px medium)
    │       └─ Link-Risk (Text, 16px medium)
    └─ Right-Group (Auto-layout horizontal)
        └─ Button-Settings (40×40, icon 20×20)
```

### Auto-Layout Settings

**Content-Wrapper:**
```
Direction: Horizontal
Gap: Auto (space-between)
Padding: 16px vertical, [16/24/32]px horizontal
Alignment: Vertical center
Max-width: 1280px
Horizontal alignment: Center (within parent)
```

**Left-Group:**
```
Direction: Horizontal
Gap: 32px
Alignment: Vertical center
```

**Logo-Link:**
```
Direction: Horizontal
Gap: 12px
Alignment: Vertical center
```

**NavLinks-Group:**
```
Direction: Horizontal
Gap: 32px
Alignment: Vertical center
```

---

## 💻 **DEVELOPER QUICK REFERENCE**

### Complete HTML Structure

```html
<header class="bg-[#2A2A2A] text-white shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <!-- Left: Logo + Navigation -->
      <div class="flex items-center gap-8">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 text-xl font-bold hover:text-gray-300 transition-colors">
          <img src="/lightning-bolt.svg" alt="GridStor Market Sight Logo" class="w-8 h-8" />
          GridStor Market Sight
        </a>
        
        <!-- Navigation Links -->
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
      
      <!-- Right: Settings -->
      <div class="flex items-center gap-2 ml-4">
        <button class="p-2 hover:bg-gray-700 rounded-md transition-colors" title="Settings">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <!-- Settings icon paths -->
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>
```

### Tailwind Classes Reference

```css
/* Header Container */
.bg-[#2A2A2A]         /* Background color */
.text-white           /* Text color */
.shadow-sm            /* Subtle shadow */

/* Content Wrapper */
.max-w-7xl            /* Max width 1280px */
.mx-auto              /* Center horizontally */
.px-4                 /* Padding 16px (mobile) */
.sm:px-6              /* Padding 24px (tablet) */
.lg:px-8              /* Padding 32px (desktop) */
.py-4                 /* Padding 16px vertical */

/* Flex Layouts */
.flex                 /* Display flex */
.items-center         /* Vertical center */
.justify-between      /* Space between */
.gap-8                /* Gap 32px */
.gap-3                /* Gap 12px */

/* Logo */
.text-xl              /* Font 20px */
.font-bold            /* Weight 700 */
.hover:text-gray-300  /* Hover color */
.transition-colors    /* Smooth color change */
.w-8                  /* Width 32px */
.h-8                  /* Height 32px */

/* Navigation */
.hidden               /* Hide on mobile */
.lg:flex              /* Show on desktop */
.font-medium          /* Weight 500 */

/* Settings Button */
.p-2                  /* Padding 8px */
.hover:bg-gray-700    /* Hover background */
.rounded-md           /* Border radius 6px */
.w-5                  /* Icon width 20px */
.h-5                  /* Icon height 20px */
```

---

## 🎨 **ACTIVE STATE LOGIC**

### Implementation (JavaScript/TypeScript)

```typescript
// Get current path
const currentPath = window.location.pathname;
// or in Astro: const currentPath = Astro.url.pathname;

// Apply active class
const isLongTerm = currentPath.startsWith('/long-term-outlook');
const isShortTerm = currentPath.startsWith('/short-term-outlook');
const isRisk = currentPath.startsWith('/risk-structuring');

// Classes
const linkClass = (isActive: boolean) => 
  `text-white hover:text-gray-300 transition-colors font-medium ${isActive ? 'text-gray-300' : ''}`;
```

---

## 🎯 **USAGE GUIDELINES**

### Do's ✅

- Always use exact color values (#2A2A2A, #06B6D4)
- Maintain 72px total header height
- Keep 32px gap between nav items
- Use Inter font family
- Include shadow for depth
- Make logo clickable (links to home)
- Add title/aria-label to settings button
- Test keyboard navigation
- Ensure focus indicators visible

### Don'ts ❌

- Don't change header background color
- Don't adjust logo size (must be 32×32px)
- Don't use different gaps (stick to 32px, 12px)
- Don't add underlines to links
- Don't change font weights
- Don't remove shadow
- Don't add borders
- Don't make header transparent
- Don't use different icon sizes

---

## 🔄 **VARIANTS & EXTENSIONS**

### Adding a Navigation Item

If you need to add a 4th nav item:

```html
<a href="/new-module" 
   class="text-white hover:text-gray-300 transition-colors font-medium">
  New Module
</a>
```

**Impact:** Increases nav width by ~180px + 32px gap

### Adding a Secondary Action

If adding a button next to settings:

```html
<div class="flex items-center gap-2 ml-4">
  <button class="p-2 hover:bg-gray-700 rounded-md transition-colors" title="Notifications">
    <!-- Icon -->
  </button>
  <button class="p-2 hover:bg-gray-700 rounded-md transition-colors" title="Settings">
    <!-- Settings icon -->
  </button>
</div>
```

### Mobile Menu (Future)

Recommended hamburger menu button:

```html
<button class="lg:hidden p-2 hover:bg-gray-700 rounded-md" aria-label="Menu">
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
</button>
```

---

## 📊 **DESIGN CHECKLIST**

Before approving any header design:

- [ ] Header background is #2A2A2A
- [ ] Total height is 72px (16px padding × 2 + ~40px content)
- [ ] Logo icon is 32×32px lightning bolt in cyan
- [ ] Logo text is 20px Inter Bold
- [ ] Gap between logo and nav is 32px
- [ ] Navigation links are 16px Inter Medium
- [ ] Gap between nav links is 32px
- [ ] Settings icon is 20×20px in 40×40px button
- [ ] All text is white (#FFFFFF)
- [ ] Hover states change to gray-300 (#D1D5DB)
- [ ] Transitions are 200ms ease-in-out
- [ ] Shadow is 0 1px 3px rgba(0,0,0,0.1)
- [ ] Max-width container is 1280px centered
- [ ] Responsive padding: 16/24/32px
- [ ] Nav links hidden on mobile (< 1024px)
- [ ] All interactive elements have focus states
- [ ] All buttons have aria-labels or titles

---

## 🎨 **EXPORT SPECIFICATIONS**

### For Developers

**Export from Figma:**
- Header component as SVG
- Lightning bolt icon as SVG (separate)
- CSS values as design tokens
- Measurements as spacing variables

### For Design System

**Include in style guide:**
- Header anatomy diagram
- Color swatches with hex codes
- Typography specimens
- Spacing measurements
- Interaction state examples
- Code snippets for each component

---

## 💡 **BEST PRACTICES**

### Consistency Rules

1. **Never modify the header height** - Always 72px
2. **Never change the background color** - Always #2A2A2A
3. **Always use the lightning bolt logo** - No substitutes
4. **Always maintain 32px gaps** - Between logo, nav, items
5. **Always use transition-colors** - For smooth interactions

### Implementation Tips

1. **Use component/layout** - Don't duplicate header HTML
2. **Extract to Layout.astro** - Single source of truth
3. **Pass currentPath** - For active state highlighting
4. **Test mobile early** - Plan for hamburger menu
5. **Maintain z-index** - If making header sticky/fixed

---

## 📐 **MEASUREMENTS SUMMARY**

Quick reference table:

| Element | Width | Height | Padding | Gap | Font Size |
|---------|-------|--------|---------|-----|-----------|
| **Header** | 100% | 72px | 16px Y | - | - |
| **Container** | 1280px max | - | 16/24/32px X | - | - |
| **Logo Icon** | 32px | 32px | 0 | 12px | - |
| **Logo Text** | Auto | 24px | 0 | - | 20px |
| **Nav Link** | Auto | 24px | 8px Y | 32px | 16px |
| **Settings** | 40px | 40px | 8px | - | - |
| **Icon** | 20px | 20px | - | - | - |

---

## 🎨 **FIGMA FILE ORGANIZATION**

### Recommended Structure

```
GridStor Design System (File)
├─ 🎨 Styles (Page)
│  ├─ Colors
│  ├─ Typography
│  └─ Effects
├─ 🧩 Components (Page)
│  ├─ Navigation
│  │  ├─ NavigationBar (Main component)
│  │  ├─ Logo-Group
│  │  ├─ Nav-Link
│  │  └─ Settings-Button
│  └─ Icons
│     ├─ Lightning-Bolt
│     └─ Settings-Gear
└─ 📄 Documentation (Page)
   └─ Navigation Specs (This document)
```

---

## ✅ **VALIDATION CHECKLIST**

Use this when implementing on any page:

**Visual Check:**
- [ ] Header is dark gray (#2A2A2A), not pure black
- [ ] Lightning bolt is cyan, not blue or gray
- [ ] Logo and text are same color (white)
- [ ] Navigation links are evenly spaced
- [ ] Settings icon is right-aligned
- [ ] Subtle shadow under header

**Interaction Check:**
- [ ] Logo hover changes to gray-300
- [ ] Each nav link hover changes to gray-300
- [ ] Active page link shows gray-300
- [ ] Settings button has hover background
- [ ] All transitions smooth (200ms)
- [ ] Focus outlines visible (cyan)

**Technical Check:**
- [ ] Header height exactly 72px
- [ ] Max-width 1280px
- [ ] Responsive padding correct
- [ ] Nav hidden on mobile
- [ ] All aria-labels present
- [ ] SVG logo loads correctly

**Code Check:**
- [ ] Using exact Tailwind classes
- [ ] No inline styles except logo color
- [ ] Proper semantic HTML
- [ ] Accessibility attributes included

---

**This is your navigation bar source of truth!**  
**Every page, every app, every design should match this specification exactly.** ⚡✨
