# Analytics Workspace Connection Setup

This guide explains how to connect the homepage to real YTD TBx data from the Analytics Workspace database.

## Overview

The Market Performance Overview section now fetches real data from the `Homepage_YTD_TBx` table in your Analytics Workspace database.

## Table Structure

The `Homepage_YTD_TBx` table should have the following columns:

| Column    | Type      | Description                              |
|-----------|-----------|------------------------------------------|
| asset     | string    | Location/asset name (e.g., "Goleta")    |
| iso       | string    | Market identifier (CAISO, ERCOT, SPP)   |
| tbx       | string    | TB type (TB2, TB4, etc.)                |
| ytd_tbx   | number    | YTD average TBx value                   |
| run_date  | timestamp | Date when this calculation was run      |

## Setup Instructions

### 1. Configure Database Connection

Create a `.env` file in the project root with your database connection:

```bash
DATABASE_URL_ANALYTICSWORKSPACE="postgresql://username:password@host:port/database_name"
```

**Security Note:** Never commit the `.env` file to Git. It should already be in `.gitignore`.

### 2. Test the Connection

Run the test script to verify your connection and see what data is available:

```bash
npm run test:analytics
```

Or manually:

```bash
npx tsx scripts/test-analytics-connection.ts
```

This will:
- ✅ Verify DATABASE_URL_ANALYTICSWORKSPACE is configured
- ✅ Check the Homepage_YTD_TBx table exists
- ✅ Display sample data from the table
- ✅ Show latest data grouped by market
- ✅ Perform data quality checks

### 3. Configure Asset Mappings

Update `src/lib/market-config.ts` to match your actual asset names and forecasts:

```typescript
export const LOCATION_MAPPINGS: LocationConfig[] = [
  {
    assetName: 'Goleta',  // Must match "asset" column in database
    displayName: 'Goleta',  // Name shown in UI
    market: 'CAISO',
    tbType: 'TB4',
    yearAheadForecast: 8.20,  // Your forecast value
    targetPValue: 50,
    asProportion: 1.10
  },
  // ... add more locations
];
```

### 4. Update API Endpoint

The current market-performance API uses mock data. To switch to real data:

**Option A: Replace the existing endpoint** (Recommended)
```bash
# Backup the old version
mv src/pages/api/market-performance.ts src/pages/api/market-performance-mock.ts

# Use the real data version
mv src/pages/api/market-performance-real.ts src/pages/api/market-performance.ts
```

**Option B: Use the new endpoint separately**
Update `MarketAnalyticsCard.tsx` to use the new endpoint:
```typescript
const response = await fetch(`/api/market-performance-real?market=${market}`);
```

## Data Flow

```
┌─────────────────────────────┐
│  Analytics Workspace DB     │
│  Table: Homepage_YTD_TBx    │
│  - asset                    │
│  - iso                      │
│  - tbx                      │
│  - ytd_tbx                  │
│  - run_date                 │
└──────────┬──────────────────┘
           │
           │ DATABASE_URL_ANALYTICSWORKSPACE
           │
           ▼
┌─────────────────────────────┐
│  src/lib/db-analytics.ts    │
│  - getLatestYTDData()       │
│  - Fetches most recent data │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  src/lib/market-config.ts   │
│  - Asset name mappings      │
│  - Forecast values          │
│  - Market configurations    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  api/market-performance.ts  │
│  - Combines YTD data        │
│  - Calculates projections   │
│  - Returns formatted data   │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  MarketAnalyticsCard.tsx    │
│  - Displays in UI           │
│  - Refreshes every 5 min    │
└─────────────────────────────┘
```

## Data Conversion

The system automatically handles data conversion:

- **If `ytd_tbx < 100`**: Assumes value is already in $/kW-month
- **If `ytd_tbx >= 100`**: Assumes value is in $/MWh and converts to $/kW-month

Conversion formula:
```
$/kW-month = ($/MWh × 2 hours/day × 30.4 days/month × 0.85 efficiency) / 1000 kW/MW
```

## API Response Format

The API returns:

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
          "locationId": "caiso_goleta",
          "ytdTB4": 7.85,
          "ytdDaysCount": 304,
          "yearAheadForecast": 8.20,
          "pValue": "P35",
          "pValueAmount": -0.35,
          "boyForecast": 8.45,
          "boyDaysRemaining": 61,
          "neededToMeet": 8.55,
          "neededPValue": "P50",
          "projectedTotal": 8.32,
          "yoyChange": "+4.2%",
          "asProportion": 1.10
        }
      ],
      "lastUpdated": "2025-01-07T10:30:00Z",
      "metadata": {
        "dataSource": "analytics_workspace",
        "calculationDate": "2025-01-07T10:30:00Z",
        "year": 2025
      }
    }
  ]
}
```

## Troubleshooting

### "No data found in Homepage_YTD_TBx table"

1. Verify table exists: Run `test:analytics` script
2. Check table name is exactly `Homepage_YTD_TBx` (case-sensitive)
3. Ensure table has recent data

### "Could not connect to database"

1. Verify DATABASE_URL_ANALYTICSWORKSPACE in `.env`
2. Check firewall/network access to database
3. Verify credentials are correct

### "Asset names don't match"

Update the `assetName` field in `src/lib/market-config.ts` to match exactly what's in your database `asset` column.

### Values seem incorrect

Run the test script to see what values are in the database. Check if they need conversion ($/MWh → $/kW-month).

## Daily Updates

The table is expected to be updated daily with new YTD TBx values. The API automatically:
- Fetches the most recent `run_date` for each asset/iso combination
- Calculates balance-of-year projections
- Updates P-values based on forecasts

## Next Steps

After setup:

1. ✅ Configure forecast values for each location in `market-config.ts`
2. ✅ Set up automated daily updates to the `Homepage_YTD_TBx` table
3. ✅ Add historical YoY data for trend analysis
4. ✅ Consider adding BOY forecast values to the database

## Questions?

Before making changes, please answer:

1. Are the column names exactly: `asset`, `iso`, `tbx`, `ytd_tbx`, `run_date`?
2. Is `ytd_tbx` already in $/kW-month or does it need conversion from $/MWh?
3. What are the exact asset names in your database?
4. Do you have forecast values available?

