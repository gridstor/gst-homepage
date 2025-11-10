# Database Setup for Year-to-Date Performance Dashboard

## Issue Description

The Year-to-Date Performance section on the homepage is showing "No Performance Data Available" because the required database table `Homepage_YTD_TBx` does not exist in the Analytics Workspace database.

## Solution

Run the SQL script provided in this directory to create the necessary table and populate it with sample data.

### Steps to Fix

1. Connect to your PostgreSQL database (Analytics Workspace):
   ```
   Host: gridstor-dev.cxoowsyptaww.us-east-2.rds.amazonaws.com
   Port: 5432
   Database: analytics_workspace
   User: brett_rudder
   ```

2. Run the setup script:
   ```bash
   psql -h gridstor-dev.cxoowsyptaww.us-east-2.rds.amazonaws.com \
        -U brett_rudder \
        -d analytics_workspace \
        -f setup_ytd_performance_table.sql
   ```

   Or use your preferred PostgreSQL client (pgAdmin, DBeaver, etc.) to execute the `setup_ytd_performance_table.sql` script.

3. The script will:
   - Create the `Forecasts` schema (if it doesn't exist)
   - Create the `Homepage_YTD_TBx` table with proper indexes
   - Insert sample data for CAISO, ERCOT, and SPP markets
   - Display a summary of the inserted data

4. Refresh your homepage - the performance data should now load successfully

## Table Structure

```sql
CREATE TABLE "Forecasts"."Homepage_YTD_TBx" (
    "Asset" TEXT NOT NULL,          -- Location name (e.g., 'Goleta', 'Houston_Hub')
    "ISO" TEXT NOT NULL,             -- Market: CAISO, ERCOT, or SPP
    "TBx" TEXT NOT NULL,             -- TB type: TB2, TB4, etc.
    "YTD TBx" NUMERIC NOT NULL,      -- YTD average value in $/kW-month
    "Run Date" TIMESTAMP NOT NULL    -- When values were last updated
);
```

## Data Update Process

To keep the data current, your data pipeline should regularly update this table with new Run Date values:

```sql
INSERT INTO "Forecasts"."Homepage_YTD_TBx" ("Asset", "ISO", "TBx", "YTD TBx", "Run Date")
VALUES 
    ('Goleta', 'CAISO', 'TB4', 7.85, NOW()),
    -- ... more locations
ON CONFLICT ("Asset", "ISO", "Run Date") DO UPDATE
SET 
    "TBx" = EXCLUDED."TBx",
    "YTD TBx" = EXCLUDED."YTD TBx";
```

## Verification

After running the script, you can verify the data:

```sql
SELECT "ISO", COUNT(*) as location_count, AVG("YTD TBx") as avg_ytd
FROM "Forecasts"."Homepage_YTD_TBx"
GROUP BY "ISO";
```

## Additional Notes

- The application automatically fetches the most recent `Run Date` for each Asset/ISO combination
- Asset names should match the location configuration in `src/lib/market-config.ts`
- The `YTD TBx` values should be in $/kW-month units
- The API endpoint includes error handling for missing tables, which is why you see a helpful message instead of a hard error

## Code Changes Made

1. **API Interface Fix**: Updated `src/pages/api/market-performance.ts` to use correct field names:
   - Changed `ytdTB4` → `ytdEnergyRevenue` (to match component expectations)
   - Changed `neededPValue` → `boyPValue` (to match component expectations)

2. **Component Error Handling**: Updated `src/components/MarketAnalyticsCard.tsx` to distinguish between:
   - Actual errors (red alert)
   - No data available (amber alert with helpful message)

## Contact

If you need assistance setting up the database table, please contact your database administrator.

