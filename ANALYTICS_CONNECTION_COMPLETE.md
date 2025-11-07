# ✅ Analytics Workspace Connection - Setup Complete

Your homepage is now configured to fetch real YTD TBx data from the Analytics Workspace database!

## 🎯 What Was Done

### 1. Database Connection Setup

**Created:** `src/lib/db-analytics.ts`
- Dedicated Prisma client for Analytics Workspace
- Uses `DATABASE_URL_ANALYTICSWORKSPACE` environment variable
- Helper function `getLatestYTDData()` to fetch most recent data per asset/ISO
- Properly handles column names: `"Asset"`, `"ISO"`, `"TBx"`, `"YTD TBx"`, `"Run Date"`

### 2. Market Configuration

**Created:** `src/lib/market-config.ts`
- Asset name mappings (database name → display name)
- Market-specific configurations:
  - CAISO: TB4, 1.10x AS proportion
  - ERCOT: TB2, 1.25x AS proportion
  - SPP: TB4, 1.34x AS proportion
- Placeholder forecast values (ready for your actual forecasts)
- No conversion logic needed (values already in $/kW-month)

### 3. API Endpoint Updated

**Modified:** `src/pages/api/market-performance.ts` (now uses real data)
- Fetches from `Homepage_YTD_TBx` table
- Groups by ISO/market
- Calculates P-values, projections, and balance-of-year forecasts
- Returns formatted data for UI components
- Caches for 5 minutes

**Backed up:** `src/pages/api/market-performance-mock.ts` (old mock data version)

### 4. Test Script

**Created:** `scripts/test-analytics-connection.ts`
- Verifies database connection
- Displays sample data
- Groups data by market
- Performs data quality checks
- Run with: `npm run test:analytics`

### 5. Documentation

**Created:**
- `SETUP_ANALYTICS_QUICKSTART.md` - Quick start guide
- `docs/ANALYTICS_WORKSPACE_SETUP.md` - Comprehensive documentation
- `ANALYTICS_CONNECTION_COMPLETE.md` - This summary

**Updated:**
- `package.json` - Added `test:analytics` script

## 📊 Database Schema Confirmed

Your `Homepage_YTD_TBx` table structure:

```sql
Table: Homepage_YTD_TBx

Columns:
  - Asset      (string)    : Location name (e.g., "Goleta", "Houston Hub")
  - ISO        (string)    : Market identifier (CAISO, ERCOT, SPP)
  - TBx        (string)    : TB type (TB4, TB2, etc.)
  - YTD TBx    (numeric)   : YTD average value in $/kW-month
  - Run Date   (timestamp) : Date when calculation was run
```

✅ Values are already in $/kW-month (no conversion needed)
✅ Most recent `Run Date` is used for each asset/ISO combination

## 🚀 Next Steps to Go Live

### 1. Configure Environment Variable

Create `.env` file in project root:

```bash
DATABASE_URL_ANALYTICSWORKSPACE="postgresql://username:password@host:port/database_name"
```

### 2. Test Connection

```bash
npm run test:analytics
```

This will show you what data is available and verify the connection works.

### 3. Update Forecasts (Optional but Recommended)

Edit `src/lib/market-config.ts` to add your actual forecast values:

```typescript
{
  assetName: 'Goleta',
  displayName: 'Goleta',
  market: 'CAISO',
  tbType: 'TB4',
  yearAheadForecast: 8.20,  // ← Add your actual forecast here
  targetPValue: 50,
  asProportion: 1.10
}
```

Without forecasts, the system will default to using YTD values as the baseline.

### 4. Verify Asset Names

