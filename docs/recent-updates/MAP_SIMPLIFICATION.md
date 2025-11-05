# Revenue Forecast Map - Simplification & Curve Hierarchy

**Date:** November 1, 2025  
**Status:** ✅ Complete

---

## 🎯 Overview

Simplified the Revenue Forecast Map by removing selectors and implementing a curve hierarchy system (GridStor P50 → Aurora Base → ASCEND).

---

## 📋 Changes Made

### 1. **Removed UI Controls**
- ❌ Removed COD Year selector
- ❌ Removed Forecast Horizon selector  
- ❌ Removed Duration selectors from each callout box
- ✅ Kept only the Download Data button

### 2. **Implemented Curve Hierarchy**

The system now follows this priority for curve selection:
1. **GridStor P50** (Primary - preferred)
2. **Aurora Base** (Secondary fallback)
3. **ASCEND** (Tertiary fallback)

Each location displays which curve source is being used at the bottom of the callout box.

### 3. **Fixed Duration to 4-Hour**

- All locations now show 4-hour duration curves only
- Removed the ability to switch between 2h/4h/8h
- Label shows "ENERGY ARBITRAGE (4h)" to be clear

### 4. **Simplified Revenue Calculation**

**Before:**
```typescript
// Complex calculation with multipliers
const codMultiplier = 1 + (parseInt(codYear) - 2026) * 0.03;
const horizonMultiplier = 1 + (parseInt(horizon) - 1) * 0.02;
const energyArb = baseEnergyArb * codMultiplier * horizonMultiplier;
```

**After:**
```typescript
// Direct values from database
const energyArb = location.curves.energyArbitrage;
const as = location.curves.ancillaryServices;
const capacity = location.curves.capacity;
const total = energyArb + as + capacity;
```

### 5. **Updated Data Structure**

**API Response (map-locations.ts):**
```typescript
interface LocationData {
  id: string;
  name: string;
  market: 'CAISO' | 'ERCOT' | 'SPP';
  region: string;
  coordinates: [number, number];
  calloutPosition: { x: number; y: number };
  curves: {
    energyArbitrage: number;        // Single value (4h)
    ancillaryServices: number;      // Fixed AS value
    capacity: number;                // Fixed capacity value
  };
  curveSource: 'GridStor P50' | 'Aurora Base' | 'ASCEND';
  metadata?: {
    dbLocationName?: string;
    aliases?: string[];
  };
}
```

### 6. **Cleaner UI**

**Callout Box Layout:**
```
┌─────────────────────────┐
│ ● NP15           $18.84 │ ← Location name + Total
│ Northern California     │ ← Region
├─────────────────────────┤
│ ENERGY ARBITRAGE (4h)   │
│ $10.76                  │ ← Fixed duration
│ $/kW-month              │
├─────────────────────────┤
│ AS        CAPACITY      │
│ $1.08     $7.00         │
├─────────────────────────┤
│ TOTAL           $18.84  │
├─────────────────────────┤
│ GridStor P50            │ ← Curve source indicator
└─────────────────────────┘
```

---

## 🗄️ Database Integration Notes

### When Connecting to Real Database

The API should query with COALESCE to implement the hierarchy:

```sql
SELECT 
  location_name,
  market,
  coordinates,
  -- Use first available curve in priority order
  COALESCE(gridstor_p50_4h, aurora_base_4h, ascend_4h) as ea_value,
  COALESCE(gridstor_p50_as, aurora_base_as, ascend_as) as as_value,
  COALESCE(gridstor_p50_capacity, aurora_base_capacity, ascend_capacity) as capacity_value,
  -- Track which source was used
  CASE 
    WHEN gridstor_p50_4h IS NOT NULL THEN 'GridStor P50'
    WHEN aurora_base_4h IS NOT NULL THEN 'Aurora Base'
    WHEN ascend_4h IS NOT NULL THEN 'ASCEND'
  END as curve_source
FROM curve_locations
WHERE active = true;
```

### Expected Database Schema

