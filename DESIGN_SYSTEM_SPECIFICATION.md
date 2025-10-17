# GridStor Analytics Design System Specification
## Based on Market Performance Overview Section

---

## 🎨 **DESIGN PHILOSOPHY**

**Core Principles:**
- Clean, professional enterprise aesthetic
- Data-first approach with clear hierarchy
- Subtle interactions that enhance without distracting
- White space as a design element
- Monospaced numbers for data readability

**Visual Identity:**
- Minimalist with purposeful accents
- Floating card metaphor for data containers
- Soft shadows for depth without heaviness
- Color-coded accents for categorization

---

## 📐 **LAYOUT STRUCTURE**

### Section Anatomy

```
┌─────────────────────────────────────────────────────────┐
│  SECTION CONTAINER (py-12, bg-white)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  CONTENT WRAPPER (max-w-7xl, centered)            │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  HEADER                                      │  │  │
│  │  │  • Title (text-2xl, bold)                   │  │  │
│  │  │  • Description (text-base, gray)            │  │  │
│  │  │  └─ Spacing: mb-8                           │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  CARD GRID (3 columns on desktop)           │  │  │
│  │  │  └─ Gap: 1.5rem (24px)                      │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Spacing System (8px base unit)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing (icon gaps) |
| `space-2` | 8px | Component internal spacing |
| `space-3` | 12px | Small gaps |
| `space-4` | 16px | Standard spacing |
| `space-6` | 24px | Card gaps, section spacing |
| `space-8` | 32px | Large section spacing |
| `space-12` | 48px | Section vertical padding |

### Container System

**Max Width:** 1280px (max-w-7xl)  
**Horizontal Padding:**
- Mobile: 16px (px-4)
- Tablet: 24px (sm:px-6)
- Desktop: 32px (lg:px-8)

**Section Padding:**
- Vertical: 48px (py-12)
- Background: Pure white (#FFFFFF)

---

## 🎴 **CARD COMPONENT SPECIFICATION**

### Card Container

**Dimensions:**
- Width: Fluid (fills grid column)
- Min-height: Auto (content-driven)
- Aspect ratio: ~3:4 (portrait orientation)

**Visual Properties:**
```
Background: #FFFFFF (pure white)
Border Radius: 8px (rounded-lg)
Border: 4px solid [ACCENT COLOR] (left edge only)
Box Shadow (default): 0 1px 3px rgba(0,0,0,0.1)
Box Shadow (hover): 0 12px 30px rgba(0,0,0,0.1)
Padding: 24px (p-6)
```

**Hover Animation:**
```
Property: transform, box-shadow
Duration: 200ms
Easing: ease-in-out
Transform: translateY(-3px)
Shadow: Increase from subtle to prominent
```

### Card Accent System

**Left Border (4px):**
- CAISO: `#3B82F6` (blue-500)
- ERCOT: `#EF4444` (red-500)
- SPP: `#10B981` (green-500)
- Custom: Use brand color

**Purpose:** Category identification at a glance

---

## 🎯 **TYPOGRAPHY SYSTEM**

### Fonts

**Primary Font:** Inter
- Usage: All text content
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Source: Google Fonts

**Monospace Font:** JetBrains Mono
- Usage: Numbers, data values, metrics
- Weights: 400, 500, 600, 700
- Source: Google Fonts
- Fallback: 'Consolas', 'Monaco', monospace

### Type Scale & Hierarchy

| Element | Size | Weight | Color | Line Height | Letter Spacing |
|---------|------|--------|-------|-------------|----------------|
| **Section Title** | 24px (1.5rem) | Bold (700) | #2A2A2A | 1.2 | -0.01em |
| **Section Description** | 16px (1rem) | Regular (400) | #6B7280 | 1.5 | 0 |
| **Card Title (Market)** | 20px (1.25rem) | Semibold (600) | #1F2937 | 1.2 | -0.01em |
| **Data Label** | 12px (0.75rem) | Medium (500) | #6B7280 | 1.3 | 0.05em (uppercase) |
| **Primary Metric** | 18px (1.125rem) | Bold (700) | #111827 | 1.2 | 0 |
| **Secondary Metric** | 16px (1rem) | Bold (700) | #111827 | 1.2 | 0 |
| **Small Text** | 12px (0.75rem) | Regular (400) | #9CA3AF | 1.4 | 0 |
| **Badge Text** | 12px (0.75rem) | Regular (400) | #4B5563 | 1 | 0 |

### Text Treatment Rules

