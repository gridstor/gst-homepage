/**
 * Manually create Market Performance tables using raw SQL
 * This bypasses Prisma's introspection which requires read access to all tables
 * 
 * Usage: npx tsx scripts/create-tables-manually.ts
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Bypass SSL certificate validation for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const CREATE_TABLES_SQL = `
-- Location table
CREATE TABLE IF NOT EXISTS "Location" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" VARCHAR(100) NOT NULL,
  "market" VARCHAR(20) NOT NULL,
  "nodeId" VARCHAR(50),
  "region" VARCHAR(100),
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("market", "name")
);

-- TB4Calculation table
CREATE TABLE IF NOT EXISTS "TB4Calculation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "locationId" TEXT NOT NULL REFERENCES "Location"("id") ON DELETE CASCADE,
  "marketDate" DATE NOT NULL,
  "tb4Value" DOUBLE PRECISION NOT NULL,
  "peakHours" INTEGER[] NOT NULL DEFAULT '{}',
  "troughHours" INTEGER[] NOT NULL DEFAULT '{}',
  "avgPeakPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "avgTroughPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "dataQuality" VARCHAR(20),
  "calculatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("locationId", "marketDate")
);

CREATE INDEX IF NOT EXISTS "TB4Calculation_locationId_marketDate_idx" ON "TB4Calculation"("locationId", "marketDate");
CREATE INDEX IF NOT EXISTS "TB4Calculation_marketDate_idx" ON "TB4Calculation"("marketDate");

-- YTDPerformance table
CREATE TABLE IF NOT EXISTS "YTDPerformance" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "locationId" TEXT NOT NULL REFERENCES "Location"("id") ON DELETE CASCADE,
  "year" INTEGER NOT NULL,
  "ytdTB4Avg" DOUBLE PRECISION NOT NULL,
  "ytdDaysCount" INTEGER NOT NULL,
  "ytdRevenue" DOUBLE PRECISION,
  "actualPValue" INTEGER,
  "forecastPValue" INTEGER,
  "variance" DOUBLE PRECISION,
  "lastUpdated" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("locationId", "year")
);

-- Forecast table
CREATE TABLE IF NOT EXISTS "Forecast" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "locationId" TEXT NOT NULL REFERENCES "Location"("id") ON DELETE CASCADE,
  "forecastYear" INTEGER NOT NULL,
  "forecastType" VARCHAR(50) NOT NULL,
  "tb4Forecast" DOUBLE PRECISION,
  "pValueTarget" INTEGER,
  "energyArbRevenue" DOUBLE PRECISION,
  "asRevenue" DOUBLE PRECISION,
  "capacityRevenue" DOUBLE PRECISION,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" VARCHAR(100),
  "notes" TEXT,
  UNIQUE("locationId", "forecastYear", "forecastType")
);

-- LMPData table (optional, for storing hourly data if needed)
CREATE TABLE IF NOT EXISTS "LMPData" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "locationId" TEXT NOT NULL REFERENCES "Location"("id") ON DELETE CASCADE,
  "marketDate" DATE NOT NULL,
  "hour" INTEGER NOT NULL,
  "timestamp" TIMESTAMPTZ(6) NOT NULL,
  "dayAheadPrice" DOUBLE PRECISION,
  "realTimePrice" DOUBLE PRECISION,
  "energyComponent" DOUBLE PRECISION,
  "congestionComponent" DOUBLE PRECISION,
  "lossComponent" DOUBLE PRECISION,
  "dataSource" VARCHAR(50) NOT NULL DEFAULT 'yes_energy',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("locationId", "marketDate", "hour")
);

CREATE INDEX IF NOT EXISTS "LMPData_locationId_marketDate_idx" ON "LMPData"("locationId", "marketDate");
CREATE INDEX IF NOT EXISTS "LMPData_marketDate_idx" ON "LMPData"("marketDate");
`;

async function createTables() {
  console.log('🔧 Creating Market Performance tables...\n');
  
  try {
    const client = await pool.connect();
    
    try {
      console.log('📊 Connected to analytics database');
      console.log('   Creating tables...\n');
      
      await client.query(CREATE_TABLES_SQL);
      
      console.log('✅ Tables created successfully!\n');
      console.log('Created tables:');
      console.log('  - Location');
      console.log('  - TB4Calculation');
      console.log('  - YTDPerformance');
      console.log('  - Forecast');
      console.log('  - LMPData\n');
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

createTables()
  .then(() => {
    console.log('✨ Setup complete!\n');
    console.log('Next steps:');
    console.log('  1. Seed locations: npm run seed-locations');
    console.log('  2. Fetch Yes Energy data: npm run poll-data');
    console.log('  3. Verify: npm run check-data\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

