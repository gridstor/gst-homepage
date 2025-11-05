# Quick Start: Connecting Real Database to Revenue Forecast Map

**Last Updated:** October 30, 2025  
**Status:** ✅ Ready for Real DB Integration

---

## 🎯 What's Been Done

✅ **API Endpoint Created** - `/api/map-locations` serves location and curve data  
✅ **Map Component Updated** - Fetches from API instead of hardcoded values  
✅ **DB Names Supported** - Metadata tracks database location names  
✅ **Loading/Error States** - Professional UX for data fetching  
✅ **Dynamic Positioning** - Callouts auto-position based on coordinates

---

## 🚀 How to Connect Your Database (3 Steps)

### Step 1: Add Database Connection String

Update `.env` with your curve database:

```env
# If using the same database
DATABASE_URL="postgresql://user:password@host:5432/gridstor"

# If curves are in a separate database
CURVE_DB_URL="postgresql://user:password@host:5432/curves"
```

### Step 2: Update the API Endpoint

Open `src/pages/api/map-locations.ts` and replace the `getLocationsFromDB()` function:

**Option A: Using Prisma (Recommended)**
```typescript
import { prisma } from '../../lib/db';

const getLocationsFromDB = async (): Promise<LocationData[]> => {
  // Update with your actual table/schema names
  const locations = await prisma.curve_locations.findMany({
    include: {
      latest_curves: true
    }
  });
  
  return locations.map(loc => ({
    id: loc.id.toString(),
    name: loc.display_name,           // e.g., "NP15"
    market: loc.market,                // "CAISO", "ERCOT", or "SPP"
    region: loc.region,                // e.g., "Northern California"
    coordinates: [loc.longitude, loc.latitude],
    curves: {
      energyArbitrage: {
        duration2h: loc.latest_curves.ea_2h,
        duration4h: loc.latest_curves.ea_4h,
        duration8h: loc.latest_curves.ea_8h
      },
      ancillaryServices: loc.latest_curves.as_percentage,
      capacity: loc.latest_curves.capacity_value
    },
    metadata: {
      dbLocationName: loc.db_name,     // Original DB name
      aliases: loc.aliases || []
    }
  }));
};
```

**Option B: Using Direct SQL**
```typescript
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const getLocationsFromDB = async (): Promise<LocationData[]> => {
  const result = await pool.query(`
    SELECT 
      l.id,
      l.display_name,
      l.db_name,
      l.market,
      l.region,
      l.longitude,
      l.latitude,
      c.ea_2h,
      c.ea_4h,
      c.ea_8h,
      c.as_percentage,
      c.capacity_value
    FROM curve_locations l
    JOIN latest_curves c ON l.id = c.location_id
    WHERE l.active = true
    ORDER BY l.market, l.display_name
  `);
  
  return result.rows.map(row => ({
    id: row.id.toString(),
    name: row.display_name,
    market: row.market,
    region: row.region,
    coordinates: [row.longitude, row.latitude],
    curves: {
      energyArbitrage: {
        duration2h: parseFloat(row.ea_2h),
        duration4h: parseFloat(row.ea_4h),
        duration8h: parseFloat(row.ea_8h)
      },
      ancillaryServices: parseFloat(row.as_percentage),
      capacity: parseFloat(row.capacity_value)
    },
    metadata: {
      dbLocationName: row.db_name
    }
  }));
};
```

### Step 3: Test It

```bash
# Visit the homepage
http://localhost:4321

# Or test the API directly
curl http://localhost:4321/api/map-locations
```

---

## 📊 Expected Database Schema

Your database should have (or you should map from) these fields:

### Location Table
| Column | Type | Example | Required |
|--------|------|---------|----------|
| `id` | int/uuid | 1 | ✅ |
| `display_name` | varchar | "NP15" | ✅ |
| `db_name` | varchar | "TH_NP15_GEN" | ✅ |
| `market` | varchar | "CAISO" | ✅ |
| `region` | varchar | "Northern California" | ✅ |
| `longitude` | numeric | -121.4687 | ✅ |
| `latitude` | numeric | 38.5816 | ✅ |
| `active` | boolean | true | Optional |

