-- =====================================================
-- Setup Script for Homepage_YTD_TBx Table
-- =====================================================
-- This script creates the required table and populates it with sample data
-- for the Year-to-Date Performance dashboard section.
--
-- Run this script in your PostgreSQL database with appropriate permissions.
-- =====================================================

-- Step 1: Create the Forecasts schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS "Forecasts";

-- Step 2: Create the Homepage_YTD_TBx table
CREATE TABLE IF NOT EXISTS "Forecasts"."Homepage_YTD_TBx" (
    "Asset" TEXT NOT NULL,
    "ISO" TEXT NOT NULL,
    "TBx" TEXT NOT NULL,
    "YTD TBx" NUMERIC NOT NULL,
    "Run Date" TIMESTAMP NOT NULL,
    
    -- Add a primary key constraint for better performance
    CONSTRAINT ytd_tbx_pk PRIMARY KEY ("Asset", "ISO", "Run Date")
);

-- Step 3: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ytd_tbx_iso ON "Forecasts"."Homepage_YTD_TBx" ("ISO");
CREATE INDEX IF NOT EXISTS idx_ytd_tbx_run_date ON "Forecasts"."Homepage_YTD_TBx" ("Run Date" DESC);
CREATE INDEX IF NOT EXISTS idx_ytd_tbx_asset_iso ON "Forecasts"."Homepage_YTD_TBx" ("Asset", "ISO");

-- Step 4: Insert sample data for CAISO locations
INSERT INTO "Forecasts"."Homepage_YTD_TBx" ("Asset", "ISO", "TBx", "YTD TBx", "Run Date")
VALUES 
    -- CAISO Locations
    ('Goleta', 'CAISO', 'TB4', 7.85, NOW()),
    ('SP15', 'CAISO', 'TB4', 7.92, NOW()),
    ('NP15', 'CAISO', 'TB4', 8.05, NOW()),
    ('SCE_LAP', 'CAISO', 'TB4', 7.95, NOW()),
    ('PGE_VLY', 'CAISO', 'TB4', 8.15, NOW()),
    
    -- ERCOT Locations
    ('Houston_Hub', 'ERCOT', 'TB2', 9.12, NOW()),
    ('North_Hub', 'ERCOT', 'TB2', 8.95, NOW()),
    ('West_Hub', 'ERCOT', 'TB2', 8.78, NOW()),
    ('South_Hub', 'ERCOT', 'TB2', 9.25, NOW()),
    ('LZ_Houston', 'ERCOT', 'TB2', 9.18, NOW()),
    
    -- SPP Locations
    ('SPP_North', 'SPP', 'TB4', 6.45, NOW()),
    ('SPP_South', 'SPP', 'TB4', 6.52, NOW()),
    ('Wichita_Hub', 'SPP', 'TB4', 6.38, NOW()),
    ('OKC_Hub', 'SPP', 'TB4', 6.55, NOW())
ON CONFLICT ("Asset", "ISO", "Run Date") DO UPDATE
SET 
    "TBx" = EXCLUDED."TBx",
    "YTD TBx" = EXCLUDED."YTD TBx";

-- Step 5: Verify the data was inserted
SELECT 
    "ISO" as market,
    COUNT(*) as location_count,
    AVG("YTD TBx") as avg_ytd_tbx,
    MAX("Run Date") as latest_run_date
FROM "Forecasts"."Homepage_YTD_TBx"
GROUP BY "ISO"
ORDER BY "ISO";

-- =====================================================
-- Additional Notes:
-- =====================================================
-- 1. The "YTD TBx" column should be in $/kW-month units
-- 2. The "Run Date" should be updated whenever new data is calculated
-- 3. Each Asset/ISO combination should have one record per Run Date
-- 4. The application will automatically pick the most recent Run Date for each Asset/ISO
-- 5. Asset names should match the location configuration in market-config.ts
-- 
-- To update data regularly, use an INSERT ... ON CONFLICT DO UPDATE statement
-- similar to the one above with the current date/time.
-- =====================================================

