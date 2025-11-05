/**
 * Check the current status of data in the database
 * Helps verify if live data is being used
 * 
 * Usage: npx tsx scripts/check-data-status.ts
 */

import { prisma } from '../src/lib/db';

async function checkDataStatus() {
  console.log('🔍 Checking data status...\n');
  
  try {
    // Check locations
    console.log('--- Locations ---');
    const locations = await (prisma as any).location.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        market: true,
        nodeId: true
      }
    });
    
    console.log(`Found ${locations.length} active locations:`);
    locations.forEach((loc: any) => {
      console.log(`  - ${loc.market}: ${loc.name} (nodeId: ${loc.nodeId})`);
    });
    
    // Check TB4 calculations
    console.log('\n--- TB4/TB2 Data ---');
    const tb4Count = await (prisma as any).tB4Calculation.count();
    console.log(`Total TB4/TB2 records: ${tb4Count}`);
    
    if (tb4Count > 0) {
      // Get date range
      const earliest = await (prisma as any).tB4Calculation.findFirst({
        orderBy: { marketDate: 'asc' },
        select: { marketDate: true }
      });
      
      const latest = await (prisma as any).tB4Calculation.findFirst({
        orderBy: { marketDate: 'desc' },
        select: { marketDate: true }
      });
      
      console.log(`Date range: ${earliest.marketDate.toISOString().split('T')[0]} to ${latest.marketDate.toISOString().split('T')[0]}`);
      
      // Get sample data for each location
      console.log('\nSample data per location:');
      for (const location of locations) {
        const count = await (prisma as any).tB4Calculation.count({
          where: { locationId: location.id }
        });
        
        if (count > 0) {
          const avg = await (prisma as any).tB4Calculation.aggregate({
            where: { locationId: location.id },
            _avg: { tb4Value: true }
          });
          
          console.log(`  ${location.name}: ${count} records, avg TB = $${avg._avg.tb4Value.toFixed(2)}/MWh`);
        } else {
          console.log(`  ${location.name}: No data`);
        }
      }
    }
    
    // Check YTD performance
    console.log('\n--- YTD Performance ---');
    const ytdCount = await (prisma as any).yTDPerformance.count();
    console.log(`YTD records: ${ytdCount}`);
    
    if (ytdCount > 0) {
      const ytdData = await (prisma as any).yTDPerformance.findMany({
        include: {
          location: {
            select: {
              name: true,
              market: true
            }
          }
        }
      });
      
      console.log('\nYTD Summary:');
      ytdData.forEach((ytd: any) => {
        console.log(`  ${ytd.location.market} - ${ytd.location.name}:`);
        console.log(`    YTD Avg: $${ytd.ytdTB4Avg.toFixed(2)}/MWh`);
        console.log(`    Days: ${ytd.ytdDaysCount}`);
        if (ytd.actualPValue) {
          console.log(`    P-value: P${ytd.actualPValue}`);
        }
      });
    }
    
    // Check forecasts
    console.log('\n--- Forecasts ---');
    const forecastCount = await (prisma as any).forecast.count();
    console.log(`Forecast records: ${forecastCount}`);
    
    if (forecastCount > 0) {
      const forecasts = await (prisma as any).forecast.findMany({
        include: {
          location: {
            select: {
              name: true,
              market: true
            }
          }
        }
      });
      
      console.log('\nForecast Summary:');
      forecasts.forEach((forecast: any) => {
        console.log(`  ${forecast.location.market} - ${forecast.location.name}:`);
        console.log(`    Year: ${forecast.forecastYear}`);
        console.log(`    Type: ${forecast.forecastType}`);
        if (forecast.tb4Forecast) {
          console.log(`    TB4 Forecast: $${forecast.tb4Forecast.toFixed(2)}/MWh`);
        }
        if (forecast.pValueTarget) {
          console.log(`    Target P-value: P${forecast.pValueTarget}`);
        }
      });
    }
    
    // Recommendation
    console.log('\n--- Status & Recommendations ---');
    
    if (tb4Count === 0) {
      console.log('❌ No TB4/TB2 data found in database');
      console.log('   → Run: npx tsx src/lib/jobs/poll-yes-energy.ts');
    } else if (tb4Count < 100) {
      console.log('⚠️  Limited TB4/TB2 data (< 100 records)');
      console.log('   → Consider running a backfill for more historical data');
    } else {
      console.log('✅ Good amount of TB4/TB2 data');
    }
    
    if (ytdCount === 0) {
      console.log('⚠️  No YTD performance records');
      console.log('   → Run poll job to populate YTD data');
    } else if (ytdCount < locations.length) {
      console.log('⚠️  YTD data incomplete (not all locations)');
      console.log('   → Run poll job to update all locations');
    } else {
      console.log('✅ YTD performance data complete');
    }
    
    if (forecastCount === 0) {
      console.log('ℹ️  No forecast data (optional)');
      console.log('   → Forecasts enable P-value calculations');
    } else {
      console.log('✅ Forecast data available');
    }
    
    // Check API data source
    console.log('\n--- API Data Source ---');
    console.log('To check what data source the API is using, visit:');
    console.log('http://localhost:4321/api/market-performance');
    console.log('\nLook for "dataSource" field in the response:');
    console.log('  - "mock" = Using mock data (expected if DB is empty)');
    console.log('  - "database" = Using live data from DB ✅');
    
  } catch (error) {
    console.error('❌ Error checking data status:', error);
    console.error('\nMake sure:');
    console.error('1. Database is running');
    console.error('2. DATABASE_URL is set in .env');
    console.error('3. Prisma schema is synced: npx prisma db push');
  }
}

checkDataStatus()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

