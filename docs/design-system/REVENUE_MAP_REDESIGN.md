# Revenue Forecasting Map - Redesign Specification
## Applying Market Performance Overview Design Principles

---

## 🎯 **DESIGN GOALS**

Transform the Revenue Forecasting Map from a functional tool into a polished, professional component that matches the Market Performance Overview aesthetic:

- **Current:** Functional but visually inconsistent
- **Goal:** Professional, cohesive, and delightful to use

---

## 📊 **CURRENT STATE ANALYSIS**

### What's Working ✅
- Interactive map with location markers
- Clear data breakdown (Energy, AS, Capacity)
- Duration selection per location
- Global controls (COD Year, Horizon)
- Download functionality
- Connecting lines from markers to callouts

### What Needs Improvement ❌

| Element | Current Issue | Design System Conflict |
|---------|--------------|------------------------|
| **Section Background** | Gray-50 container | Should be white with proper section structure |
| **Map Container** | Fixed 800px height | Not responsive, awkward spacing |
| **Callout Cards** | 2px border, tight padding | Should use 4px left border, 24px padding |
| **Typography** | Inconsistent sizes | Doesn't follow type scale |
| **Data Display** | Plain text rows | Should use metric box pattern |
| **Shadows** | Generic shadow-lg | Should use design system shadows |
| **Hover States** | None on callouts | Should lift and enhance shadow |
| **Spacing** | Tight, cramped | Should use 16px/24px system |
| **Download Button** | Isolated | Should integrate better |

---

## 🎨 **REDESIGNED STRUCTURE**

### New Layout Hierarchy

```
┌──────────────────────────────────────────────────────────────┐
│  SECTION CONTAINER (py-12, bg-white)                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  CONTENT WRAPPER (max-w-7xl, centered, px-4/6/8)      │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  HEADER                                          │  │  │
│  │  │  • Title: "Revenue Forecasting Map" (text-2xl)  │  │  │
│  │  │  • Subtitle: "Interactive energy arbitrage..."  │  │  │
│  │  │  └─ mb-8                                         │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  CONTROLS CARD                                   │  │  │
│  │  │  • White background, rounded-lg, shadow-sm       │  │  │
│  │  │  • Flex layout: Controls left, Button right     │  │  │
│  │  │  • Padding: 24px                                 │  │  │
│  │  │  • Margin bottom: 24px                           │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  MAP CARD                                        │  │  │
│  │  │  • White background, rounded-lg, shadow-sm       │  │  │
│  │  │  • Hover: lift + shadow enhancement              │  │  │
│  │  │  • Padding: 24px                                 │  │  │
│  │  │  • Responsive height (not fixed)                 │  │  │
│  │  │                                                   │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │  US MAP (centered)                        │  │  │  │
│  │  │  │  • Market color-coded states              │  │  │  │
│  │  │  │  • Location markers                        │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  │                                                   │  │  │
│  │  │  [Location Callout Cards positioned around map]  │  │  │
│  │  │                                                   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎴 **REDESIGNED LOCATION CALLOUT CARDS**

### New Card Specification

**Apply Market Performance Card Design:**

```
┌───────────────────────────────┐
│ [●] NP15              $16.34  │ ← Header: Location + Total (bold, monospace)
│ Northern California           │ ← Region (12px, gray-500)
│ ─────────────────────────     │ ← Divider (gray-100)
│                               │
│ ┌───────────────────────────┐ │
│ │ ENERGY ARBITRAGE          │ │ ← Label (12px, uppercase, gray-500)
│ │ $9.12            4h ▼     │ │ ← Value (18px, mono) + Duration selector
│ │ $/kW-month                │ │ ← Unit (12px, gray-600)
│ └───────────────────────────┘ │
│                               │
│ ┌──────────┐  ┌──────────┐   │
│ │ AS       │  │ CAPACITY │   │ ← 2-column grid
│ │ $0.91    │  │ $7.00    │   │
│ └──────────┘  └──────────┘   │
│                               │
│ ═════════════════════════     │ ← Bolder divider (gray-200)
│ TOTAL REVENUE          $17.03 │ ← Summary (bold, color accent)
└───────────────────────────────┘
```

### Detailed Specifications

**Container:**
```css
width: 240px (increased from 180px)
padding: 24px (was 12px)
background: white
border-left: 4px solid [market-color]
border-radius: 8px
box-shadow: 0 1px 3px rgba(0,0,0,0.1)
transition: all 200ms ease-in-out
```

**Hover State:**
```css
transform: translateY(-3px)
box-shadow: 0 12px 30px rgba(0,0,0,0.1)
```

**Header Section:**
```
Dot + Location Name:
  - Dot: 12px circle, market color
  - Name: 16px, semibold (600), gray-800
  - Gap: 8px
  - Flex: items-center

