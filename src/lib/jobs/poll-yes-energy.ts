/**
 * Scheduled Job: Poll Yes Energy for Day-Ahead TB2/TB4 Data
 * 
 * BEFORE RUNNING: Execute `npx prisma generate` to generate Prisma client types
 * 
 * This job should run daily (e.g., 6 AM) to fetch the previous day's
 * day-ahead TB2/TB4 data from Yes Energy.
 * 
 * Can be run via:
 * - Netlify Scheduled Functions
 * - GitHub Actions
 * - Cron job on a server
 * - Manual trigger for backfilling
 */

// Bypass SSL certificate validation for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { prisma } from '../db';
import { yesEnergyService, YES_ENERGY_LOCATIONS } from '../services/yes-energy';

// Type assertions for Prisma models (run `npx prisma generate` to get proper types)
const db = prisma as any;

interface PollJobOptions {
  date?: Date;           // Specific date to fetch (default: yesterday)
  locations?: string[];  // Specific locations (default: all)
  backfillDays?: number; // Number of days to backfill (default: 1)
}

export async function pollYesEnergyData(options: PollJobOptions = {}) {
  const startTime = Date.now();
  const results = {
    succeeded: 0,
    failed: 0,
    errors: [] as string[]
  };

  try {
    console.log('🚀 Starting Yes Energy data poll...');
    
    // Determine date range
    const endDate = options.date || new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
    const backfillDays = options.backfillDays || 1;
    const startDate = new Date(endDate.getTime() - (backfillDays - 1) * 24 * 60 * 60 * 1000);
    
    console.log(`📅 Fetching data from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
    
    // Filter locations if specified
    let locationsToFetch = YES_ENERGY_LOCATIONS;
    if (options.locations) {
      locationsToFetch = YES_ENERGY_LOCATIONS.filter(loc => 
        options.locations!.includes(loc.locationName)
      );
    }
    
    console.log(`📍 Processing ${locationsToFetch.length} locations...`);
    
    // Fetch data for each location
    for (const yesLocation of locationsToFetch) {
      try {
        console.log(`\n🔄 Processing ${yesLocation.market} - ${yesLocation.locationName}...`);
        
        // Find or create location in database
        const dbLocation = await db.location.upsert({
          where: {
            market_name: {
              market: yesLocation.market,
              name: yesLocation.locationName
            }
          },
          create: {
            name: yesLocation.locationName,
            market: yesLocation.market,
            nodeId: yesLocation.nodeId,
            isActive: true
          },
          update: {
            nodeId: yesLocation.nodeId
          }
        });
        
        // Fetch TB2/TB4 data directly from Yes Energy (pre-calculated)
        const tbData = await yesEnergyService.fetchDayAheadTB(
          yesLocation.locationName,
          startDate,
          endDate
        );
        
        console.log(`  ✅ Fetched ${tbData.length} daily TB${yesLocation.market === 'ERCOT' ? '2' : '4'} values`);
        
        // Process each day's TB value
        for (const dataPoint of tbData) {
          try {
            const marketDate = new Date(dataPoint.timestamp);
            const dateKey = marketDate.toISOString().split('T')[0];
            const tbValue = dataPoint.dayAheadPrice; // TB2/TB4 value
            
            // Store TB4/TB2 calculation (already calculated by Yes Energy)
            await db.tB4Calculation.upsert({
              where: {
                locationId_marketDate: {
                  locationId: dbLocation.id,
                  marketDate: marketDate
                }
              },
              create: {
                locationId: dbLocation.id,
                marketDate: marketDate,
                tb4Value: tbValue,
                peakHours: [], // Not provided by Yes Energy
                troughHours: [], // Not provided by Yes Energy
                avgPeakPrice: 0, // Not provided by Yes Energy
                avgTroughPrice: 0, // Not provided by Yes Energy
                dataQuality: 'complete'
              },
              update: {
                tb4Value: tbValue,
                dataQuality: 'complete'
              }
            });
            
            console.log(`  📊 ${dateKey}: TB${yesLocation.market === 'ERCOT' ? '2' : '4'} = $${tbValue.toFixed(2)}/MWh`);
            
          } catch (dayError) {
            console.error(`  ❌ Error processing data point:`, dayError);
            results.errors.push(`${yesLocation.locationName} - ${dataPoint.timestamp}: ${dayError}`);
          }
        }
        
        // Update YTD performance for this location
        await updateYTDPerformance(dbLocation.id);
        
        results.succeeded++;
        
      } catch (locationError) {
        console.error(`❌ Error processing ${yesLocation.locationName}:`, locationError);
        results.errors.push(`${yesLocation.locationName}: ${locationError}`);
        results.failed++;
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ Poll complete! ${results.succeeded} succeeded, ${results.failed} failed in ${duration}s`);
    
    if (results.errors.length > 0) {
      console.error('\n⚠️  Errors:', results.errors);
    }
    
    return {
      success: true,
      ...results,
      duration: parseFloat(duration)
    };
    
  } catch (error) {
    console.error('💥 Fatal error in poll job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      ...results
    };
  }
}

