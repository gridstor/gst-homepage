# Revenue Forecast Map - Database Connection Implementation

**Date:** October 30, 2025  
**Status:** ✅ Core Implementation Complete | 🔄 Ready for Real DB Integration

---

## 🎯 Overview

Successfully implemented a database-driven architecture for the Revenue Forecast Map on the homepage. The map now fetches location and curve data from an API endpoint instead of using hardcoded values.

---

## 📋 Changes Made

### 1. **New API Endpoint** (`src/pages/api/map-locations.ts`)

Created a new server-side API endpoint that:
- ✅ Returns structured location data with revenue curves
- ✅ Includes database location names (metadata.dbLocationName)
- ✅ Supports market filtering (CAISO, ERCOT, SPP)
- ✅ Provides caching for performance (5-minute cache)
- ✅ Returns comprehensive curve data (2h, 4h, 8h durations)

**Endpoint:** `GET /api/map-locations?market=[optional]`

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "id": "caiso_np15",
      "name": "NP15",
      "market": "CAISO",
      "region": "Northern California",
      "coordinates": [-121.4687, 38.5816],
      "curves": {
        "energyArbitrage": {
          "duration2h": 8.45,
          "duration4h": 9.12,
          "duration8h": 9.78
        },
        "ancillaryServices": 0.10,
        "capacity": 7.0
      },
      "metadata": {
        "dbLocationName": "TH_NP15_GEN",
        "aliases": ["Northern California", "NP-15"]
      }
    }
  ],
  "metadata": {
    "total": 9,
    "timestamp": "2025-10-30T...",
    "source": "curve_database"
  }
}
```

### 2. **Updated Map Component** (`src/components/RevenueForcastMap.tsx`)

Completely refactored the map component to:
- ✅ Fetch location data from API on mount
- ✅ Display loading state while fetching
- ✅ Show error states with retry functionality
- ✅ Use database location names as the source of truth
- ✅ Dynamically position callouts based on coordinates
- ✅ Support location metadata (DB names, aliases)
- ✅ Export DB location names in CSV downloads

**Key Features:**
- **Loading State:** Animated spinner with informative message
- **Error Handling:** User-friendly error display with retry button
- **Dynamic Positioning:** Callouts auto-position based on geography
- **Metadata Support:** Hover over location names to see DB name
- **CSV Export:** Includes both display name and DB location name

---

## 🔄 Current Status

### ✅ Completed
1. Created API endpoint structure
2. Updated map component to fetch from API
3. Added loading and error states
4. Implemented database location name mapping
5. Dynamic callout positioning
6. CSV export includes DB names

### 🔄 Next Steps (TODO)

#### **Priority 1: Connect to Real Database**

The API endpoint (`src/pages/api/map-locations.ts`) currently returns mock data. To connect to the real curve database:

1. **Identify the Curve Database:**
   - Where is the curve data stored? (Postgres, another DB?)
   - What tables contain location and curve information?
   - What's the schema structure?

2. **Update API Endpoint:**
   Replace the `getLocationsFromDB()` function with real database queries:
   
   ```typescript
   // Example using Prisma
   const getLocationsFromDB = async (): Promise<LocationData[]> => {
     const curveData = await prisma.curve_locations.findMany({
       include: {
         latest_curves: true,
         location_metadata: true
       }
     });
     
     return curveData.map(loc => ({
       id: loc.id,
       name: loc.display_name,
       market: loc.market,
       region: loc.region,
       coordinates: [loc.longitude, loc.latitude],
       curves: {
         energyArbitrage: {
           duration2h: loc.latest_curves.ea_2h,
           duration4h: loc.latest_curves.ea_4h,
           duration8h: loc.latest_curves.ea_8h
         },
         ancillaryServices: loc.latest_curves.as_percentage,
         capacity: loc.latest_curves.capacity
       },
       metadata: {
         dbLocationName: loc.db_name,
         aliases: loc.location_metadata?.aliases || []
       }
     }));
   };
   ```

3. **Add Database Connection:**
   - Update `.env` with curve database connection string
   - Update Prisma schema if using Prisma
   - Or use direct SQL queries with `pg` library

#### **Priority 2: Real-Time Data Updates**

- Add mechanism to refresh curve data (manual refresh button)
- Display last updated timestamp
- Consider websocket or polling for live updates

#### **Priority 3: Enhanced Features**

- Filter by market (CAISO/ERCOT/SPP buttons)
- Search/filter locations
- Compare multiple locations
- Historical data view
- Curve trend indicators

---

## 🗄️ Database Schema Requirements

Based on the implementation, the database should provide:

### Required Fields:
- `id` - Unique identifier
- `display_name` - Location name shown on map (e.g., "NP15", "Houston")
- `db_location_name` - Original database name (e.g., "TH_NP15_GEN")
- `market` - Market identifier (CAISO, ERCOT, SPP)
- `region` - Human-readable region name
- `longitude` - Geographic coordinate
- `latitude` - Geographic coordinate

### Required Curve Data:
- `energy_arbitrage_2h` - 2-hour duration curve value
- `energy_arbitrage_4h` - 4-hour duration curve value
- `energy_arbitrage_8h` - 8-hour duration curve value
- `ancillary_services_percentage` - AS as % of EA (e.g., 0.10 for 10%)
- `capacity_value` - Capacity revenue value
- `last_updated` - Timestamp of curve data

### Optional Metadata:
- `aliases` - Alternative names for the location
- `notes` - Additional information
- `confidence_level` - Data quality indicator

---

## 📍 Current Locations

The system currently supports these locations:

### CAISO (3 locations)
- **NP15** (TH_NP15_GEN) - Northern California
- **SP15** (TH_SP15_GEN) - Southern California  
- **Goleta** (GOLETA) - Santa Barbara

### ERCOT (4 locations)
- **Houston** (HOUSTON) - Houston Hub
- **Hidden Lakes** (HIDDEN_LAKES) - South of Houston
- **Gunnar** (GUNNAR) - South Central Texas
- **South Hub** (SOUTH_HUB) - Southern Texas

### SPP (2 locations)
- **North Hub** (NORTH_HUB) - Kansas/Northern SPP
- **South Hub SPP** (SOUTH_HUB_SPP) - Oklahoma/Southern SPP

---

## 🔌 API Integration Points

### Current Flow:
```
Homepage → RevenueForcastMap Component → /api/map-locations → Mock Data
```

### Target Flow:
```
Homepage → RevenueForcastMap Component → /api/map-locations → Curve Database → Real Data
```

### External APIs:
- **Curve Viewer API:** `https://gridstor.netlify.app/api/curves/*`
- Currently proxied through main hub at `/api/curves/*`
- May contain curve definitions we can use

