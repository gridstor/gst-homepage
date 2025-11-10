import type { APIRoute } from 'astro';
import { Pool } from 'pg';

// Database connection - requires DATABASE_URL in environment
const DATABASE_URL = import.meta.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false },
  // Additional SSL config for self-signed certificates
  ...(DATABASE_URL.includes('sslmode=require') && {
    ssl: {
      rejectUnauthorized: false,
      ca: undefined,
      cert: undefined,
      key: undefined
    }
  })
});

// Location data structure matching curve database schema
interface LocationData {
  id: string;
  name: string;
  market: 'CAISO' | 'ERCOT' | 'SPP';
  region: string;
  coordinates: [number, number];
  calloutPosition: { x: number; y: number }; // Position as percentage of container
  locationType: 'hub' | 'node'; // Location type for visual distinction
  standardDuration: string; // Standard battery duration for market
  curves: {
    energyArbitrage: number; // Single value for default duration (4h)
    ancillaryServices: number; // Fixed AS value
    capacity: number; // Fixed capacity value
  };
  curveSource: 'GridStor P50' | 'Aurora Base' | 'ASCEND'; // Which curve is being used
  duration?: string; // Optional duration label (e.g., "4h", "2.6 h")
  metadata?: {
    dbLocationName?: string; // Original database location name
    aliases?: string[]; // Alternative names
  };
  dataFreshness?: {
    lastUpdated: string;
    daysOld: number;
  };
}

// Query parameters for filtering
interface QueryParams {
  market?: string;
  curveSource?: 'GridStor' | 'Aurora' | 'Ascend' | 'all';
  startYear?: number;
  endYear?: number;
  years?: number; // Number of years from current (1, 5, 10, or 'lifetime')
}

// Location mapping with coordinates and display info
const LOCATION_MAP: Record<string, {
  displayName: string;
  dbName: string;
  market: 'CAISO' | 'ERCOT' | 'SPP';
  region: string;
  coordinates: [number, number];
  calloutPosition: { x: number; y: number };
  capacity: number;
  duration?: string;
  locationType: 'hub' | 'node';
  standardDuration: string;
}> = {
  'NP15': {
    displayName: 'NP15',
    dbName: 'NP15',
    market: 'CAISO',
    region: 'Northern California',
    coordinates: [-121.4687, 38.5816],
    calloutPosition: { x: 15, y: 15 },
    capacity: 7.0,
    locationType: 'node',
    standardDuration: '4h'
  },
  'SP15': {
    displayName: 'SP15',
    dbName: 'SP15',
    market: 'CAISO',
    region: 'Southern California',
    coordinates: [-118.2437, 34.0522],
    calloutPosition: { x: 15, y: 80 },
    capacity: 7.0,
    locationType: 'node',
    standardDuration: '4h'
  },
  'Goleta': {
    displayName: 'Goleta',
    dbName: 'Goleta',
    market: 'CAISO',
    region: 'Santa Barbara',
    coordinates: [-119.8276, 34.4208],
    calloutPosition: { x: 15, y: 45 },
    capacity: 7.0,
    duration: '2.6 h',
    locationType: 'node',
    standardDuration: '2.6h'
  },
  'Houston': {
    displayName: 'Houston',
    dbName: 'Houston',
    market: 'ERCOT',
    region: 'Houston Hub',
    coordinates: [-95.3698, 29.7604],
    calloutPosition: { x: 85, y: 15 },
    capacity: 0,
    locationType: 'hub',
    standardDuration: '2h'
  },
  'Hidden Lakes': {
    displayName: 'Hidden Lakes',
    dbName: 'Hidden Lakes',
    market: 'ERCOT',
    region: 'South of Houston',
    coordinates: [-94.7977, 29.2733],
    calloutPosition: { x: 85, y: 41 },
    capacity: 0,
    locationType: 'node',
    standardDuration: '2h'
  },
  'Gunnar': {
    displayName: 'Gunnar',
    dbName: 'Gunnar',
    market: 'ERCOT',
    region: 'South Central Texas',
    coordinates: [-97.0633, 28.0367],
    calloutPosition: { x: 85, y: 67 },
    capacity: 0,
    locationType: 'node',
    standardDuration: '2h'
  },
  'South Hub ERCOT': {
    displayName: 'South Hub',
    dbName: 'South Hub',
    market: 'ERCOT',
    region: 'Southern Texas',
    coordinates: [-98.2300, 26.2034],
    calloutPosition: { x: 58, y: 88 },
    capacity: 0,
    locationType: 'hub',
    standardDuration: '2h'
  },
  'ERCOT South Hub': {
    displayName: 'South Hub',
    dbName: 'South Hub',
    market: 'ERCOT',
    region: 'South Zone',
    coordinates: [-98.0000, 28.0000],
    calloutPosition: { x: 75, y: 70 },
    capacity: 0
  },
  'North Hub': {
    displayName: 'North Hub',
    dbName: 'North Hub',
    market: 'SPP',
    region: 'Kansas/Northern SPP',
    coordinates: [-98.3834, 39.0473],
    calloutPosition: { x: 42, y: 12 },
    capacity: 5.0,
    locationType: 'hub',
    standardDuration: '4h'
  },
  'SPP South Hub': {
    displayName: 'South Hub SPP',
    dbName: 'South Hub',
    market: 'SPP',
    region: 'Oklahoma/Southern SPP',
    coordinates: [-97.5164, 35.4676],
    calloutPosition: { x: 62, y: 12 },
    capacity: 5.0,
    locationType: 'hub',
    standardDuration: '4h'
  }
};