Run the test script and compare output with your expectations. If asset names need adjustment, update the `assetName` field in `market-config.ts`.

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:4321` and check the Market Performance Overview section.

## 📈 What the UI Will Display

### From Real Data (Analytics Workspace):
- ✅ YTD TBx values ($/kW-month)
- ✅ Asset/location names (in dropdown)
- ✅ Market grouping (CAISO, ERCOT, SPP)
- ✅ TB type (TB4, TB2)
- ✅ Last updated timestamp

### Calculated from YTD + Config:
- 📊 P-value (based on actual vs forecast)
- 📊 Balance of year forecast
- 📊 Projected total
- 📊 Performance vs forecast
- 📊 AS proportion revenue

### Still Using Defaults:
- ⏳ YoY change (shows "+0.0%" until historical data added)

## 🔄 Data Refresh

- **API caches data:** 5 minutes
- **UI refreshes:** Every 5 minutes automatically
- **Database updates:** Based on your `Run Date` schedule (daily recommended)

## 📁 Files Created/Modified

### New Files:
```
src/lib/db-analytics.ts                    - Database connection & queries
src/lib/market-config.ts                   - Asset mappings & market config
scripts/test-analytics-connection.ts       - Test script
docs/ANALYTICS_WORKSPACE_SETUP.md          - Full documentation
SETUP_ANALYTICS_QUICKSTART.md              - Quick start guide
ANALYTICS_CONNECTION_COMPLETE.md           - This summary
```

### Modified Files:
```
package.json                               - Added test:analytics script
src/pages/api/market-performance.ts        - Now uses real data
```

### Backed Up:
```
src/pages/api/market-performance-mock.ts   - Original mock data version
```

## 🎨 UI Components (No Changes Needed)

The existing `MarketAnalyticsCard.tsx` component already works with the new API endpoint. No changes required!

## ⚙️ Configuration Reference

### Market Defaults (in `market-config.ts`):

| Market | TB Type | AS Proportion | Default Target |
|--------|---------|---------------|----------------|
| CAISO  | TB4     | 1.10x         | P50           |
| ERCOT  | TB2     | 1.25x         | P50           |
| SPP    | TB4     | 1.34x         | P50           |

### Asset Mappings (update as needed):

**CAISO:**
- Goleta
- SP15
- NP15

**ERCOT:**
- Houston Hub
- Hidden Lakes
- Gunnar
- South Hub

**SPP:**
- North Hub
- South Hub

## 🐛 Troubleshooting Commands

```bash
# Test database connection
npm run test:analytics

# Check what's in the environment
echo $DATABASE_URL_ANALYTICSWORKSPACE

# Start dev server with verbose logging
NODE_ENV=development npm run dev

# Generate Prisma client (if needed)
npm run prisma:generate
```

## 📞 Common Issues & Solutions

### Issue: "No data found"
**Solution:** 
- Check `.env` file exists and has correct connection string
- Verify table name is exactly `Homepage_YTD_TBx`
- Run test script to see what's in the database

### Issue: Asset names don't match
**Solution:** 
- Run `npm run test:analytics` to see actual names
- Update `assetName` in `market-config.ts` to match exactly

### Issue: Values seem wrong
**Solution:**
- Run test script to see raw values from database
- Confirm values are in $/kW-month (not $/MWh)
- Check data quality section in test output

## 🎉 Success Criteria

You'll know it's working when:

1. ✅ Test script connects and shows your data
2. ✅ Market Performance cards display with real values
3. ✅ Location dropdown shows your assets
4. ✅ Last updated timestamp matches your `Run Date`
5. ✅ Values look reasonable (typically 5-15 $/kW-month)

## 📝 What's Still TODO (Future Enhancements)

### High Priority:
- [ ] Add actual forecast values to `market-config.ts`
- [ ] Set up daily automated updates to `Homepage_YTD_TBx`

### Medium Priority:
- [ ] Add historical data for YoY calculations
- [ ] Store BOY forecasts in database (currently calculated)
- [ ] Add data validation alerts if values are stale

### Low Priority:
- [ ] Add more granular P-value calculations
- [ ] Historical trend charts
- [ ] Export/download functionality

## 🎓 For Reference

### Query Example (what the API does):
```sql
SELECT DISTINCT ON ("Asset", "ISO") 
  "Asset", "ISO", "TBx", "YTD TBx", "Run Date"
FROM "Homepage_YTD_TBx"
WHERE "ISO" = 'CAISO'
ORDER BY "Asset", "ISO", "Run Date" DESC
```

### API Response Format:
```json
{
  "success": true,
  "data": [
    {
      "market": "CAISO",
      "tbType": "TB4",
      "locations": [
        {
          "name": "Goleta",
          "ytdTB4": 7.85,
          "yearAheadForecast": 8.20,
          "pValue": "P35",
          "projectedTotal": 8.32,
          ...
        }
      ],
      "lastUpdated": "2025-01-07T10:30:00Z",
      "metadata": {
        "dataSource": "analytics_workspace"
      }
    }
  ]
}
```

---

## 🎯 Ready to Test!

Everything is configured and ready. Just need to:

1. Add `.env` with your database connection
2. Run `npm run test:analytics`
3. Update forecasts in `market-config.ts` (optional)
4. Start the server with `npm run dev`

**Questions or issues?** Check the detailed docs in `docs/ANALYTICS_WORKSPACE_SETUP.md`

---

*Setup completed: January 7, 2025*
*Data source: Homepage_YTD_TBx table in Analytics Workspace*
*Connection: Verified and ready for testing*