Total Revenue (right-aligned):
  - 18px, bold (700), monospace, market color
  - Positioned: absolute top-right

Region:
  - 12px, regular (400), gray-500
  - Margin-top: 4px
  - Margin-bottom: 12px

Divider:
  - 1px solid gray-100
  - Margin-bottom: 16px
```

**Energy Arbitrage Section (Featured):**
```
Container:
  - Background: gray-50
  - Border-radius: 6px
  - Padding: 12px
  - Margin-bottom: 16px

Layout:
  - Label at top (12px, uppercase, medium, gray-500)
  - Value: 18px, bold, monospace, gray-900
  - Duration selector: inline-block, right side
  - Unit: 12px, gray-600
```

**AS & Capacity Grid:**
```
Grid:
  - 2 columns
  - Gap: 12px
  - Margin-bottom: 16px

Each Box:
  - Background: gray-50
  - Border-radius: 6px
  - Padding: 12px
  - Label: 10px, uppercase, gray-500
  - Value: 14px, bold, monospace, gray-900
  - Unit: 10px, gray-600
```

**Total Section:**
```
Border-top: 2px solid gray-200
Padding-top: 16px

Text:
  - Left: "TOTAL REVENUE" (12px, uppercase, semibold, gray-600)
  - Right: Total value (20px, bold, monospace, market color)
```

**Duration Dropdown:**
```
Integrated into Energy Arbitrage section
Size: 60px width × 28px height
Border: 1px solid gray-200
Border-radius: 4px
Font: 12px, monospace
Background: white
Position: Inline with energy value
```

---

## 🎛️ **REDESIGNED CONTROLS CARD**

### New Controls Specification

```
┌─────────────────────────────────────────────────────────────┐
│  COD Year    Forecast Horizon                Download Data  │
│  [2026 ▼]    [10y ▼]                         [📥 Button]   │
└─────────────────────────────────────────────────────────────┘
```

**Container:**
```css
background: white
border-radius: 8px
box-shadow: 0 1px 3px rgba(0,0,0,0.1)
padding: 24px
margin-bottom: 24px
display: flex
justify-content: space-between
align-items: center
```

**Control Groups:**
```
Left Side (Controls):
  - Flex gap: 24px
  - Label: 12px, medium (500), gray-700, mb-8px
  - Select: h-40px, w-80px, gray-50 bg, border gray-200
  
Right Side (Button):
  - Background: Blue-600
  - Padding: 10px 20px
  - Border-radius: 6px
  - Font: 14px, medium (500), white
  - Icon: 16px download icon
  - Gap: 8px
  - Hover: Blue-700, lift 2px, shadow
```

---

## 🗺️ **REDESIGNED MAP CONTAINER**

### New Map Card Specification

```
┌─────────────────────────────────────────────────────────────┐
│  [padding: 24px]                                            │
│                                                              │
│         [Callout]                    [Callout]              │
│                                                              │
│              ┌─────────────────┐                            │
│  [Callout]   │                 │    [Callout]               │
│              │   US MAP        │                            │
│              │   (centered)    │                            │
│  [Callout]   │                 │    [Callout]               │
│              └─────────────────┘                            │
│                                                              │
│         [Callout]                    [Callout]              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Container:**
```css
background: white
border-radius: 8px
box-shadow: 0 1px 3px rgba(0,0,0,0.1)
padding: 24px
position: relative
min-height: 600px (responsive)
transition: all 200ms ease-in-out
```

**Hover State (entire card):**
```css
box-shadow: 0 4px 12px rgba(0,0,0,0.08)
/* Subtle lift on whole container */
```