```sql
CREATE TABLE curve_locations (
  id                    SERIAL PRIMARY KEY,
  location_name         VARCHAR(100),
  db_location_name      VARCHAR(100),
  market                VARCHAR(20),
  region                VARCHAR(100),
  longitude             NUMERIC(10, 6),
  latitude              NUMERIC(10, 6),
  
  -- GridStor P50 curves (priority 1)
  gridstor_p50_4h       NUMERIC(10, 2),
  gridstor_p50_as       NUMERIC(10, 2),
  gridstor_p50_capacity NUMERIC(10, 2),
  
  -- Aurora Base curves (priority 2)
  aurora_base_4h        NUMERIC(10, 2),
  aurora_base_as        NUMERIC(10, 2),
  aurora_base_capacity  NUMERIC(10, 2),
  
  -- ASCEND curves (priority 3)
  ascend_4h             NUMERIC(10, 2),
  ascend_as             NUMERIC(10, 2),
  ascend_capacity       NUMERIC(10, 2),
  
  active                BOOLEAN DEFAULT true,
  updated_at            TIMESTAMP DEFAULT NOW()
);
```

---

## 📊 Current Mock Data

All locations currently show **GridStor P50** curves with 4h duration:

### CAISO
| Location | EA (4h) | AS | Capacity | Total |
|----------|---------|-----|----------|-------|
| NP15 | $9.12 | $1.08 | $7.00 | $17.20 |
| Goleta | $8.89 | $1.05 | $7.00 | $16.94 |
| SP15 | $9.34 | $1.10 | $7.00 | $17.44 |

### ERCOT  
| Location | EA (4h) | AS | Capacity | Total |
|----------|---------|-----|----------|-------|
| Houston | $10.12 | $1.19 | $0.00 | $11.31 |
| Hidden Lakes | $9.89 | $1.17 | $0.00 | $11.06 |
| Gunnar | $9.23 | $1.09 | $0.00 | $10.32 |
| South Hub | $9.45 | $1.12 | $0.00 | $10.57 |

### SPP
| Location | EA (4h) | AS | Capacity | Total |
|----------|---------|-----|----------|-------|
| North Hub | $7.12 | $0.84 | $5.00 | $12.96 |
| South Hub SPP | $7.45 | $0.88 | $5.00 | $13.33 |

---

## ✨ Benefits

1. **Simpler UI** - Removed confusing selectors
2. **Cleaner Data** - Direct database values, no calculations
3. **Transparent Source** - Shows which curve is being used
4. **Easier Maintenance** - Less complex logic
5. **Better UX** - Less cognitive load for users
6. **Flexible Fallbacks** - Automatic hierarchy for missing data

---

## 🔄 Migration Path

If you need to add selectors back in the future:

1. **Duration Selector**: Update API to return all durations, add selector UI back
2. **COD Year**: Add year parameter to API, apply growth multipliers
3. **Forecast Horizon**: Add horizon parameter, apply time-decay logic

The infrastructure is still there, just simplified.

---

## 📁 Files Modified

1. **src/pages/api/map-locations.ts**
   - Updated `LocationData` interface
   - Simplified curve structure to single values
   - Added `curveSource` field
   - Added SQL example for hierarchy

2. **src/components/RevenueForcastMap.tsx**
   - Removed COD Year state
   - Removed Forecast Horizon state
   - Removed Duration state
   - Simplified `getRevenueBreakdown()` function
   - Removed duration selectors from UI
   - Added curve source indicator
   - Updated CSV export to include curve source

---

## 🧪 Testing

After connecting real database:

```bash
# Test the API
curl http://localhost:4321/api/map-locations | jq

# Check for:
✅ All locations have curveSource field
✅ Values are realistic
✅ Hierarchy works (P50 > Aurora > ASCEND)
✅ Fallback logic works when P50 unavailable
```

---

## 📝 CSV Export

The downloaded CSV now includes:

```csv
Location,DB_Location_Name,Market,Region,Curve_Source,Duration,Energy_Arbitrage,Ancillary_Services,Capacity,Total_Revenue
NP15,TH_NP15_GEN,CAISO,Northern California,GridStor P50,4h,$9.12,$1.08,$7.00,$17.20
```

Key changes:
- ✅ Added `Curve_Source` column
- ✅ Fixed `Duration` to "4h"
- ❌ Removed `COD_Year`
- ❌ Removed `Forecast_Horizon`

---

## 🚀 Next Steps

1. **Connect Real Database** - Implement COALESCE query
2. **Verify Curve Sources** - Ensure GridStor P50 data exists
3. **Add Fallback Logic** - Test Aurora and ASCEND fallbacks
4. **Update Regularly** - Refresh curves as new data arrives

---

**Status:** ✅ Map is now simplified and ready for real curve data integration!

