import type { APIRoute } from 'astro';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: import.meta.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

interface CurveData {
  location: string;
  market: string;
  battery_duration: string;
  created_by: string;
  avg_value: number;
  months: number;
}

// Hierarchy: GridStor P50 > Aurora Base > ASCEND
const getCurveSource = (createdBy: string): 'GridStor P50' | 'Aurora Base' | 'ASCEND' => {
  if (createdBy === 'GridStor') return 'GridStor P50';
  if (createdBy === 'Aurora') return 'Aurora Base';
  return 'ASCEND';
};

export const GET: APIRoute = async () => {
  try {
    // Query for latest curve data grouped by location
    // Priority: GridStor > Aurora > Ascend
    const query = `
      WITH latest_curves AS (
        SELECT 
          cd.location,
          cd.market,
          cd."batteryDuration" as battery_duration,
          cd."createdBy" as created_by,
          AVG(cdata.value) as avg_value,
          COUNT(DISTINCT DATE_TRUNC('month', cdata.timestamp)) as months,
          ROW_NUMBER() OVER (
            PARTITION BY cd.location, cd.market 
            ORDER BY 
              CASE cd."createdBy"
                WHEN 'GridStor' THEN 1
                WHEN 'Aurora' THEN 2
                WHEN 'Ascend' THEN 3
                ELSE 4
              END,
              cd."batteryDuration" DESC
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
        battery_duration,
        created_by,
        avg_value,
        months
      FROM latest_curves
      WHERE priority_rank = 1
      ORDER BY market, location;
    `;

    const result = await pool.query<CurveData>(query);
    
    const curves = result.rows.map(row => ({
      location: row.location,
      market: row.market,
      batteryDuration: row.battery_duration,
      curveSource: getCurveSource(row.created_by),
      averageValue: Number(row.avg_value.toFixed(2)),
      dataPoints: row.months
    }));

    return new Response(JSON.stringify({
      success: true,
      data: curves,
      metadata: {
        total: curves.length,
        timestamp: new Date().toISOString(),
        source: 'analytics_workspace'
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.error('Database query error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch curve data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


