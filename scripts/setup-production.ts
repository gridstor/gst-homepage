/**
 * Production Setup Script
 * Sets up Market Performance tables in analytics database
 * and populates with Yes Energy data
 * 
 * Usage: npx tsx scripts/setup-production.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

async function setupProduction() {
  console.log('🚀 Setting up Market Performance Cards with Live Data\n');
  
  // Step 1: Check for .env
  if (!fs.existsSync('.env')) {
    console.error('❌ .env file not found');
    console.error('Please create it with the analytics database URL and Yes Energy credentials');
    process.exit(1);
  }
  
  console.log('✅ Found .env file\n');
  
  // Step 3: Generate Prisma Client
  console.log('🔧 Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated\n');
  } catch (error) {
    console.error('❌ Failed to generate Prisma client');
    process.exit(1);
  }
  
  // Step 4: Push schema to database
  console.log('📊 Creating tables in analytics database...');
  console.log('(This will create: Location, TB4Calculation, YTDPerformance, Forecast, LMPData)');
  try {
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
    console.log('✅ Tables created successfully\n');
  } catch (error) {
    console.error('❌ Failed to create tables');
    console.error('This might be a permissions issue. Check that the database user has CREATE TABLE privileges.');
    process.exit(1);
  }
  
  // Step 5: Seed locations
  console.log('📍 Seeding location data...');
  try {
    execSync('npx tsx scripts/seed-locations.ts', { stdio: 'inherit' });
    console.log('✅ Locations seeded\n');
  } catch (error) {
    console.error('⚠️  Could not seed locations (will be created during poll)');
  }
  
  // Step 6: Poll Yes Energy data
  console.log('🌐 Fetching YTD 2025 data from Yes Energy...');
  console.log('This will take ~2 minutes to fetch data for all 8 locations\n');
  try {
    execSync('npx tsx src/lib/jobs/poll-yes-energy.ts', { stdio: 'inherit' });
    console.log('\n✅ Data fetched successfully!\n');
  } catch (error) {
    console.error('\n❌ Failed to fetch Yes Energy data');
    console.error('Please check:');
    console.error('  1. Yes Energy credentials are correct');
    console.error('  2. Object IDs are valid');
    console.error('  3. Network connectivity to Yes Energy API');
    console.error('\nYou can retry manually: npm run poll-data');
  }
  
  // Step 7: Verify
  console.log('🔍 Verifying data...');
  try {
    execSync('npx tsx scripts/check-data-status.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('⚠️  Could not verify data');
  }
  
  console.log('\n✨ Setup Complete!\n');
  console.log('Next steps:');
  console.log('  1. Start dev server: npm run dev');
  console.log('  2. Open: http://localhost:4321');
  console.log('  3. Scroll to "Market Performance Overview"');
  console.log('  4. Cards should show live data from Yes Energy!\n');
  console.log('To check API data source:');
  console.log('  Visit: http://localhost:4321/api/market-performance');
  console.log('  Look for: "dataSource": "database" (not "mock")\n');
}

setupProduction().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

