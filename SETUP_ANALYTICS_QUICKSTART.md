# Quick Start: Connect Real Data from Analytics Workspace

This guide will help you connect the Market Performance Overview cards to your real YTD TBx data.

## 📋 Prerequisites

Your Analytics Workspace database should have a table called `Homepage_YTD_TBx` with these columns:
- `Asset` - Location name (e.g., "Goleta", "Houston Hub")
- `ISO` - Market name (e.g., "CAISO", "ERCOT", "SPP")
- `TBx` - TB type (e.g., "TB4", "TB2")
- `YTD TBx` - YTD average value in $/kW-month
- `Run Date` - When the calculation was last run

## 🚀 Setup Steps

### 1. Configure Database Connection

Create a `.env` file in the project root:

```bash
DATABASE_URL_ANALYTICSWORKSPACE="postgresql://username:password@host:port/database_name?schema=public"
```

**Important:** 
- Replace the connection string with your actual database credentials
- The `.env` file is git-ignored and will not be committed
- Keep your credentials secure!

### 2. Test the Connection

Run the test script to verify everything works:

```bash
npm run test:analytics
```

This will:
- ✅ Check if DATABASE_URL_ANALYTICSWORKSPACE is configured
- ✅ Query the Homepage_YTD_TBx table
- ✅ Display your data grouped by market
- ✅ Perform data quality checks

**Expected Output:**
```
🔍 Testing Analytics Workspace Connection...

✅ DATABASE_URL_ANALYTICSWORKSPACE is configured
   Connection: host:port/database

📊 Querying Homepage_YTD_TBx table...

✅ Found X records

📊 Data by Market:

CAISO:
  - Goleta: 7.85 $/kW-month (TB4) [run date: 2025-01-07]
  - SP15: 7.92 $/kW-month (TB4) [run date: 2025-01-07]
  ...

ERCOT:
  - Houston Hub: 9.12 $/kW-month (TB2) [run date: 2025-01-07]
  ...
```

### 3. Update Asset Mappings (Optional)

If your asset names don't match the defaults, or you want to add forecast values, edit `src/lib/market-config.ts`:

```typescript
export const LOCATION_MAPPINGS: LocationConfig[] = [
  {
    assetName: 'Goleta',           // Must match "Asset" column in database
    displayName: 'Goleta',          // Name shown in UI
    market: 'CAISO',
    tbType: 'TB4',
    yearAheadForecast: 8.20,       // Your forecast value (optional)
    targetPValue: 50,               // Target P-value (default: 50)
    asProportion: 1.10              // AS revenue multiplier (default by market)
  },
  // ... add more locations
];
```

### 4. Start the Development Server

```bash
npm run dev
```

Navigate to `http://localhost:4321` and check the Market Performance Overview section.

## ✅ What's Connected

The following now use real data from your Analytics Workspace:

- **YTD TBx values** - Directly from `Homepage_YTD_TBx` table
- **Last Updated timestamp** - From the `Run Date` column
- **Asset/Location selection** - Dynamically populated from database
- **Market grouping** - Automatically grouped by ISO

## 🔧 What's Still Calculated

These are calculated from your YTD data and config:

- **Year Ahead Forecast** - From `market-config.ts` (or defaults to YTD value)
- **P-Value** - Calculated based on actual vs forecast
- **BOY Forecast** - Projected based on YTD trend
- **Projected Total** - Weighted average of YTD and BOY
- **AS Proportion** - From config (1.10 for CAISO, 1.25 for ERCOT, 1.34 for SPP)
- **YoY Change** - Currently shows "+0.0%" (needs historical data)

## 📊 Data Flow

```
Analytics Workspace DB
    ↓
Homepage_YTD_TBx table
    ↓
/api/market-performance endpoint
    ↓
MarketAnalyticsCard component
    ↓
Display in UI (refreshes every 5 minutes)
```

## 🐛 Troubleshooting

### "DATABASE_URL_ANALYTICSWORKSPACE is not set"
- Make sure you created a `.env` file in the project root
- Check that the variable name is exactly `DATABASE_URL_ANALYTICSWORKSPACE`

### "No data found in Homepage_YTD_TBx table"
- Verify the table name is exactly `Homepage_YTD_TBx` (case-sensitive)
- Check that the table has data with recent `Run Date` values
- Run `npm run test:analytics` to see what data exists

### "Could not connect to database"
- Verify your connection string is correct
- Check network/firewall access to the database
- Ensure database credentials are valid

### Asset names don't match
- Run `npm run test:analytics` to see the actual asset names in your database
- Update `assetName` in `src/lib/market-config.ts` to match exactly

## 📚 Additional Resources

- **Full Documentation:** `docs/ANALYTICS_WORKSPACE_SETUP.md`
- **Market Config:** `src/lib/market-config.ts`
- **API Endpoint:** `src/pages/api/market-performance.ts`
- **Database Helper:** `src/lib/db-analytics.ts`

## 🎉 Success!

If you can see real data in the Market Performance Overview cards, you're all set! The data will automatically update based on the `Run Date` in your database.

## Next Steps

1. Set up daily updates to the `Homepage_YTD_TBx` table
2. Add forecast values to `market-config.ts` for accurate P-value calculations
3. Consider adding historical YoY data for trend analysis
4. Monitor the data quality using the test script

Need help? Check the full documentation in `docs/ANALYTICS_WORKSPACE_SETUP.md`