**Data Labels:**
- Always UPPERCASE
- Increased letter-spacing (0.05em)
- Medium weight (500)
- Gray-500 color (#6B7280)

**Numeric Values:**
- Always use monospace font
- Bold weight for prominence
- Include units in smaller, regular-weight text below

**Status Indicators (YoY Change):**
- Positive: Green-600 (#059669)
- Negative: Red-600 (#DC2626)
- Include arrow icon (16px)
- Semibold weight

---

## 🎨 **COLOR PALETTE**

### Primary Colors (Backgrounds)

```
Pure White:     #FFFFFF
Off-White:      #F9FAFB (alternative section background)
```

### Text Colors

```
Heading Primary:   #2A2A2A (near-black)
Body Primary:      #1F2937 (gray-800)
Body Secondary:    #4B5563 (gray-600)
Label/Caption:     #6B7280 (gray-500)
Muted:            #9CA3AF (gray-400)
```

### Accent Colors (Market Categories)

```
Blue (CAISO):    #3B82F6 (blue-500)
Red (ERCOT):     #EF4444 (red-500)
Green (SPP):     #10B981 (green-500)
Purple (Admin):  #8B5CF6 (purple-600)
```

### Data Visualization Colors

```
Positive:        #059669 (green-600)
Negative:        #DC2626 (red-600)
Warning:         #F59E0B (amber-500)
Info:            #3B82F6 (blue-500)
```

### Background Tints (Data Boxes)

```
Neutral Box:     #F9FAFB (gray-50)
Success Box:     #ECFDF5 (green-50)
Warning Box:     #FEF3C7 (yellow-50)
Info Box:        #EFF6FF (blue-50)
```

### Border Colors

```
Default:         #E5E7EB (gray-200)
Divider:         #F3F4F6 (gray-100)
Accent:          [Market accent colors]
```

---

## 📦 **CARD INTERNAL STRUCTURE**

### 1. Timestamp Bar (Top)
```
Height: Auto
Padding: 12px bottom, 16px top
Border: 1px solid gray-100 (bottom only)
Margin: 0 0 16px 0

Content:
  - Clock icon (12px, gray-500)
  - Text: "Last updated: [timestamp]"
  - Font: 12px, gray-500
  - Flex: items-center, gap-4px
```

### 2. Header Section
```
Margin: 0 0 24px 0
Flex: justify-between, items-start

Left Side:
  - Market name (20px, semibold, gray-800)
  - Badge (12px, gray-600 bg, rounded, px-8px py-4px, monospace)
  - Flex gap: 12px

Right Side:
  - YoY indicator
  - Icon (16px) + Text (14px, semibold)
  - Color: Green (positive) / Red (negative)
```

### 3. Location Selector (Optional)
```
Width: 100%
Height: 40px
Margin: 0 0 16px 0
Background: gray-50
Border: 1px solid gray-200
Border radius: 6px
Padding: 8px 12px
```

### 4. Metrics Grid (2×2 or custom)
```
Display: Grid
Columns: 2
Gap: 16px
Margin: 0 0 24px 0

Each Metric Box:
  Background: gray-50
  Border radius: 6px
  Padding: 12px
  
  Label: 12px, uppercase, gray-500, mb-4px
  Value: 18px, bold, monospace, gray-900
  Unit: 12px, gray-600
```

### 5. Highlighted Metric
```
Background: yellow-50 (or appropriate tint)
Border radius: 6px
Padding: 12px
Margin: 0 0 24px 0

Full width (spans both columns)
Same text hierarchy as metric boxes
```

### 6. Summary Section
```
Border: 1px solid gray-200 (top only)
Padding: 16px top
Margin: 0 0 16px 0

Flex: justify-between, items-center
Left: Main metric display
Right: Comparison metric
```

### 7. Final Highlight Box
```
Background: green-50 (success context)
Border radius: 6px
Padding: 16px

Grid: 2 columns, gap-16px
Label: 12px, uppercase, gray-600, mb-8px
Values: 16px, bold, monospace
```

---

## 📱 **RESPONSIVE BEHAVIOR**

### Breakpoints

```
Mobile:     < 640px  (1 column)
Tablet:     640-1024px (2 columns)
Desktop:    > 1024px (3 columns)
```

### Grid Behavior

**Mobile (< 640px):**
- Cards stack vertically
- Full width minus 16px padding each side
- Gap between cards: 24px

**Tablet (640-1024px):**
- 2 columns
- Gap: 24px
- Third card spans below or wraps

**Desktop (> 1024px):**
- 3 columns
- Gap: 24px
- Even distribution

### Card Scaling

**Cards maintain:**
- Fixed padding (24px) at all sizes
- Proportional font sizes
- Same shadow and hover effects
- Internal spacing ratios

---

## ✨ **INTERACTION DESIGN**

### Hover State (Cards)

```
Trigger: Mouse over card
Duration: 200ms
Easing: ease-in-out

Changes:
1. Transform: translateY(-3px)
2. Box Shadow: 0 12px 30px rgba(0,0,0,0.1)
3. Cursor: default (not clickable by default)

Notes:
- Subtle lift creates "floating" effect
- Shadow grows more prominent
- No color changes (maintains professionalism)
- Smooth animation prevents jarring movement
```

### Active/Focus States

```
If card is clickable:
  - Add cursor: pointer
  - On click: Add 2px border in accent color
  - Slight scale down (0.98) on mousedown
  - Return to hover state on mouseup

If interactive elements inside:
  - Maintain card hover independently
  - Element-specific hover states (buttons, dropdowns)
```

---

## 🔢 **DATA DISPLAY PATTERNS**

### Metric Box Pattern

**Use for:** Individual data points with labels and units

```
Structure:
┌─────────────────────┐
│ LABEL (uppercase)   │ ← 12px, gray-500, medium
│ $7.85               │ ← 18px, bold, monospace, gray-900
│ $/kW-month          │ ← 12px, regular, gray-600
└─────────────────────┘
```

**Background:** gray-50  
**Padding:** 12px  
**Border radius:** 6px

### Comparison Display Pattern

**Use for:** Showing metric vs. benchmark

```
Structure:
┌─────────────────────────────────────┐
│ Projected Total             vs Forecast│
│ $8.32                       +0.45     │
│ $/kW-month                            │
└─────────────────────────────────────┘
```

**Layout:** Flex, justify-between  
**Colors:** Green (positive) / Red (negative) for comparison value

### Badge Pattern

**Use for:** Categories, tags, status indicators

```
Visual:
┌─────┐
│ TB4 │
└─────┘
```

**Background:** gray-100  
**Text:** gray-600, 12px, monospace  
**Padding:** 4px horizontal, 2px vertical  
**Border radius:** 4px

---

## 📋 **FIGMA SETUP INSTRUCTIONS**

### 1. Create Color Styles

**Base Colors:**
- White / #FFFFFF
- Gray-50 / #F9FAFB
- Gray-100 / #F3F4F6
- Gray-200 / #E5E7EB
- Gray-400 / #9CA3AF
- Gray-500 / #6B7280
- Gray-600 / #4B5563
- Gray-800 / #1F2937
- Gray-900 / #111827
- Near-Black / #2A2A2A

**Accent Colors:**
- Blue-500 / #3B82F6
- Red-500 / #EF4444
- Green-500 / #10B981
- Green-600 / #059669
- Red-600 / #DC2626
- Purple-600 / #8B5CF6

**Tint Colors:**
- Green-50 / #ECFDF5
- Yellow-50 / #FEF3C7
- Blue-50 / #EFF6FF

### 2. Create Text Styles

**Set up these character styles:**
- Display/Section Title (24px, Bold, Near-Black)
- Section Description (16px, Regular, Gray-600)
- Card Title (20px, Semibold, Gray-800)
- Data Label (12px, Medium, Gray-500, Uppercase, +5% letter-spacing)
- Metric Large (18px, Bold, Monospace, Gray-900)
- Metric Medium (16px, Bold, Monospace, Gray-900)
- Body Text (14px, Regular, Gray-600)
- Small Text (12px, Regular, Gray-400)
- Badge (12px, Regular, Monospace, Gray-600)

### 3. Create Effect Styles

**Shadows:**
- Card Default: 0px 1px 3px rgba(0,0,0,0.1)
- Card Hover: 0px 12px 30px rgba(0,0,0,0.1)

### 4. Create Component Library

**Components to create:**

**a) Section Container**
- Auto-layout: Vertical
- Padding: 48px vertical
- Max-width: 1280px
- Background: White

**b) Section Header**
- Auto-layout: Vertical
- Gap: 8px
- Margin bottom: 32px

**c) Card Frame**
- Size: 400px × auto
- Padding: 24px
- Border radius: 8px
- Background: White
- Left border: 4px solid [variant property]
- Shadow: Card Default style
- Auto-layout: Vertical, 16px gap