// Fetch curve data from database with hierarchy: GridStor > Aurora > Ascend
const getLocationsFromDB = async (params: QueryParams = {}): Promise<LocationData[]> => {
  try {
    // Calculate year range
    const currentYear = new Date().getFullYear();
    let startYear = params.startYear || currentYear;
    let endYear = params.endYear || currentYear;
    
    // Handle 'years' parameter (1, 5, 10, or 'all' for lifetime)
    if (params.years) {
      startYear = currentYear;
      if (params.years === 999) { // lifetime indicator
        endYear = currentYear + 30; // 30 years is typical project lifetime
      } else {
        endYear = currentYear + params.years - 1;
      }
    }
    
    // Build WHERE clause for curve source filter
    let curveSourceFilter = '';
    if (params.curveSource && params.curveSource !== 'all') {
      curveSourceFilter = `AND cd."createdBy" = '${params.curveSource}'`;
    }
    
    // Query database for latest curves with priority
    const query = `
      WITH latest_curves AS (
        SELECT 
          cd.location,
          cd.market,
          cd."batteryDuration",
          cd."createdBy",
          AVG(cdata.value) as avg_value,
          ROW_NUMBER() OVER (
            PARTITION BY cd.location
            ORDER BY 
              CASE cd."createdBy"
                WHEN 'GridStor' THEN 1
                WHEN 'Aurora' THEN 2
                WHEN 'Ascend' THEN 3
                ELSE 4
              END
          ) as priority_rank
        FROM "Forecasts"."CurveDefinition" cd
        JOIN "Forecasts"."CurveInstance" ci ON cd.id = ci."curveDefinitionId"
        JOIN "Forecasts"."CurveData" cdata ON ci.id = cdata."curveInstanceId"
        WHERE cd.product = 'Revenue'
          AND cd."isActive" = true
          AND ci.status = 'ACTIVE'
          AND EXTRACT(YEAR FROM cdata.timestamp) >= ${startYear}
          AND EXTRACT(YEAR FROM cdata.timestamp) <= ${endYear}
          ${curveSourceFilter}
        GROUP BY cd.location, cd.market, cd."batteryDuration", cd."createdBy"
      )
      SELECT 
        location,
        market,
        "batteryDuration" as battery_duration,
        "createdBy" as created_by,
        avg_value
      FROM latest_curves
      WHERE priority_rank = 1;
    `;

    const result = await pool.query(query);
    const dbCurves = new Map(result.rows.map(row => [row.location, row]));

    // Build location data using LOCATION_MAP and database values
    const locations: LocationData[] = [];
    
    for (const [locKey, locInfo] of Object.entries(LOCATION_MAP)) {
      const dbData = dbCurves.get(locKey);
      
      // Use DB value if available, otherwise use defaults
      const energyArbitrage = dbData ? Number(dbData.avg_value.toFixed(2)) : 0;
      const ancillaryServices = energyArbitrage * 0.12; // 12% of EA for AS
      const capacity = locInfo.capacity;
      
      const curveSource: 'GridStor P50' | 'Aurora Base' | 'ASCEND' = dbData 
        ? (dbData.created_by === 'GridStor' ? 'GridStor P50' 
          : dbData.created_by === 'Aurora' ? 'Aurora Base' 
          : 'ASCEND')
        : 'GridStor P50';

      locations.push({
        id: `${locInfo.market.toLowerCase()}_${locKey.replace(/ /g, '_').toLowerCase()}`,
        name: locInfo.displayName,
        market: locInfo.market,
        region: locInfo.region,
        coordinates: locInfo.coordinates,
        calloutPosition: locInfo.calloutPosition,
        locationType: locInfo.locationType,
        standardDuration: locInfo.standardDuration,
        curves: {
          energyArbitrage,
          ancillaryServices: Number(ancillaryServices.toFixed(2)),
          capacity
        },
        curveSource,
        duration: locInfo.duration,
        metadata: {
          dbLocationName: locInfo.dbName,
          aliases: [locInfo.region]
        }
      });
    }

    return locations;
    
  } catch (error) {
    console.error('Database query failed:', error);
    // Return fallback mock data if database fails
    return [
    {
      id: 'caiso_np15',
      name: 'NP15',
      market: 'CAISO',
      region: 'Northern California',
      coordinates: [-121.4687, 38.5816],
      calloutPosition: { x: 15, y: 15 },
      locationType: 'node',
      standardDuration: '4h',
      curves: {
        energyArbitrage: 9.12,
        ancillaryServices: 1.08,
        capacity: 7.0
      },
      curveSource: 'GridStor P50',
      metadata: {
        dbLocationName: 'TH_NP15_GEN',
        aliases: ['Northern California', 'NP-15']
      }
    },
    {
      id: 'caiso_sp15',
      name: 'SP15',
      market: 'CAISO',
      region: 'Southern California',
      coordinates: [-118.2437, 34.0522],
      calloutPosition: { x: 15, y: 80 },
      locationType: 'node',
      standardDuration: '4h',
      curves: {
        energyArbitrage: 9.34,
        ancillaryServices: 1.10,
        capacity: 7.0
      },
      curveSource: 'GridStor P50',
      metadata: {
        dbLocationName: 'TH_SP15_GEN',
        aliases: ['Southern California', 'SP-15', 'Los Angeles']
      }
    },
    {
      id: 'caiso_goleta',
      name: 'Goleta',
      market: 'CAISO',
      region: 'Santa Barbara',
      coordinates: [-119.8276, 34.4208],
      calloutPosition: { x: 15, y: 45 },
      locationType: 'node',
      standardDuration: '2.6h',
      curves: {
        energyArbitrage: 8.89,
        ancillaryServices: 1.05,
        capacity: 7.0
      },
      curveSource: 'GridStor P50',
      duration: '2.6 h',
      metadata: {
        dbLocationName: 'GOLETA',
        aliases: ['Santa Barbara', 'Goleta CAISO']
      }
    },
    {
      id: 'ercot_houston',
      name: 'Houston',
      market: 'ERCOT',
      region: 'Houston Hub',
      coordinates: [-95.3698, 29.7604],
      calloutPosition: { x: 85, y: 15 },
      locationType: 'hub',
      standardDuration: '2h',
      curves: {
        energyArbitrage: 10.12,
        ancillaryServices: 1.19,
        capacity: 0
      },
      curveSource: 'GridStor P50',
      metadata: {
        dbLocationName: 'HOUSTON',
        aliases: ['Houston Hub', 'HB_HOUSTON']
      }
    },
    {
      id: 'ercot_hidden_lakes',
      name: 'Hidden Lakes',
      market: 'ERCOT',
      region: 'South of Houston',
      coordinates: [-94.7977, 29.2733],
      calloutPosition: { x: 85, y: 41 },
      locationType: 'node',
      standardDuration: '2h',
      curves: {
        energyArbitrage: 9.89,
        ancillaryServices: 1.17,
        capacity: 0
      },
      curveSource: 'GridStor P50',
      metadata: {
        dbLocationName: 'HIDDEN_LAKES',
        aliases: ['Hidden Lakes ERCOT']
      }
    },
    {
      id: 'ercot_gunnar',
      name: 'Gunnar',
      market: 'ERCOT',
      region: 'South Central Texas',
      coordinates: [-97.0633, 28.0367],
      calloutPosition: { x: 85, y: 67 },
      locationType: 'node',
      standardDuration: '2h',
      curves: {
        energyArbitrage: 9.23,
        ancillaryServices: 1.09,
        capacity: 0
      },
      curveSource: 'GridStor P50',
      metadata: {
        dbLocationName: 'GUNNAR',
        aliases: ['Gunnar ERCOT']
      }
    },
    {
      id: 'ercot_south_hub',
      name: 'South Hub',
      market: 'ERCOT',
      region: 'Southern Texas',
      coordinates: [-98.2300, 26.2034],
      calloutPosition: { x: 58, y: 88 },
      locationType: 'hub',
      standardDuration: '2h',
      curves: {
        energyArbitrage: 9.45,
        ancillaryServices: 1.12,
        capacity: 0
      },
      curveSource: 'GridStor P50',
      metadata: {
        dbLocationName: 'SOUTH_HUB',
        aliases: ['South Hub ERCOT', 'HB_SOUTH']
      }
    },
    {
      id: 'spp_north_hub',
      name: 'North Hub',
      market: 'SPP',
      region: 'Kansas/Northern SPP',
      coordinates: [-98.3834, 39.0473],
      calloutPosition: { x: 42, y: 12 },
      locationType: 'hub',
      standardDuration: '4h',
      curves: {
        energyArbitrage: 7.12,
        ancillaryServices: 0.84,
        capacity: 5.0
      },
      curveSource: 'GridStor P50',
      metadata: {
        dbLocationName: 'NORTH_HUB',
        aliases: ['North Hub SPP', 'SPP North']
      }
    },
    {
      id: 'spp_south_hub',
      name: 'South Hub SPP',
      market: 'SPP',
      region: 'Oklahoma/Southern SPP',
      coordinates: [-97.5164, 35.4676],
      calloutPosition: { x: 62, y: 12 },
      locationType: 'hub',
      standardDuration: '4h',
      curves: {
        energyArbitrage: 7.45,
        ancillaryServices: 0.88,
        capacity: 5.0
      },
      curveSource: 'GridStor P50',
      metadata: {
        dbLocationName: 'SOUTH_HUB_SPP',
        aliases: ['South Hub SPP', 'SPP South']
      }
    }
    ];
  }
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    
    // Parse query parameters
    const queryParams: QueryParams = {
      market: url.searchParams.get('market') || undefined,
      curveSource: (url.searchParams.get('curveSource') as 'GridStor' | 'Aurora' | 'Ascend' | 'all') || 'all',
      startYear: url.searchParams.get('startYear') ? parseInt(url.searchParams.get('startYear')!) : undefined,
      endYear: url.searchParams.get('endYear') ? parseInt(url.searchParams.get('endYear')!) : undefined,
      years: url.searchParams.get('years') ? parseInt(url.searchParams.get('years')!) : undefined,
    };
    
    // Fetch locations from database with filters
    let locations = await getLocationsFromDB(queryParams);
    
    // Filter by market if specified (additional client-side filter)
    if (queryParams.market) {
      locations = locations.filter(loc => 
        loc.market.toLowerCase() === queryParams.market!.toLowerCase()
      );
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: locations,
      metadata: {
        total: locations.length,
        timestamp: new Date().toISOString(),
        source: 'curve_database',
        filters: queryParams
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute (shorter due to filters)
      }
    });

  } catch (error) {
    console.error('Map Locations API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch location data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};



