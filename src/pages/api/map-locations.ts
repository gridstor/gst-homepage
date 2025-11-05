import type { APIRoute } from 'astro';
import { Pool } from 'pg';

// Database connection - requires DATABASE_URL in environment
const DATABASE_URL = import.meta.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Location data structure matching curve database schema
interface LocationData {
  id: string;
  name: string;
  market: 'CAISO' | 'ERCOT' | 'SPP';
  region: string;
  coordinates: [number, number];
  calloutPosition: { x: number; y: number }; // Position as percentage of container
  curves: {
    energyArbitrage: number; // Single value for default duration (4h)
    ancillaryServices: number; // Fixed AS value
    capacity: number; // Fixed capacity value
  };
  curveSource: 'GridStor P50' | 'Aurora Base' | 'ASCEND'; // Which curve is being used
  metadata?: {
    dbLocationName?: string; // Original database location name
    aliases?: string[]; // Alternative names
  };
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
}> = {
  'SP15': {
    displayName: 'SP15',
    dbName: 'SP15',
    market: 'CAISO',
    region: 'Southern California',
    coordinates: [-118.2437, 34.0522],
    calloutPosition: { x: 10, y: 83 },
    capacity: 7.0
  },
  'Goleta': {
    displayName: 'Goleta',
    dbName: 'Goleta',
    market: 'CAISO',
    region: 'Santa Barbara',
    coordinates: [-119.8276, 34.4208],
    calloutPosition: { x: 10, y: 50 },
    capacity: 7.0
  },
  'Houston': {
    displayName: 'Houston',
    dbName: 'Houston',
    market: 'ERCOT',
    region: 'Houston Hub',
    coordinates: [-95.3698, 29.7604],
    calloutPosition: { x: 90, y: 17 },
    capacity: 0
  },
  'Hidden Lakes': {
    displayName: 'Hidden Lakes',
    dbName: 'Hidden Lakes',
    market: 'ERCOT',
    region: 'South of Houston',
    coordinates: [-94.7977, 29.2733],
    calloutPosition: { x: 90, y: 50 },
    capacity: 0
  },
  'Gunnar': {
    displayName: 'Gunnar',
    dbName: 'Gunnar',
    market: 'ERCOT',
    region: 'South Central Texas',
    coordinates: [-97.0633, 28.0367],
    calloutPosition: { x: 90, y: 83 },
    capacity: 0
  },
  'North Hub': {
    displayName: 'North Hub',
    dbName: 'North Hub',
    market: 'SPP',
    region: 'Kansas/Northern SPP',
    coordinates: [-98.3834, 39.0473],
    calloutPosition: { x: 35, y: 10 },
    capacity: 5.0
  },
  'South Hub': {
    displayName: 'South Hub SPP',
    dbName: 'South Hub',
    market: 'SPP',
    region: 'Oklahoma/Southern SPP',
    coordinates: [-97.5164, 35.4676],
    calloutPosition: { x: 65, y: 10 },
    capacity: 5.0
  }
};

// Fetch curve data from database with hierarchy: GridStor > Aurora > Ascend
const getLocationsFromDB = async (): Promise<LocationData[]> => {
  try {
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
          AND EXTRACT(YEAR FROM cdata.timestamp) = 2026
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
        curves: {
          energyArbitrage,
          ancillaryServices: Number(ancillaryServices.toFixed(2)),
          capacity
        },
        curveSource,
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
      calloutPosition: { x: 10, y: 17 }, // Far left, top
      curves: {
        energyArbitrage: 9.12, // 4h duration
        ancillaryServices: 1.08, // Fixed AS value
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
      calloutPosition: { x: 10, y: 83 }, // Far left, bottom
      curves: {
        energyArbitrage: 9.34, // 4h duration
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
      calloutPosition: { x: 10, y: 50 }, // Far left, middle
      curves: {
        energyArbitrage: 8.89, // 4h duration
        ancillaryServices: 1.05,
        capacity: 7.0
      },
      curveSource: 'GridStor P50',
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
      calloutPosition: { x: 90, y: 17 }, // Far right, top
      curves: {
        energyArbitrage: 10.12, // 4h duration
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
      calloutPosition: { x: 90, y: 50 }, // Far right, middle
      curves: {
        energyArbitrage: 9.89, // 4h duration
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
      calloutPosition: { x: 90, y: 83 }, // Far right, bottom
      curves: {
        energyArbitrage: 9.23, // 4h duration
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
      calloutPosition: { x: 50, y: 90 }, // Bottom edge, center
      curves: {
        energyArbitrage: 9.45, // 4h duration
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
      calloutPosition: { x: 35, y: 10 }, // Top edge, left-center
      curves: {
        energyArbitrage: 7.12, // 4h duration
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
      calloutPosition: { x: 65, y: 10 }, // Top edge, right-center
      curves: {
        energyArbitrage: 7.45, // 4h duration
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
    const market = url.searchParams.get('market'); // Optional filter by market
    
    // Fetch locations from database
    let locations = await getLocationsFromDB();
    
    // Filter by market if specified
    if (market) {
      locations = locations.filter(loc => 
        loc.market.toLowerCase() === market.toLowerCase()
      );
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: locations,
      metadata: {
        total: locations.length,
        timestamp: new Date().toISOString(),
        source: 'curve_database' // Will be updated when connected to real DB
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
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



