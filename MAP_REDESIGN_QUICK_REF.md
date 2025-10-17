# Revenue Map Redesign - Developer Quick Reference

## 🚀 **COPY-PASTE VALUES**

### Container Structure
```jsx
// Section
className="py-12 bg-white"

// Content wrapper
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

// Section header
<div className="mb-8">
  <h2 className="text-2xl font-bold text-[#2A2A2A] mb-2">
  <p className="text-gray-600">
</div>
```

### Controls Card
```jsx
className="bg-white rounded-lg shadow-sm p-6 mb-6"

// Button
className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-sm hover:-translate-y-0.5"
```

### Map Card
```jsx
className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md relative min-h-[600px]"
```

### Callout Card
```jsx
<motion.div
  whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
  className="absolute bg-white rounded-lg p-6 border-l-4 shadow-sm transition-all duration-200"
  style={{
    borderColor: location.color,
    width: '240px'
  }}
>
```

## 🎨 **EXACT COLOR VALUES**

```javascript
const colors = {
  // Backgrounds
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  
  // Text
  nearBlack: '#2A2A2A',
  gray800: '#1F2937',
  gray600: '#4B5563',
  gray500: '#6B7280',
  
  // Markets
  caiso: '#3B82F6',   // Blue
  ercot: '#EF4444',   // Red
  spp: '#10B981',     // Green
  
  // Borders
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
}
```

## 📏 **EXACT SPACING VALUES**

```javascript
const spacing = {
  cardPadding: '24px',        // p-6
  sectionPadding: '48px',     // py-12
  cardGap: '24px',            // gap-6
  internalGap: '16px',        // gap-4
  smallGap: '12px',           // gap-3
  tinyGap: '8px',             // gap-2
  
  calloutWidth: '240px',
  controlsHeight: '40px',     // h-10
}
```

## 🔤 **EXACT TYPOGRAPHY**

```javascript
// Section title
className="text-2xl font-bold text-[#2A2A2A]"
// 24px, weight 700

// Section description
className="text-base text-gray-600"
// 16px, weight 400

// Callout location name
className="text-base font-semibold text-gray-800"
// 16px, weight 600

// Callout region
className="text-xs text-gray-500"
// 12px, weight 400

// Data labels
className="text-xs uppercase tracking-wider font-medium text-gray-500"
// 12px, weight 500, uppercase, letter-spacing: 0.05em

// Energy value (featured)
className="text-lg font-bold font-mono text-gray-900"
style={{ fontFamily: "'JetBrains Mono', monospace" }}
// 18px, weight 700

// Secondary values (AS, Capacity)
className="text-sm font-bold font-mono text-gray-900"
// 14px, weight 700

// Total value
className="text-xl font-bold font-mono"
style={{ color: location.color }}
// 20px, weight 700, market color

// Units
className="text-xs text-gray-600"
// 12px, weight 400
```

## 📦 **EXACT SHADOW VALUES**

```javascript
const shadows = {
  // Resting state
  default: '0 1px 3px rgba(0,0,0,0.1)',
  
  // Hover state (callouts)
  hover: '0 12px 30px rgba(0,0,0,0.1)',
  
  // Hover state (map card)
  subtle: '0 4px 12px rgba(0,0,0,0.08)',
}
```

## 🎯 **METRIC BOX PATTERN**

### Featured (Energy)
```jsx
<div className="bg-gray-50 rounded-md p-3 mb-4">
  <div className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-1">
    ENERGY ARBITRAGE
  </div>
  <div className="flex items-center justify-between">
    <div>
      <div className="text-lg font-bold font-mono text-gray-900">
        ${breakdown.energyArb}
      </div>
      <div className="text-xs text-gray-600">$/kW-month</div>
    </div>
    <Select {...props}>
      {/* Duration dropdown */}
    </Select>
  </div>
</div>
```

### Standard (AS, Capacity)
```jsx
<div className="bg-gray-50 rounded-md p-3">
  <div className="text-[10px] uppercase tracking-wider font-medium text-gray-500 mb-1">
    AS
  </div>
  <div className="text-sm font-bold font-mono text-gray-900">
    ${breakdown.as}
  </div>
  <div className="text-[10px] text-gray-600">$/kW-month</div>
</div>
```

