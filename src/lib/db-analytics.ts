import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Dedicated Prisma client for Analytics Workspace
// Uses DATABASE_URL_ANALYTICSWORKSPACE environment variable
const globalForAnalytics = globalThis as unknown as {
  analyticsDb: PrismaClient | undefined;
};

// Configure SSL to accept self-signed certificates
// For PostgreSQL with self-signed certs, we need to disable SSL verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const analyticsUrl = process.env.DATABASE_URL_ANALYTICSWORKSPACE || '';

export const analyticsDb = globalForAnalytics.analyticsDb ?? new PrismaClient({
  datasources: {
    db: {
      url: analyticsUrl
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForAnalytics.analyticsDb = analyticsDb;

// Type-safe raw query helper for Homepage_YTD_TBx table
export interface HomepageYTDTBx {
  Asset: string;      // Location name (shown in card dropdown)
  ISO: string;        // Market: ERCOT, CAISO, SPP
  TBx: string;        // TB type: TB2, TB4, etc.
  "YTD TBx": number;  // YTD average value in $/kW-month
  "Run Date": Date;   // When values were last updated
}

export async function getLatestYTDData(iso?: string, asset?: string): Promise<HomepageYTDTBx[]> {
  const whereConditions = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (iso) {
    whereConditions.push(`"ISO" = $${paramIndex}`);
    params.push(iso.toUpperCase());
    paramIndex++;
  }

  if (asset) {
    whereConditions.push(`"Asset" = $${paramIndex}`);
    params.push(asset);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 
    ? `WHERE ${whereConditions.join(' AND ')}` 
    : '';

  // Get the most recent Run Date for each Asset/ISO combination
  const query = `
    SELECT DISTINCT ON ("Asset", "ISO") 
      "Asset", "ISO", "TBx", "YTD TBx", "Run Date"
    FROM "Homepage_YTD_TBx"
    ${whereClause}
    ORDER BY "Asset", "ISO", "Run Date" DESC
  `;

  const results = await analyticsDb.$queryRawUnsafe<HomepageYTDTBx[]>(query, ...params);
  return results;
}

export async function getAllYTDData(): Promise<HomepageYTDTBx[]> {
  return getLatestYTDData();
}

/**
 * Get historical YTD data from a specific year for YoY comparisons
 */
export async function getHistoricalYTDData(iso?: string, asset?: string, year?: number): Promise<HomepageYTDTBx[]> {
  const whereConditions = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (iso) {
    whereConditions.push(`"ISO" = $${paramIndex}`);
    params.push(iso.toUpperCase());
    paramIndex++;
  }

  if (asset) {
    whereConditions.push(`"Asset" = $${paramIndex}`);
    params.push(asset);
    paramIndex++;
  }

  if (year) {
    whereConditions.push(`EXTRACT(YEAR FROM "Run Date") = $${paramIndex}`);
    params.push(year);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 
    ? `WHERE ${whereConditions.join(' AND ')}` 
    : '';

  // Get the most recent Run Date for each Asset/ISO combination for the specified year
  const query = `
    SELECT DISTINCT ON ("Asset", "ISO") 
      "Asset", "ISO", "TBx", "YTD TBx", "Run Date"
    FROM "Homepage_YTD_TBx"
    ${whereClause}
    ORDER BY "Asset", "ISO", "Run Date" DESC
  `;

  const results = await analyticsDb.$queryRawUnsafe<HomepageYTDTBx[]>(query, ...params);
  return results;
}

