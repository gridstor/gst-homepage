import type { APIRoute } from 'astro';
import { prisma } from '../../lib/db';

/**
 * Market Performance API Endpoint
 * 
 * Returns year-to-date performance, forecasts, and balance-of-year projections
 * for specified markets (CAISO, ERCOT, SPP)
 * 
 * Query params:
 * - market: Filter by market (optional, defaults to all)
 * - year: Target year (optional, defaults to current year)
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
  
  // Year-to-date actuals
  ytdTB4: number;              // YTD average TB4 ($/MWh converted to $/kW-month)
  ytdDaysCount: number;        // Number of days in YTD calculation
  
  // Forecasts
  yearAheadForecast: number;   // Original forecast for the year
  pValue: string;              // e.g., "P35" - where actuals fall in distribution
  pValueAmount: number;        // Difference from forecast
  
  // Balance of year
  boyForecast: number;         // Remaining months forecast
  boyDaysRemaining: number;
  
  // Performance targets
  neededToMeet: number;        // TB4 needed to meet target P-value
  neededPValue: string;        // Target P-value
  
  // Projections
  projectedTotal: number;      // (YTD weighted + BOY weighted)
  yoyChange: string;           // vs last year same period
  
  // Ancillary services
  asProportion: number;        // Multiplier for total revenue (e.g., 1.1 = 110%)
}

// Utility: Convert TB4 ($/MWh) to revenue ($/kW-month)
// Simplified conversion: assumes 2-hour discharge daily
// TB4 * hours_per_day * days_per_month * efficiency / kW = $/kW-month
function tb4ToRevenue(tb4MWh: number, hoursPerDay: number = 2, efficiency: number = 0.85): number {
  // TB4 in $/MWh * 2 hours/day * 30.4 days/month * 0.85 efficiency / 1000 kW/MW
  return (tb4MWh * hoursPerDay * 30.4 * efficiency) / 1000;
}

// Calculate P-value (percentile in forecast distribution)
function calculatePValue(actual: number, forecast: number, forecastStdDev: number = 1.5): number {
  // Simplified: assume normal distribution
  // z-score = (actual - forecast) / stdDev
  const zScore = (actual - forecast) / forecastStdDev;
  
  // Convert z-score to percentile (approximate)
  // For now, simple linear mapping: -2σ = P5, 0σ = P50, +2σ = P95
  const percentile = Math.max(5, Math.min(95, 50 + (zScore * 22.5)));
  
  return Math.round(percentile);
}

// Main data fetching function
async function getMarketPerformanceData(
  market?: string,
  year?: number,
  location?: string
): Promise<PerformanceData[]> {
  
  // Default to current year
  const targetYear = year || new Date().getFullYear();
  const currentDate = new Date();
  const yearStart = new Date(targetYear, 0, 1);
  const dayOfYear = Math.floor((currentDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
  const daysInYear = 365; // Simplification
  
  // TODO: Replace with actual database queries once Yes Energy data is populated
  // For now, return structure with mock calculations
  
  try {
    // Query locations from database
    const locations = await (prisma as any).location.findMany({
      where: {
        market: market ? market.toUpperCase() : undefined,
        name: location ? location : undefined,
        isActive: true
      },
      include: {
        tb4Calculations: {
          where: {
            marketDate: {
              gte: yearStart,
              lte: currentDate
            }
          },
          orderBy: { marketDate: 'asc' }
        },
        forecasts: {
          where: {
            forecastYear: targetYear,
            forecastType: 'year_ahead'
          }
        },
        ytdPerformance: {
          where: {
            year: targetYear
          }
        }
      }
    });
    
    // Group by market
    const marketGroups: { [key: string]: typeof locations } = {};
    locations.forEach(loc => {
      if (!marketGroups[loc.market]) {
        marketGroups[loc.market] = [];
      }
      marketGroups[loc.market].push(loc);
    });
    
    // Build performance data for each market
    const performanceData: PerformanceData[] = Object.entries(marketGroups).map(([mkt, locs]) => {
      
      const locationPerformance: LocationPerformance[] = locs.map(loc => {
        
        // Calculate YTD average TB4
        const tb4Values = loc.tb4Calculations.map(calc => calc.tb4Value);
        const ytdTB4Raw = tb4Values.length > 0 
          ? tb4Values.reduce((a, b) => a + b, 0) / tb4Values.length 
          : 0;
        
        // Convert to $/kW-month
        const ytdTB4 = tb4ToRevenue(ytdTB4Raw);
        
        // Get forecast
        const forecast = loc.forecasts[0];
        const yearAheadForecast = forecast?.tb4Forecast || 0;
        
        // Calculate P-value
        const pValueNum = calculatePValue(ytdTB4, yearAheadForecast);
        const pValue = `P${pValueNum}`;
        const pValueAmount = ytdTB4 - yearAheadForecast;
        
        // BOY projection (simplified: assume same as YTD for now)
        const boyForecast = ytdTB4;
        const boyDaysRemaining = daysInYear - dayOfYear;
        
        // Weighted projection
        const ytdWeight = dayOfYear / daysInYear;
        const boyWeight = boyDaysRemaining / daysInYear;
        const projectedTotal = (ytdTB4 * ytdWeight) + (boyForecast * boyWeight);
        
        // Target P-value (simplified)
        const targetPValue = forecast?.pValueTarget || 50;
        const neededPValue = `P${targetPValue}`;
        const neededToMeet = yearAheadForecast; // Simplified
        
        // YoY change (TODO: calculate from last year data)
        const yoyChange = "+0.0%";
        
        // AS proportion (TODO: get from market-specific config)
        const asProportion = mkt === 'ERCOT' ? 1.25 : mkt === 'SPP' ? 1.34 : 1.10;
        
        return {
          name: loc.name,
          locationId: loc.id,
          ytdTB4: parseFloat(ytdTB4.toFixed(2)),
          ytdDaysCount: tb4Values.length,
          yearAheadForecast: parseFloat(yearAheadForecast.toFixed(2)),
          pValue,
          pValueAmount: parseFloat(pValueAmount.toFixed(2)),
          boyForecast: parseFloat(boyForecast.toFixed(2)),
          boyDaysRemaining,
          neededToMeet: parseFloat(neededToMeet.toFixed(2)),
          neededPValue,
          projectedTotal: parseFloat(projectedTotal.toFixed(2)),
          yoyChange,
          asProportion
        };
      });
      
      // Determine TB type (simplified - TB4 for CAISO/SPP, TB2 for ERCOT)
      const tbType = mkt === 'ERCOT' ? 'TB2' : 'TB4';
      
      return {
        market: mkt,
        tbType,
        locations: locationPerformance,
        lastUpdated: new Date().toISOString(),
        metadata: {
          dataSource: 'database',
          calculationDate: currentDate.toISOString(),
          year: targetYear
        }
      };
    });
    
    return performanceData;
    
  } catch (error) {
    console.error('Error fetching market performance:', error);
    throw error;
  }
}

// Mock data function (fallback until DB is populated)
function getMockPerformanceData(): PerformanceData[] {
  return [
    {
      market: 'CAISO',
      tbType: 'TB4',
      locations: [
        {
          name: 'Goleta',
          locationId: 'caiso_goleta',
          ytdTB4: 7.85,
          ytdDaysCount: 304,
          yearAheadForecast: 8.20,
          pValue: 'P35',
          pValueAmount: -0.35,
          boyForecast: 8.45,
          boyDaysRemaining: 61,
          neededToMeet: 8.55,
          neededPValue: 'P25',
          projectedTotal: 8.32,
          yoyChange: '+4.2%',
          asProportion: 1.10
        },
        {
          name: 'SP15',
          locationId: 'caiso_sp15',
          ytdTB4: 7.92,
          ytdDaysCount: 304,
          yearAheadForecast: 8.30,
          pValue: 'P38',
          pValueAmount: -0.38,
          boyForecast: 8.50,
          boyDaysRemaining: 61,
          neededToMeet: 8.60,
          neededPValue: 'P28',
          projectedTotal: 8.35,
          yoyChange: '+3.8%',
          asProportion: 1.10
        },
        {
          name: 'NP15',
          locationId: 'caiso_np15',
          ytdTB4: 8.05,
          ytdDaysCount: 304,
          yearAheadForecast: 8.40,
          pValue: 'P42',
          pValueAmount: -0.35,
          boyForecast: 8.60,
          boyDaysRemaining: 61,
          neededToMeet: 8.70,
          neededPValue: 'P32',
          projectedTotal: 8.45,
          yoyChange: '+5.1%',
          asProportion: 1.10
        }
      ],
      lastUpdated: new Date().toISOString(),
      metadata: {
        dataSource: 'mock',
        calculationDate: new Date().toISOString(),
        year: new Date().getFullYear()
      }
    },
    {
      market: 'ERCOT',
      tbType: 'TB2',
      locations: [
        {
          name: 'Houston Hub',
          locationId: 'ercot_houston',
          ytdTB4: 9.12,
          ytdDaysCount: 304,
          yearAheadForecast: 8.75,
          pValue: 'P65',
          pValueAmount: 0.37,
          boyForecast: 8.95,
          boyDaysRemaining: 61,
          neededToMeet: 8.38,
          neededPValue: 'P85',
          projectedTotal: 9.05,
          yoyChange: '+7.8%',
          asProportion: 1.25
        },
        {
          name: 'Hidden Lakes',
          locationId: 'ercot_hidden_lakes',
          ytdTB4: 9.25,
          ytdDaysCount: 304,
          yearAheadForecast: 8.85,
          pValue: 'P68',
          pValueAmount: 0.40,
          boyForecast: 9.10,
          boyDaysRemaining: 61,
          neededToMeet: 8.50,
          neededPValue: 'P88',
          projectedTotal: 9.18,
          yoyChange: '+8.2%',
          asProportion: 1.25
        },
        {
          name: 'Gunnar',
          locationId: 'ercot_gunnar',
          ytdTB4: 8.95,
          ytdDaysCount: 304,
          yearAheadForecast: 8.60,
          pValue: 'P62',
          pValueAmount: 0.35,
          boyForecast: 8.75,
          boyDaysRemaining: 61,
          neededToMeet: 8.25,
          neededPValue: 'P82',
          projectedTotal: 8.87,
          yoyChange: '+7.1%',
          asProportion: 1.25
        },
        {
          name: 'South Hub',
          locationId: 'ercot_south',
          ytdTB4: 9.05,
          ytdDaysCount: 304,
          yearAheadForecast: 8.70,
          pValue: 'P64',
          pValueAmount: 0.35,
          boyForecast: 8.85,
          boyDaysRemaining: 61,
          neededToMeet: 8.35,
          neededPValue: 'P84',
          projectedTotal: 8.97,
          yoyChange: '+7.5%',
          asProportion: 1.25
        }
      ],
      lastUpdated: new Date().toISOString(),
      metadata: {
        dataSource: 'mock',
        calculationDate: new Date().toISOString(),
        year: new Date().getFullYear()
      }
    },
    {
      market: 'SPP',
      tbType: 'TB4',
      locations: [
        {
          name: 'North Hub',
          locationId: 'spp_north',
          ytdTB4: 6.43,
          ytdDaysCount: 304,
          yearAheadForecast: 6.90,
          pValue: 'P20',
          pValueAmount: -0.47,
          boyForecast: 7.10,
          boyDaysRemaining: 61,
          neededToMeet: 7.37,
          neededPValue: 'P15',
          projectedTotal: 6.73,
          yoyChange: '-1.8%',
          asProportion: 1.34
        },
        {
          name: 'South Hub',
          locationId: 'spp_south',
          ytdTB4: 6.58,
          ytdDaysCount: 304,
          yearAheadForecast: 7.05,
          pValue: 'P23',
          pValueAmount: -0.47,
          boyForecast: 7.25,
          boyDaysRemaining: 61,
          neededToMeet: 7.50,
          neededPValue: 'P18',
          projectedTotal: 6.88,
          yoyChange: '-1.2%',
          asProportion: 1.34
        }
      ],
      lastUpdated: new Date().toISOString(),
      metadata: {
        dataSource: 'mock',
        calculationDate: new Date().toISOString(),
        year: new Date().getFullYear()
      }
    }
  ];
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const market = url.searchParams.get('market');
    const year = url.searchParams.get('year') ? parseInt(url.searchParams.get('year')!) : undefined;
    const location = url.searchParams.get('location');
    
    // Try to fetch from database
    let data: PerformanceData[];
    
    try {
      data = await getMarketPerformanceData(market || undefined, year, location || undefined);
      
      // If no data from DB, use mock data
      if (!data || data.length === 0) {
        console.log('No data from database, using mock data');
        data = getMockPerformanceData();
        
        // Filter mock data if needed
        if (market) {
          data = data.filter(d => d.market.toLowerCase() === market.toLowerCase());
        }
        if (location) {
          data = data.map(d => ({
            ...d,
            locations: d.locations.filter(l => l.name.toLowerCase().includes(location.toLowerCase()))
          })).filter(d => d.locations.length > 0);
        }
      }
    } catch (dbError) {
      console.error('Database error, falling back to mock data:', dbError);
      data = getMockPerformanceData();
    }
    
    return new Response(JSON.stringify({
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        requestedYear: year || new Date().getFullYear(),
        requestedMarket: market || 'all',
        dataSource: data[0]?.metadata?.dataSource || 'mock'
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

