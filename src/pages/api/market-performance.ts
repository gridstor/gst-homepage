import type { APIRoute } from 'astro';
import { getLatestYTDData, getHistoricalYTDData } from '../../lib/db-analytics';
import { 
  getLocationConfig, 
  getMarketLocations, 
  MARKET_CONFIGS 
} from '../../lib/market-config';

/**
 * Market Performance API Endpoint - REAL DATA VERSION
 * 
 * Fetches data from Homepage_YTD_TBx table in Analytics Workspace
 * 
 * Query params:
 * - market: Filter by market (optional, defaults to all)
 * - location: Specific location name (optional)
 */

interface PerformanceData {
  market: string;
  tbType: string;
  locations: LocationPerformance[];
  lastUpdated: string;
  metadata: {
    dataSource: string;
    calculationDate: string;
    year: number;
  };
}

interface LocationPerformance {
  name: string;
  locationId: string;
  market: string;
  locationType: 'hub' | 'node'; // Hub or Node designation
  duration: string;             // Battery duration (e.g., "2.6h", "4h")
  
  // Year-to-date actuals
  ytdTB4: number;              // YTD average TBx value ($/kW-month)
  ytdDaysCount: number;        // Number of days in YTD calculation
  
  // Year-to-date forecast (prorated portion)
  ytdForecast: number;          // Prorated forecast for YTD period
  ytdPValue: string;            // P-value comparing YTD actual vs YTD forecast (e.g., "P35")
  ytdPValueAmount: number;      // YTD actual - YTD forecast
  
  // Full year forecast
  yearAheadForecast: number;    // Original P50 forecast for the full year
  
  // Balance of year
  boyForecast: number;          // BOY energy arbitrage forecast
  boyDaysRemaining: number;
  
  // Performance targets
  neededToMeet: number;        // TBx needed to meet target P-value
  neededPValue: string;        // Target P-value
  
  // Projections
  projectedTotal: number;       // (YTD weighted + BOY weighted) energy arbitrage
  yoyChange: string;            // vs last year same period
  
  // Ancillary services
  asProportion: number;         // Multiplier for total revenue (e.g., 1.1 = 110%)
  totalWithAS: number;          // Projected total including AS
}

// Calculate P-value (percentile in forecast distribution)
function calculatePValue(actual: number, forecast: number, forecastStdDev: number = 1.5): number {
  if (forecast === 0) return 50; // Default to P50 if no forecast
  
  // z-score = (actual - forecast) / stdDev
  const zScore = (actual - forecast) / forecastStdDev;
  
  // Convert z-score to percentile (approximate)
  // -2σ = P5, 0σ = P50, +2σ = P95
  const percentile = Math.max(5, Math.min(95, 50 + (zScore * 22.5)));
  
  return Math.round(percentile);
}

