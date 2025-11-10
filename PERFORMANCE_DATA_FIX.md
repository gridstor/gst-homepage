# Fix for "Fail to load performance data" Error

## Problem Summary

The Year-to-Date Performance section on the homepage was showing "Fail to load performance data" because:

1. **Missing Database Table**: The `Homepage_YTD_TBx` table doesn't exist in the Analytics Workspace database
2. **Field Name Mismatches**: The API was returning `ytdTB4` but the component expected `ytdEnergyRevenue`, and returning `neededPValue` but the component expected `boyPValue`
3. **Poor Error Messaging**: The component was treating "no data" the same as "error"

## Changes Made

### 1. Fixed API Field Names (`src/pages/api/market-performance.ts`)
- ✅ Changed `ytdTB4` → `ytdEnergyRevenue` in the interface
- ✅ Changed `neededPValue` → `boyPValue` in the interface
- ✅ Updated the return object to use these corrected field names

### 2. Improved Error Handling (`src/components/MarketAnalyticsCard.tsx`)
- ✅ Separated error state from empty data state
- ✅ Added helpful message when no data is available (instead of generic error)
- ✅ Included instructions for database administrator

### 3. Created Database Setup Script (`database/setup_ytd_performance_table.sql`)
- ✅ Script to create the `Forecasts` schema
- ✅ Script to create the `Homepage_YTD_TBx` table with proper indexes
- ✅ Sample data for CAISO, ERCOT, and SPP markets
- ✅ Verification queries

### 4. Documentation (`database/README.md`)
- ✅ Detailed instructions for database setup
- ✅ Table structure documentation
- ✅ Data update process guidelines

## Current Status

**The error is now handled gracefully** - instead of showing "Fail to load performance data", the page now shows:

```
⚠️ No Performance Data Available

The Homepage_YTD_TBx table is not populated yet. Please ensure the data 
pipeline is running and has completed at least one update cycle.

Contact your database administrator to populate the table with year-to-date 
performance metrics.
```

## Next Steps

To completely resolve the issue and display actual data:

### Option 1: Quick Test with Sample Data
Run the SQL script to populate the table with sample data:

```bash
cd database
# Connect to your PostgreSQL database and run:
psql -h gridstor-dev.cxoowsyptaww.us-east-2.rds.amazonaws.com \
     -U brett_rudder \
     -d analytics_workspace \
     -f setup_ytd_performance_table.sql
```

### Option 2: Production Data Pipeline
Set up your data pipeline to regularly populate the `Homepage_YTD_TBx` table with actual YTD performance metrics.

## Testing the Fix

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Visit the homepage:**
   ```
   http://localhost:4321
   ```

3. **Check the Year-to-Date Performance section:**
   - ✅ Should now show a helpful amber warning (not red error)
   - ✅ Message explains what needs to be done
   - ✅ No console errors about missing fields

4. **After running the SQL script:**
   - ✅ Refresh the page
   - ✅ Should see performance cards/table with data
   - ✅ All fields should display correctly (no undefined values)

## Field Mapping Reference

| Component Field    | API Field          | Database Column | Units        |
|-------------------|--------------------|-----------------|--------------|
| ytdEnergyRevenue  | ytdEnergyRevenue   | YTD TBx         | $/kW-month   |
| ytdForecast       | ytdForecast        | (calculated)    | $/kW-month   |
| ytdPValue         | ytdPValue          | (calculated)    | P-value      |
| boyForecast       | boyForecast        | (calculated)    | $/kW-month   |
| boyPValue         | boyPValue          | (calculated)    | P-value      |
| projectedTotal    | projectedTotal     | (calculated)    | $/kW-month   |
| totalWithAS       | totalWithAS        | (calculated)    | $/kW-month   |

## Verification Checklist

After running the database setup:

- [ ] Table `Forecasts.Homepage_YTD_TBx` exists
- [ ] Table contains data for multiple markets (CAISO, ERCOT, SPP)
- [ ] Homepage loads without errors
- [ ] Performance section shows location cards/table
- [ ] All numeric values display correctly
- [ ] Filters work (Market, Type, Search)
- [ ] Table view sorting works
- [ ] P-values show correct colors (green/red)

## Troubleshooting

### Still seeing "No Performance Data Available"?
- Check database connection: `DATABASE_URL_ANALYTICSWORKSPACE` in `.env`
- Verify schema exists: `SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'Forecasts';`
- Verify table exists: `SELECT * FROM "Forecasts"."Homepage_YTD_TBx" LIMIT 5;`
- Check application logs for database errors

### Data shows but fields are undefined?
- Verify field names match exactly (case-sensitive)
- Check that API response includes all required fields
- Look for console errors about missing properties

### Database connection error?
- Verify `.env` file has `DATABASE_URL_ANALYTICSWORKSPACE`
- Check SSL mode is set correctly (`sslmode=no-verify` or `sslmode=require`)
- Test connection with `psql` or database client

## Files Modified

1. `src/pages/api/market-performance.ts` - Fixed field names
2. `src/components/MarketAnalyticsCard.tsx` - Improved error handling
3. `database/setup_ytd_performance_table.sql` - New database setup script
4. `database/README.md` - New database documentation

## Notes

- No changes needed to environment variables
- No changes needed to Prisma schema
- The fix is backward compatible
- The API gracefully handles missing tables