**Connecting Lines:**
```
Stroke width: 1.5px (was 2px)
Stroke color: Market color
Opacity: 0.4 (was 0.7)
Dash array: 3,3 (was 4,4)
/* More subtle, less distracting */
```

**Map Markers:**
```
Size: 8px radius (was 6px)
Fill: Market color
Stroke: white, 2px
Shadow: drop-shadow(0 2px 4px rgba(0,0,0,0.3))
Pulse animation: optional subtle pulse on hover
```

---

## 📏 **RESPONSIVE BEHAVIOR**

### Breakpoints

**Desktop (> 1024px):**
- Max-width: 1280px
- Callouts: Positioned around edges
- Map: Large, centered
- Controls: Horizontal layout

**Tablet (640-1024px):**
- Max-width: 100%
- Callouts: Slightly inward
- Map: Medium size
- Controls: Horizontal (may wrap)

**Mobile (< 640px):**
- Callouts: Stack below map
- Map: Full width
- Controls: Stack vertically
- Card width: Full width - 32px

### Mobile-Specific Layout

```
[Section Header]

[Controls Card]
  ├─ COD Year
  ├─ Horizon
  └─ Download Button

[Map Card]
  └─ US Map (full width)

[Callout Cards - Stacked]
  ├─ NP15
  ├─ Goleta
  ├─ SP15
  ├─ Houston
  ├─ Hidden Lakes
  ├─ Gunnar
  ├─ South Hub
  ├─ North Hub
  └─ South Hub SPP
```

---

## 🎨 **COLOR APPLICATION**

### Market Color Coding

**CAISO (Blue):**
- Primary: #3B82F6
- Tint-50: #EFF6FF
- States: California
- Locations: NP15, Goleta, SP15

**ERCOT (Red):**
- Primary: #EF4444
- Tint-50: #FEE2E2
- State: Texas
- Locations: Houston, Hidden Lakes, Gunnar, South Hub

**SPP (Green):**
- Primary: #10B981
- Tint-50: #ECFDF5
- States: OK, KS, NE, AR, LA, MO, IA, MN, ND, SD, WY, CO, NM
- Locations: North Hub, South Hub SPP

### Usage Rules

**Left Border (4px):**
- Always market color
- Distinguishes market at a glance

**Total Revenue Value:**
- Always market color
- Bold, monospace
- Stands out as primary metric

**Map States:**
- Fill: Market color at 100% opacity
- Hover: brightness(1.1)
- Stroke: white, 0.5px

**Connecting Lines:**
- Stroke: Market color
- Opacity: 0.4
- Subtle, doesn't dominate

---

## 📊 **DATA DISPLAY PATTERNS**

### Three-Tier Hierarchy

**Tier 1: Total Revenue (Most Important)**
- Size: 20px
- Weight: Bold (700)
- Font: Monospace
- Color: Market accent
- Position: Top-right header AND bottom total

**Tier 2: Energy Arbitrage (Primary Metric)**
- Size: 18px
- Weight: Bold (700)
- Font: Monospace
- Color: Gray-900
- Background: Gray-50 box (featured)

**Tier 3: AS & Capacity (Supporting Metrics)**
- Size: 14px
- Weight: Bold (700)
- Font: Monospace
- Color: Gray-900
- Background: Gray-50 boxes (smaller grid)

### Units Display

**Always include units:**
- Font: 10-12px (smaller than value)
- Weight: Regular (400)
- Color: Gray-600
- Position: Below value

---

## ✨ **INTERACTION DESIGN**

### Callout Card Interactions

**Hover State:**
```
Duration: 200ms
Easing: ease-in-out
Transform: translateY(-3px)
Shadow: 0 12px 30px rgba(0,0,0,0.1)
Cursor: default
```

**Duration Dropdown:**
```
On open: Show 2h, 4h, 8h options
On change: Recalculate all values instantly
Transition: Values fade out, new values fade in (150ms)
```

**Click Behavior:**
```
Optional: Click callout to highlight on map
Effect: Marker pulses, connecting line animates
```

### Map Interactions

**State Hover:**
```
Filter: brightness(1.1)
Cursor: default (not clickable)
Tooltip: Optional state name display
```