// Main data fetching function using real data from Analytics Workspace
async function getMarketPerformanceDataReal(
  market?: string,
  location?: string
): Promise<PerformanceData[]> {
  
  const currentDate = new Date();
  const targetYear = currentDate.getFullYear();
  const lastYear = targetYear - 1;
  const yearStart = new Date(targetYear, 0, 1);
  const dayOfYear = Math.floor((currentDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
  const daysInYear = 365;
  const daysRemaining = daysInYear - dayOfYear;
  
  try {
    // Fetch latest YTD data from Analytics Workspace for current year
    const ytdData = await getLatestYTDData(market, location);
    
    // Fetch last year's data for YoY calculation
    console.log(`\n📅 Fetching YoY data: current year = ${targetYear}, last year = ${lastYear}`);
    const lastYearData = await getHistoricalYTDData(market, location, lastYear);
    
    if (!ytdData || ytdData.length === 0) {
      console.log('No data found in Homepage_YTD_TBx table');
      return [];
    }
    
    console.log(`Found ${ytdData.length} records from Homepage_YTD_TBx (current year)`);
    console.log(`Found ${lastYearData.length} records from last year (${lastYear})`);
    
    // Create a map of last year's data by asset for YoY calculations
    const lastYearMap = new Map<string, number>();
    lastYearData.forEach(record => {
      const key = `${record.ISO}_${record.Asset}`;
      lastYearMap.set(key, record["YTD TBx"]);
      console.log(`  Last year: ${key} = ${record["YTD TBx"]}`);
    });
    
    if (lastYearData.length === 0) {
      console.log(`⚠️  No data found for year ${lastYear}. YoY calculations will show 0.0%`);
      console.log(`   Make sure your Homepage_YTD_TBx table has data with Run Date in year ${lastYear}`);
    }
    
    // Group data by market
    const marketGroups: { [key: string]: typeof ytdData } = {};
    ytdData.forEach(record => {
      const mkt = record.ISO.toUpperCase();
      if (!marketGroups[mkt]) {
        marketGroups[mkt] = [];
      }
      marketGroups[mkt].push(record);
    });
    
    // Build performance data for each market
    const performanceData: PerformanceData[] = Object.entries(marketGroups).map(([mkt, records]) => {
      
      // Get market configuration
      const marketConfig = MARKET_CONFIGS[mkt as keyof typeof MARKET_CONFIGS] || {
        tbType: 'TB4',
        asProportion: 1.10,
        defaultTargetPValue: 50
      };
      
      const locationPerformance: LocationPerformance[] = records.map(record => {
        // Get location configuration
        const config = getLocationConfig(record.Asset, mkt);
        
        // YTD TBx value is already in $/kW-month (no conversion needed)
        const ytdTB4 = record["YTD TBx"];
        
        // Get forecast from config (or default)
        const yearAheadForecast = config?.yearAheadForecast || ytdTB4;
        
        // Calculate YTD forecast (prorated portion of full-year forecast)
        const ytdWeight = dayOfYear / daysInYear;
        const boyWeight = (daysInYear - dayOfYear) / daysInYear;
        const ytdForecast = yearAheadForecast * ytdWeight;
        
        // Calculate YTD P-value
        const ytdPValueNum = calculatePValue(ytdTB4, ytdForecast);
        const ytdPValue = `P${ytdPValueNum}`;
        const ytdPValueAmount = ytdTB4 - ytdForecast;
        
        // BOY projection (simplified: assume YTD trend continues)
        const boyForecast = ytdTB4;
        
        // Weighted projection
        const projectedTotal = (ytdTB4 * ytdWeight) + (boyForecast * boyWeight);
        
        // Target P-value
        const targetPValue = config?.targetPValue || marketConfig.defaultTargetPValue;
        const neededPValue = `P${targetPValue}`;
        
        // Calculate what's needed to meet target
        // Simplified: assume need to hit forecast to meet P50
        const neededToMeet = yearAheadForecast;
        
        // YoY change - calculate from last year's data
        const lastYearKey = `${mkt}_${record.Asset}`;
        const lastYearValue = lastYearMap.get(lastYearKey);
        let yoyChange = "+0.0%";
        
        if (lastYearValue && lastYearValue > 0) {
          const percentChange = ((ytdTB4 - lastYearValue) / lastYearValue) * 100;
          const sign = percentChange >= 0 ? '+' : '';
          yoyChange = `${sign}${percentChange.toFixed(1)}%`;
          console.log(`  ${record.Asset} YoY: ${ytdTB4} vs ${lastYearValue} = ${yoyChange}`);
        } else {
          console.log(`  ${record.Asset} YoY: No last year data for key "${lastYearKey}"`);
        }
        
        // AS proportion
        const asProportion = config?.asProportion || marketConfig.asProportion;
        
        // Total with AS
        const totalWithAS = projectedTotal * asProportion;
        
        // Location metadata
        const locationType = (config?.locationType || 'node') as 'hub' | 'node';
        const duration = config?.duration || '4h';
        
        return {
          name: config?.displayName || record.Asset,
          locationId: `${mkt.toLowerCase()}_${record.Asset.toLowerCase().replace(/\s+/g, '_')}`,
          market: mkt,
          locationType,
          duration,
          ytdTB4: parseFloat(ytdTB4.toFixed(2)),
          ytdDaysCount: dayOfYear,
          ytdForecast: parseFloat(ytdForecast.toFixed(2)),
          ytdPValue,
          ytdPValueAmount: parseFloat(ytdPValueAmount.toFixed(2)),
          yearAheadForecast: parseFloat(yearAheadForecast.toFixed(2)),
          boyForecast: parseFloat(boyForecast.toFixed(2)),
          boyDaysRemaining: daysRemaining,
          neededToMeet: parseFloat(neededToMeet.toFixed(2)),
          neededPValue,
          projectedTotal: parseFloat(projectedTotal.toFixed(2)),
          yoyChange,
          asProportion,
          totalWithAS: parseFloat(totalWithAS.toFixed(2))
        };
      });
      
      // Get the most recent Run Date
      const latestRunDate = records.reduce((latest, record) => {
        return record["Run Date"] > latest ? record["Run Date"] : latest;
      }, records[0]["Run Date"]);
      
      // Use market-level TB type (fallback for the market if needed)
      const dbTbValue = records[0]?.TBx;
      const tbType = dbTbValue?.toString().startsWith('TB') 
        ? dbTbValue 
        : `TB${dbTbValue || marketConfig.tbType.replace('TB', '')}`;
      
      return {
        market: mkt,
        tbType: tbType,
        locations: locationPerformance,
        lastUpdated: latestRunDate.toISOString(),
        metadata: {
          dataSource: 'analytics_workspace',
          calculationDate: currentDate.toISOString(),
          year: targetYear
        }
      };
    });
    
    return performanceData;
    
  } catch (error: any) {
    console.error('Error fetching market performance from Analytics Workspace:', error);
    
    // Handle specific database errors gracefully
    if (error.code === 'P2010' || error.meta?.code === '42P01') {
      console.warn('Homepage_YTD_TBx table does not exist. Returning empty array.');
      return [];
    }
    
    // For other errors, log and return empty array in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Development mode: Returning empty array due to database error');
      return [];
    }
    
    throw error;
  }
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const market = url.searchParams.get('market');
    const location = url.searchParams.get('location');
    
    // Fetch from Analytics Workspace
    const data = await getMarketPerformanceDataReal(
      market || undefined, 
      location || undefined
    );
    
    if (!data || data.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        data: [],
        metadata: {
          timestamp: new Date().toISOString(),
          requestedMarket: market || 'all',
          dataSource: 'analytics_workspace',
          recordCount: 0,
          warning: 'Homepage_YTD_TBx table not found or contains no data. This is expected in development mode.'
        }
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60'
        }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        requestedMarket: market || 'all',
        dataSource: 'analytics_workspace',
        recordCount: data.reduce((sum, d) => sum + d.locations.length, 0)
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error('Market Performance API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch market performance data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