**d) Metric Box**
- Size: Fill × auto
- Padding: 12px
- Border radius: 6px
- Background: Gray-50
- Auto-layout: Vertical, 4px gap

**e) Badge Component**
- Size: Hug × Hug
- Padding: 4px horizontal, 2px vertical
- Border radius: 4px
- Background: Gray-100

### 5. Create Auto-Layout Rules

**Card Grid:**
- Type: Grid
- Columns: 3 (desktop), 2 (tablet), 1 (mobile)
- Column gap: 24px
- Row gap: 24px
- Fill: horizontal

**Card Internal:**
- Type: Auto-layout vertical
- Gap: 16px (sections), 24px (major sections)
- Padding: 24px
- Alignment: Fill container width

---

## 📐 **COMPONENT VARIANTS**

### Card Accent Colors

Create component variants for:
- Blue (CAISO)
- Red (ERCOT)
- Green (SPP)
- Purple (Admin)
- Gray (Neutral)

**Property:** Left border color  
**Everything else:** Identical

### Metric Box Backgrounds

Create variants for:
- Neutral (gray-50)
- Success (green-50)
- Warning (yellow-50)
- Info (blue-50)

### Status Indicators

Create variants for:
- Positive (Green-600, up arrow)
- Negative (Red-600, down arrow)
- Neutral (Gray-600, no arrow)