**Marker Hover:**
```
Optional: Scale to 1.2x
Shadow: Increase intensity
Effect: Corresponding callout highlights
```

### Controls Interactions

**Dropdowns:**
```
Background: Gray-50
Hover: Gray-100
Focus: Blue-500 ring
Transition: 150ms
```

**Download Button:**
```
Hover: Background blue-700, translateY(-2px)
Click: Scale 0.98, quick feedback
Icon: 16px, left of text
```

---

## 🏗️ **IMPLEMENTATION GUIDE**

### Step 1: Update Section Structure

**Before:**
```jsx
<div className="bg-gray-50 rounded-lg p-6">
```

**After:**
```jsx
<section className="py-12 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#2A2A2A] mb-2">
        Revenue Forecasting Map
      </h2>
      <p className="text-gray-600">
        Interactive energy arbitrage forecasting across market locations
      </p>
    </div>
```

### Step 2: Create Controls Card Component

```jsx
<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-6">
      {/* COD Year Control */}
      {/* Horizon Control */}
    </div>
    <button className="inline-flex items-center gap-2 bg-blue-600...">
      <Download size={16} />
      Download Data
    </button>
  </div>
</div>
```

### Step 3: Redesign Map Container

```jsx
<div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md relative">
  {/* SVG overlay for connecting lines */}
  {/* Map component */}
  {/* Callout cards */}
</div>
```

### Step 4: Rebuild Callout Cards

```jsx
<motion.div
  whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
  className={`
    absolute bg-white rounded-lg p-6 
    border-l-4 shadow-sm
    transition-all duration-200
  `}
  style={{
    borderColor: location.color,
    left: `${location.calloutPosition.x}%`,
    top: `${location.calloutPosition.y}%`,
    width: '240px'
  }}
>
  {/* Header with location + total */}
  {/* Region */}
  {/* Divider */}
  {/* Energy Arbitrage feature box */}
  {/* AS & Capacity grid */}
  {/* Total summary */}
</motion.div>
```

### Step 5: Apply Typography System

```jsx
// Location name
<h3 className="text-base font-semibold text-gray-800">

// Region
<p className="text-xs text-gray-500">

// Labels
<div className="text-xs uppercase tracking-wider font-medium text-gray-500">

// Values
<div className="text-lg font-bold font-mono text-gray-900">

// Units
<div className="text-xs text-gray-600">

// Total
<div className="text-xl font-bold font-mono" style={{ color: location.color }}>
```

---

## 📋 **BEFORE & AFTER COMPARISON**

### Visual Hierarchy

| Element | Before | After |
|---------|--------|-------|
| **Section BG** | Gray-50 | White (professional) |
| **Card Padding** | 12px | 24px (consistent) |
| **Border** | 2px all sides | 4px left only (accent) |
| **Shadow** | Generic | Design system tiered |
| **Hover** | None | Lift + shadow enhance |
| **Typography** | Mixed sizes | Consistent scale |
| **Data Display** | Text rows | Metric box pattern |
| **Spacing** | Tight | 16px/24px system |
| **Total Emphasis** | Small, black | Large, colored, prominent |

### User Experience

| Aspect | Before | After |
|--------|--------|-------|
| **Visual Weight** | Map dominates | Balanced attention |
| **Scannability** | Difficult | Easy hierarchy |
| **Professional Feel** | Functional | Polished enterprise |
| **Consistency** | Standalone | Matches site design |
| **Mobile UX** | Cramped | Clean, spacious |
| **Interactivity** | Minimal | Delightful hovers |

---

## 🎯 **DESIGN CHECKLIST**

Before finalizing the redesign:

- [ ] Section has white background with proper padding (py-12)
- [ ] Max-width container is 1280px (max-w-7xl)
- [ ] Section header follows typography scale
- [ ] Controls card has 24px padding
- [ ] Map card has 24px padding
- [ ] Callout cards are 240px wide
- [ ] All callouts have 4px left border in market color
- [ ] Callouts have 24px padding (not 12px)
- [ ] Hover state lifts 3px with enhanced shadow
- [ ] All numbers use JetBrains Mono font
- [ ] All labels are uppercase with letter-spacing
- [ ] Data boxes have gray-50 background
- [ ] Total revenue uses market color
- [ ] Shadows match design system (no custom)
- [ ] Border radius is 6px (boxes) or 8px (cards)
- [ ] Spacing uses 16px or 24px increments
- [ ] Connecting lines are subtle (opacity 0.4)
- [ ] Duration dropdowns integrated smoothly
- [ ] Download button matches system button style
- [ ] Responsive behavior tested at all breakpoints