---

## 🧪 Testing

### Manual Testing Checklist:
- ✅ Map loads without errors
- ✅ Loading state displays correctly
- ✅ All locations render on map
- ✅ Callouts display accurate data
- ✅ Duration selector works (2h/4h/8h)
- ✅ COD year and horizon adjustments work
- ✅ CSV export includes all data
- ✅ Hover over location shows DB name
- ⏳ Data refreshes from API
- ⏳ Error handling works correctly

### Browser Testing:
- Test in Chrome, Firefox, Safari
- Test responsive layout (mobile/tablet/desktop)
- Verify no console errors

---

## 📊 Database Query Example

If using direct SQL queries:

```sql
SELECT 
  l.id,
  l.display_name,
  l.db_location_name,
  l.market,
  l.region,
  l.longitude,
  l.latitude,
  c.energy_arbitrage_2h,
  c.energy_arbitrage_4h,
  c.energy_arbitrage_8h,
  c.ancillary_services_pct,
  c.capacity_value,
  c.updated_at
FROM curve_locations l
LEFT JOIN latest_curves c ON l.id = c.location_id
WHERE l.active = true
ORDER BY l.market, l.display_name;
```

---

## 🚀 Deployment Notes

### Before Deploying:
1. ✅ Test locally with mock data
2. ⏳ Test with real database connection
3. ⏳ Verify API performance (should be < 500ms)
4. ⏳ Check error handling
5. ⏳ Validate data accuracy

### Environment Variables Needed:
```env
DATABASE_URL="postgresql://..."  # Main database
CURVE_DB_URL="postgresql://..."  # If separate curve database
CACHE_TTL=300                    # Cache time in seconds (default: 5 min)
```

---

## 📝 Code Quality

- ✅ TypeScript types for all data structures
- ✅ Error handling in place
- ✅ Loading states implemented
- ✅ Responsive design maintained
- ✅ No linter errors
- ✅ Clean separation of concerns

---

## 💡 Future Enhancements

1. **Performance:**
   - Add Redis caching layer
   - Implement background data refresh
   - Pre-generate common queries

2. **Features:**
   - Add location details modal
   - Show curve trends (up/down indicators)
   - Add scenario comparison
   - Historical data viewer

3. **Analytics:**
   - Track which locations are viewed most
   - Monitor API performance
   - Alert on stale data

---

## 🤝 Contributing

When updating the database connection:

1. Keep the existing data structure in the API response
2. Ensure DB location names are preserved in metadata
3. Add new fields to the API response if needed
4. Update TypeScript types accordingly
5. Test thoroughly before deploying

---

**Questions or Issues?**
- Check the implementation in `src/pages/api/map-locations.ts`
- Review the component in `src/components/RevenueForcastMap.tsx`
- Consult the Prisma schema or database documentation

---

**Status:** Ready for database integration! 🚀