### Curve Data Table
| Column | Type | Example | Required |
|--------|------|---------|----------|
| `location_id` | int/uuid | 1 | ✅ |
| `ea_2h` | numeric | 8.45 | ✅ |
| `ea_4h` | numeric | 9.12 | ✅ |
| `ea_8h` | numeric | 9.78 | ✅ |
| `as_percentage` | numeric | 0.10 | ✅ |
| `capacity_value` | numeric | 7.0 | ✅ |
| `updated_at` | timestamp | 2025-10-30... | Optional |

**Notes:**
- If your table/column names differ, just map them in the code above
- EA = Energy Arbitrage ($/kW-month)
- AS = Ancillary Services (as a decimal, e.g., 0.10 = 10%)
- Capacity = Capacity revenue ($/kW-month)

---

## 🔍 Verify Database Location Names

To ensure DB names are mapped correctly:

1. **Query your database:**
   ```sql
   SELECT db_name, display_name, market FROM curve_locations ORDER BY market, display_name;
   ```

2. **Check the results match these patterns:**
   - CAISO: TH_NP15_GEN, TH_SP15_GEN, etc.
   - ERCOT: HOUSTON, HIDDEN_LAKES, GUNNAR, etc.
   - SPP: NORTH_HUB, SOUTH_HUB_SPP, etc.

3. **Update the API if needed:**
   - DB names should be in `metadata.dbLocationName`
   - Display names should be in `name` field
   - CSV exports will include both

---

## ✅ Testing Checklist

After connecting the database:

### API Test
```bash
# Should return JSON with location data
curl http://localhost:4321/api/map-locations | jq
```

### Expected Response
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
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
        "dbLocationName": "TH_NP15_GEN"
      }
    }
    // ... more locations
  ],
  "metadata": {
    "total": 9,
    "timestamp": "2025-10-30T...",
    "source": "curve_database"
  }
}
```

### UI Test
1. Visit homepage: `http://localhost:4321`
2. ✅ Map should load with spinner
3. ✅ All locations should appear
4. ✅ Click callouts to see data
5. ✅ Change durations (2h/4h/8h)
6. ✅ Download CSV - check DB names included
7. ✅ Hover over location names - tooltip shows DB name

---

## 🐛 Troubleshooting

### "Failed to fetch location data"
- Check database connection string in `.env`
- Verify database is accessible from application
- Check API logs for errors: `npm run dev` output

### "No location data available"
- Database query returned empty results
- Check `active = true` filter if you have one
- Verify locations exist in database

### Wrong data displayed
- Verify column mappings in `getLocationsFromDB()`
- Check data types match (numeric vs string)
- Ensure coordinates are [longitude, latitude] not reversed

### API is slow
- Add database indexes on frequently queried columns
- Adjust cache TTL in API endpoint (default: 5 minutes)
- Consider Redis caching for production

---

## 🎨 Current Locations (Reference)

Make sure your database has entries for:

**CAISO (Blue - #3B82F6):**
- NP15 - Northern California
- SP15 - Southern California
- Goleta - Santa Barbara

**ERCOT (Red - #EF4444):**
- Houston - Houston Hub
- Hidden Lakes - South of Houston
- Gunnar - South Central Texas
- South Hub - Southern Texas

**SPP (Green - #10B981):**
- North Hub - Kansas/Northern SPP
- South Hub SPP - Oklahoma/Southern SPP

---

## 📚 Additional Resources

- **API Implementation:** `src/pages/api/map-locations.ts`
- **Map Component:** `src/components/RevenueForcastMap.tsx`
- **Full Documentation:** `docs/recent-updates/MAP_DATABASE_CONNECTION.md`
- **Prisma Schema:** `prisma/schema.prisma`

---

## 💡 Pro Tips

1. **Start Small:** Test with 2-3 locations first
2. **Check Types:** Ensure numeric fields are actually numeric in DB
3. **Cache Smart:** Adjust cache TTL based on how often curves update
4. **Monitor Performance:** API should respond in < 500ms
5. **Use Transactions:** If updating multiple tables

---

**Need Help?** 
Check the full documentation in `docs/recent-updates/MAP_DATABASE_CONNECTION.md` or review the code comments in the API endpoint.

**Ready to Deploy?**
Once tested locally, just push to your Git repo and Netlify will auto-deploy! 🚀