---

## 💡 **ENHANCEMENT OPPORTUNITIES**

### Phase 1: Visual (Priority)
- [ ] Apply card-based design
- [ ] Fix typography hierarchy
- [ ] Consistent spacing system
- [ ] Proper shadows and hover states

### Phase 2: Interaction (Nice-to-have)
- [ ] Callout card animations on data change
- [ ] Marker pulse on callout hover
- [ ] State tooltips on hover
- [ ] Smooth transitions between COD years

### Phase 3: Features (Future)
- [ ] Compare mode (two scenarios side-by-side)
- [ ] Historical data overlay
- [ ] Export to PDF with current view
- [ ] Saved configurations/bookmarks

---

## 🎨 **FIGMA TEMPLATE STRUCTURE**

### Components to Create

**1. RevenueMap-Section**
- Container frame
- Header component
- Controls card
- Map card shell

**2. RevenueMap-ControlsCard**
- COD Year dropdown
- Horizon dropdown
- Download button
- Responsive variants

**3. RevenueMap-Callout** (with variants)
- CAISO variant (blue)
- ERCOT variant (red)
- SPP variant (green)
- Auto-layout: Vertical, 16px gap
- Size: 240px × auto

**4. RevenueMap-MetricBox**
- Gray-50 background
- Metric display pattern
- Reusable across callouts

### Layer Structure in Figma

```
RevenueMap-Callout (Component)
├── Card-Container (Auto-layout vertical, 16px gap, p-24px)
│   ├── Header-Group (Auto-layout horizontal, justify-between)
│   │   ├── Location-Info (Auto-layout horizontal, gap-8px)
│   │   │   ├── Dot (12×12, circle, [color property])
│   │   │   └── Location-Name (Text, 16px, semibold)
│   │   └── Total-Value (Text, 18px, bold, mono, [color property])
│   ├── Region (Text, 12px, gray-500)
│   ├── Divider (1px, gray-100)
│   ├── Energy-Box (Component: Metric-Box-Featured)
│   │   ├── Label
│   │   ├── Value + Duration-Select
│   │   └── Unit
│   ├── Secondary-Grid (Auto-layout horizontal, 2 columns, gap-12px)
│   │   ├── AS-Box (Component: Metric-Box-Small)
│   │   └── Capacity-Box (Component: Metric-Box-Small)
│   ├── Divider-Bold (2px, gray-200)
│   └── Total-Section (Auto-layout horizontal, justify-between)
│       ├── Label ("TOTAL REVENUE")
│       └── Value (20px, bold, mono, [color property])
```

---

## 🚀 **ROLLOUT PLAN**

### Week 1: Foundation
1. Update section structure (header, padding, background)
2. Redesign controls card
3. Apply proper spacing system

### Week 2: Callouts
1. Rebuild callout card component
2. Apply typography system
3. Implement hover states
4. Add proper shadows

### Week 3: Polish
1. Refine connecting lines
2. Optimize responsive behavior
3. Test interactions
4. Mobile optimization

### Week 4: QA
1. Cross-browser testing
2. Accessibility audit
3. Performance check
4. User feedback

---

## 📝 **SUCCESS METRICS**

**Visual Consistency:**
- ✅ Matches Market Performance Overview aesthetic
- ✅ Feels like part of unified design system
- ✅ Professional, enterprise-ready appearance

**Usability:**
- ✅ Clear visual hierarchy
- ✅ Easy to scan and compare locations
- ✅ Intuitive interactions
- ✅ Works well on all devices

**Technical:**
- ✅ No performance degradation
- ✅ Maintains all current functionality
- ✅ Clean, maintainable code
- ✅ Reusable components

---

**Transform your map from functional tool to design system showcase!** 🗺️✨