---

## 🎨 **DESIGN TOKENS (for Developers)**

```css
/* Spacing */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;

/* Typography */
--font-primary: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */

/* Border Radius */
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 12px 30px rgba(0,0,0,0.1);

/* Transitions */
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

---

## 🎯 **USAGE GUIDELINES**

### When to Use This Pattern

**✅ Good for:**
- Dashboard sections
- Data-heavy displays
- Multi-metric comparisons
- Category-based content (markets, products, users)
- Overview screens
- Analytics displays

**❌ Not ideal for:**
- Long-form content (articles, documentation)
- Single-item focus screens
- Forms and input-heavy interfaces
- Marketing hero sections

### Consistency Rules

**Always maintain:**
1. 24px card padding (never change)
2. 16px gap between internal sections
3. Monospace for all numeric data
4. Uppercase + tracking for labels
5. Left border accent for categorization
6. White background (never use color fills on cards)
7. Gray-50 for metric box backgrounds
8. 200ms transition timing

**Never:**
1. Mix font families within a card
2. Use multiple accent colors on one card
3. Add heavy borders or outlines
4. Use bright background colors
5. Stack shadows (one per card)
6. Animate color changes on hover

---

## 🔄 **EXTENDING THE SYSTEM**

### Adding New Card Types

**Follow this template:**
1. Use same card container structure
2. Maintain 24px padding
3. Choose appropriate accent color
4. Use metric box pattern for data
5. Keep hover behavior consistent
6. Respect internal spacing system (16px/24px)

### Creating Section Variations

**Allowed modifications:**
- Section background (white or gray-50)
- Grid columns (1-4 columns)
- Card content (data structure)
- Accent colors (maintain saturation level)

**Fixed elements:**
- Section header format
- Card hover behavior
- Typography hierarchy
- Shadow system
- Border radius values

---

## 📝 **DESIGN CHECKLIST**

Before finalizing any new component based on this system:

- [ ] Card has 24px padding on all sides
- [ ] Left border accent is 4px wide
- [ ] Card has white background
- [ ] Hover state: lift 3px + shadow increase
- [ ] All numbers use JetBrains Mono font
- [ ] All labels are uppercase with letter-spacing
- [ ] Metric boxes have gray-50 background
- [ ] Internal spacing uses 16px or 24px increments
- [ ] Typography follows established scale
- [ ] Colors come from defined palette
- [ ] Shadows match system (no custom shadows)
- [ ] Border radius is 6px (boxes) or 8px (cards)
- [ ] Responsive grid follows breakpoint rules
- [ ] Section has proper max-width (1280px)
- [ ] Maintains professional, minimal aesthetic

---

## 🎨 **QUICK REFERENCE CARD**

```
CARD ANATOMY:
┌────────────────────────────────────────┐
│ padding: 24px                          │
│ border-left: 4px [accent]              │
│ ┌────────────────────────────────────┐ │
│ │ TIMESTAMP (12px, gray-500)         │ │
│ │ border-bottom: 1px gray-100        │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ TITLE (20px, bold) │ YoY (+/-)    │ │
│ │ + BADGE (12px)     │ (14px)       │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────┐ ┌────────┐                │
│ │ METRIC │ │ METRIC │ (18px bold)   │
│ │  BOX   │ │  BOX   │ gray-50 bg    │
│ └────────┘ └────────┘                │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ HIGHLIGHTED METRIC               │  │
│ │ (yellow-50 or green-50 bg)       │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ─────────────────── (divider)         │
│                                        │
│ SUMMARY SECTION                        │
│                                        │
└────────────────────────────────────────┘

HOVER: translateY(-3px) + shadow-lg
```

---

## 💡 **PRO TIPS FOR FIGMA**

1. **Use Auto-Layout aggressively** - Makes responsive design easier
2. **Create component variants** for accent colors - One component, multiple uses
3. **Set up grid styles** - 3-column with 24px gap becomes reusable
4. **Use text styles religiously** - Never manually style text twice
5. **Build from smallest to largest** - Metric box → Card → Section
6. **Leverage constraints** - Cards should "fill container" width
7. **Test responsive early** - Use Figma's frame presets (Desktop/Tablet/Mobile)
8. **Document your components** - Add descriptions to help team understand usage
9. **Version your system** - Track changes to maintain consistency
10. **Create a master file** - One source of truth for all components

---

**This is your design foundation. Every new section should feel like it belongs to the same family while serving different purposes.**