/**
 * Update YTD performance metrics for a location
 */
async function updateYTDPerformance(locationId: string) {
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1);
  const now = new Date();
  
  // Get all TB4 calculations for this year
  const tb4Data = await db.tB4Calculation.findMany({
    where: {
      locationId,
      marketDate: {
        gte: yearStart,
        lte: now
      }
    },
    orderBy: { marketDate: 'asc' }
  });
  
  if (tb4Data.length === 0) {
    console.log(`  ℹ️  No YTD data available yet`);
    return;
  }
  
  // Calculate YTD average
  const ytdTB4Avg = tb4Data.reduce((sum: number, d: any) => sum + d.tb4Value, 0) / tb4Data.length;
  
  // Get year-ahead forecast for comparison
  const forecast = await db.forecast.findFirst({
    where: {
      locationId,
      forecastYear: currentYear,
      forecastType: 'year_ahead'
    }
  });
  
  let actualPValue: number | null = null;
  let variance: number | null = null;
  
  if (forecast && forecast.tb4Forecast) {
    // Simple P-value calculation (you can make this more sophisticated)
    const diff = ytdTB4Avg - forecast.tb4Forecast;
    const stdDev = 1.5; // Assumed standard deviation, should come from forecast data
    const zScore = diff / stdDev;
    actualPValue = Math.round(Math.max(5, Math.min(95, 50 + zScore * 22.5)));
    variance = diff;
  }
  
  // Update YTD performance record
  await db.yTDPerformance.upsert({
    where: {
      locationId_year: {
        locationId,
        year: currentYear
      }
    },
    create: {
      locationId,
      year: currentYear,
      ytdTB4Avg,
      ytdDaysCount: tb4Data.length,
      actualPValue,
      forecastPValue: forecast?.pValueTarget,
      variance
    },
    update: {
      ytdTB4Avg,
      ytdDaysCount: tb4Data.length,
      actualPValue,
      forecastPValue: forecast?.pValueTarget,
      variance
    }
  });
  
  console.log(`  📈 YTD Updated: ${tb4Data.length} days, avg = $${ytdTB4Avg.toFixed(2)}/MWh${actualPValue ? `, P${actualPValue}` : ''}`);
}

/**
 * Backfill historical data
 * Use this to populate the database with historical data
 */
export async function backfillHistoricalData(startDate: Date, endDate: Date, locations?: string[]) {
  console.log('📚 Starting historical backfill...');
  
  const currentDate = new Date(startDate);
  const results = [];
  
  while (currentDate <= endDate) {
    console.log(`\n📅 Backfilling ${currentDate.toISOString().split('T')[0]}`);
    
    const result = await pollYesEnergyData({
      date: new Date(currentDate),
      locations,
      backfillDays: 1
    });
    
    results.push(result);
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✨ Backfill complete!');
  return results;
}

// Example: Run manually for testing
// Check if this is the main module (ES module compatible)
import { fileURLToPath } from 'url';
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  pollYesEnergyData()
    .then(result => {
      console.log('Result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