### Grid Layout
```jsx
<div className="grid grid-cols-2 gap-3 mb-4">
  {/* AS box */}
  {/* Capacity box */}
</div>
```

## 🎨 **CALLOUT CARD STRUCTURE**

```jsx
<motion.div {...hoverProps} className={cardClasses}>
  {/* Header */}
  <div className="flex items-center justify-between mb-1">
    <div className="flex items-center gap-2">
      <div 
        className="w-3 h-3 rounded-full" 
        style={{ backgroundColor: location.color }}
      />
      <h3 className="text-base font-semibold text-gray-800">
        {key}
      </h3>
    </div>
    <div 
      className="text-lg font-bold font-mono"
      style={{ color: location.color }}
    >
      ${breakdown.total}
    </div>
  </div>
  
  {/* Region */}
  <div className="text-xs text-gray-500 mb-3">
    {location.region}
  </div>
  
  {/* Divider */}
  <div className="border-t border-gray-100 mb-4" />
  
  {/* Energy (featured) */}
  <div className="bg-gray-50 rounded-md p-3 mb-4">
    {/* ... */}
  </div>
  
  {/* AS & Capacity grid */}
  <div className="grid grid-cols-2 gap-3 mb-4">
    {/* ... */}
  </div>
  
  {/* Total divider */}
  <div className="border-t-2 border-gray-200 pt-4">
    <div className="flex items-center justify-between">
      <div className="text-xs uppercase tracking-wider font-semibold text-gray-600">
        TOTAL REVENUE
      </div>
      <div 
        className="text-xl font-bold font-mono"
        style={{ color: location.color }}
      >
        ${breakdown.total}
      </div>
    </div>
  </div>
</motion.div>
```

## 🎯 **FRAMER MOTION CONFIG**

```javascript
const hoverAnimation = {
  whileHover: { 
    y: -3, 
    boxShadow: "0 12px 30px rgba(0,0,0,0.1)"
  },
  transition: {
    duration: 0.2,
    ease: "easeInOut"
  }
}
```

## 📱 **RESPONSIVE BREAKPOINTS**

```javascript
// Tailwind classes
'sm:px-6'    // >= 640px
'lg:px-8'    // >= 1024px
'lg:grid-cols-3'  // >= 1024px

// Custom breakpoints
const breakpoints = {
  mobile: '< 640px',
  tablet: '640px - 1024px',
  desktop: '> 1024px'
}
```

## 🎨 **CONNECTING LINES**

```jsx
<svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
  <line
    x1={`${markerX}%`}
    y1={`${markerY}%`}
    x2={`${calloutX}%`}
    y2={`${calloutY}%`}
    stroke={location.color}
    strokeWidth="1.5"
    strokeDasharray="3,3"
    opacity="0.4"
  />
</svg>
```

## ✅ **IMPLEMENTATION CHECKLIST**

```markdown
□ Section: white bg, py-12
□ Container: max-w-7xl, centered
□ Header: text-2xl title, text-base subtitle
□ Controls card: white, rounded-lg, shadow-sm, p-6
□ Map card: white, rounded-lg, shadow-sm, p-6, hover effect
□ Callout width: 240px (not 180px)
□ Callout padding: 24px (not 12px)
□ Border: left only, 4px, market color
□ Hover: lift 3px, shadow enhance
□ Numbers: JetBrains Mono font
□ Labels: uppercase, tracking-wider
□ Total: 20px, bold, market color (shown twice)
□ Energy box: featured (gray-50 bg)
□ AS/Capacity: grid 2 columns
□ Shadows: design system values
□ Transitions: 200ms ease-in-out
```

## 🚀 **BEFORE YOU START**

1. **Install Framer Motion** (if not already):
   ```bash
   npm install framer-motion
   ```

2. **Import required**:
   ```javascript
   import { motion } from 'framer-motion';
   import { Download } from 'lucide-react';
   ```

3. **Check fonts loaded** (in Layout.astro):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```

## 💡 **PRO TIPS**

1. **Start with structure** - Get spacing right first
2. **Then typography** - Apply font system
3. **Then colors** - Add market color accents
4. **Finally interactions** - Add hover states last
5. **Test mobile early** - Don't wait until the end

---

**Everything you need in one place!** 🎯
