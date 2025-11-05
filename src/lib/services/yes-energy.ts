/**
 * Yes Energy API Integration Service
 * 
 * This service handles fetching LMP data from Yes Energy API
 * and storing it in our database for performance calculations.
 * 
 * NOTE: You'll need to provide:
 * 1. Yes Energy API credentials (username/password or API key)
 * 2. Specific API endpoints for day-ahead LMPs
 * 3. Node IDs/object IDs for each location
 * 4. Query parameter formats
 */

interface YesEnergyConfig {
  baseUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
}

interface LMPDataPoint {
  timestamp: string;
  hour: number;
  dayAheadPrice: number;
  realTimePrice?: number;
  energyComponent?: number;
  congestionComponent?: number;
  lossComponent?: number;
}

interface YesEnergyLocation {
  market: 'CAISO' | 'ERCOT' | 'SPP';
  locationName: string;
  nodeId: string;  // Yes Energy node/object ID
  objectId?: string;
}

// Location mappings with actual Yes Energy object IDs
// These IDs are used with the DA_PEAK2TROUGH2 (TB2) and DA_PEAK2TROUGH4 (TB4) endpoints
export const YES_ENERGY_LOCATIONS: YesEnergyLocation[] = [
  // CAISO (TB4)
  {
    market: 'CAISO',
    locationName: 'NP15',
    nodeId: '20000004677',
    objectId: 'TH_NP15_GEN-APND'
  },
  {
    market: 'CAISO',
    locationName: 'SP15',
    nodeId: '20000004682',
    objectId: 'TH_SP15_GEN-APND'
  },
  {
    market: 'CAISO',
    locationName: 'Goleta',
    nodeId: '20000001321',
    objectId: 'GOLETA_6_N100'
  },
  // ERCOT (TB2)
  {
    market: 'ERCOT',
    locationName: 'Houston Hub',
    nodeId: '10000697077',
    objectId: 'HB_HOUSTON'
  },
  {
    market: 'ERCOT',
    locationName: 'Hidden Lakes',
    nodeId: '10002872961',
    objectId: 'BAC_RN_ALL'
  },
  {
    market: 'ERCOT',
    locationName: 'South Hub',
    nodeId: '10000697079',
    objectId: 'HB_SOUTH'
  },
  // SPP (TB4)
  {
    market: 'SPP',
    locationName: 'North Hub',
    nodeId: '10002511523',
    objectId: 'SPPNORTH_HUB'
  },
  {
    market: 'SPP',
    locationName: 'South Hub',
    nodeId: '10002511524',
    objectId: 'SPPSOUTH_HUB'
  }
];

export class YesEnergyService {
  private config: YesEnergyConfig;
  private lastRequestTime: number = 0;
  private readonly RATE_LIMIT_MS = 6000; // 6 seconds between requests
  
  constructor(config: YesEnergyConfig) {
    this.config = config;
    console.log('YES Energy client initialized');
  }
  
  /**
   * Enforce rate limiting between requests
   * Matches your Python implementation's 6-second rate limit
   */
  private async rateLimit(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestTime;
    if (elapsed < this.RATE_LIMIT_MS) {
      const sleepTime = this.RATE_LIMIT_MS - elapsed;
      console.log(`Rate limiting: sleeping for ${(sleepTime / 1000).toFixed(2)} seconds`);
      await new Promise(resolve => setTimeout(resolve, sleepTime));
    }
    this.lastRequestTime = Date.now();
  }
  
  /**
   * Create Basic Auth header
   * Yes Energy uses HTTP Basic Authentication
   */
  private getAuthHeader(): string {
    if (!this.config.username || !this.config.password) {
      throw new Error('Yes Energy credentials not configured');
    }
    const credentials = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
    return `Basic ${credentials}`;
  }
  
  /**
   * Fetch TB2/TB4 data using the multiple items endpoint
   * This fetches pre-calculated peak-to-trough values directly from Yes Energy
   * 
   * @param locations Array of locations to fetch
   * @param startDate Start date
   * @param endDate End date
   * @returns Map of location name to TB data points
   */
  async fetchTB2TB4Data(
    locations: YesEnergyLocation[],
    startDate: Date,
    endDate: Date
  ): Promise<Map<string, LMPDataPoint[]>> {
    
    // Apply rate limiting
    await this.rateLimit();
    
    // Format dates as YYYY-MM-DD (matching the endpoint format)
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    // Build items string: "DA_PEAK2TROUGH2:objectid,DA_PEAK2TROUGH4:objectid,..."
    const items = locations.map(loc => {
      const dataType = loc.market === 'ERCOT' ? 'DA_PEAK2TROUGH2' : 'DA_PEAK2TROUGH4';
      return `${dataType}:${loc.nodeId}`;
    }).join(',');
    
    console.log(`Fetching TB2/TB4 data for ${locations.length} locations from ${startDateStr} to ${endDateStr}`);
    
    // Build URL with items parameter
    const url = `${this.config.baseUrl}/timeseries/multiple.html`;
    const params = new URLSearchParams({
      startdate: startDateStr,
      enddate: endDateStr,
      items: items
    });
    
    // Make API request with retry logic
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(`${url}?${params}`, {
          method: 'GET',
          headers: {
            'Authorization': this.getAuthHeader(),
            'Accept': 'application/json, text/html'
          },
          signal: AbortSignal.timeout(30000)
        });
        
        if (!response.ok) {
          throw new Error(`Yes Energy API error: ${response.status} ${response.statusText}`);
        }
        
        // Parse response (typically HTML table or JSON)
        const contentType = response.headers.get('content-type') || '';
        let data: any;
        
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // HTML or text format
          data = await response.text();
        }
        
        // Transform to our format and group by location
        const groupedData = this.transformTB2TB4Response(data, locations);
        
        console.log(`Fetched TB2/TB4 data for ${groupedData.size} locations`);
        return groupedData;
        
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (attempt < 3) {
          const waitTime = Math.min(4000 * Math.pow(2, attempt - 1), 10000);
          console.log(`Retrying in ${waitTime / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    throw lastError || new Error('Failed to fetch TB2/TB4 data after 3 attempts');
  }
  
  /**
   * Fetch day-ahead TB2/TB4 data for a specific location
   * This uses Yes Energy's pre-calculated peak-to-trough values
   */
  async fetchDayAheadTB(
    locationName: string,
    startDate: Date,
    endDate: Date
  ): Promise<LMPDataPoint[]> {
    
    // Find the location configuration
    const location = YES_ENERGY_LOCATIONS.find(loc => loc.locationName === locationName);
    if (!location) {
      throw new Error(`Unknown location: ${locationName}`);
    }
    
    // Fetch using the multi-item endpoint
    const dataMap = await this.fetchTB2TB4Data([location], startDate, endDate);
    
    return dataMap.get(locationName) || [];
  }
  
  /**
   * Legacy method for compatibility - now fetches TB2/TB4 instead of raw LMP
   */
  async fetchDayAheadLMP(
    nodeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<LMPDataPoint[]> {
    // Find location by nodeId
    const location = YES_ENERGY_LOCATIONS.find(loc => loc.nodeId === nodeId);
    if (!location) {
      throw new Error(`Unknown node ID: ${nodeId}`);
    }
    
    return this.fetchDayAheadTB(location.locationName, startDate, endDate);
  }
  
  /**
   * Fetch real-time LMP data
   * Similar to day-ahead, but for real-time market
   */
  async fetchRealTimeLMP(
    nodeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<LMPDataPoint[]> {
    
    throw new Error('fetchRealTimeLMP not implemented - need API endpoint details');
    
    // Implementation will be similar to fetchDayAheadLMP
    // but with different datatype parameter
  }
  
  /**
   * Parse Yes Energy API response into our format
   * Matches your Python _parse_response() method
   */
  private transformYesEnergyData(data: any): LMPDataPoint[] {
    let df: any[];
    
    // Handle different response formats (JSON or CSV)
    if (typeof data === 'string') {
      // Parse CSV format
      df = this.parseCsv(data);
    } else if (data && typeof data === 'object' && data.data) {
      // JSON with data wrapper
      df = Array.isArray(data.data) ? data.data : [data.data];
    } else if (Array.isArray(data)) {
      // Direct array
      df = data;
    } else {
      console.warn('Unexpected Yes Energy response format');
      return [];
    }
    
    // Transform to our LMPDataPoint format
    return df.map(row => {
      // Handle various timestamp column names
      const timestampStr = row.timestamp || row.date || row.datetime || row.DATETIME || row.GMT;
      const timestamp = new Date(timestampStr);
      
      // Handle various value column names
      const value = parseFloat(
        row.value || row.VALUE || row.lmp || row.LMP || row.price || row.PRICE || 0
      );
      
      return {
        timestamp: timestamp.toISOString(),
        hour: timestamp.getUTCHours() + 1, // Hour ending (1-24)
        dayAheadPrice: value,
        realTimePrice: row.rt_value ? parseFloat(row.rt_value) : undefined,
        energyComponent: row.energy ? parseFloat(row.energy) : undefined,
        congestionComponent: row.congestion ? parseFloat(row.congestion) : undefined,
        lossComponent: row.loss ? parseFloat(row.loss) : undefined
      };
    });
  }
  
  /**
   * Transform TB2/TB4 multiple items response
   * Yes Energy returns data grouped by object/location
   */
  private transformTB2TB4Response(
    data: any,
    locations: YesEnergyLocation[]
  ): Map<string, LMPDataPoint[]> {
    
    const result = new Map<string, LMPDataPoint[]>();
    
    // Parse based on response format
    let parsedData: any;
    
    if (typeof data === 'string') {
      // HTML table or CSV format
      parsedData = this.parseHtmlTable(data) || this.parseCsv(data);
    } else if (Array.isArray(data)) {
      parsedData = data;
    } else if (data && typeof data === 'object') {
      parsedData = data.data || data.items || Object.values(data);
    } else {
      console.warn('Unexpected TB2/TB4 response format');
      return result;
    }
    
    // Group data by location
    locations.forEach(location => {
      const locationData: LMPDataPoint[] = [];
      
      // Filter records for this location (by object ID or node ID)
      const records = Array.isArray(parsedData) ? parsedData.filter((row: any) => {
        return row.objectid === location.nodeId || 
               row.OBJECTID === location.nodeId ||
               row.object === location.objectId ||
               row.OBJECT === location.objectId;
      }) : [];
      
      records.forEach((row: any) => {
        const timestampStr = row.timestamp || row.TIMESTAMP || row.date || row.DATE || row.GMT;
        const timestamp = new Date(timestampStr);
        
        // TB2/TB4 value from Yes Energy
        const tbValue = parseFloat(
          row.value || row.VALUE || row.tb2 || row.TB2 || row.tb4 || row.TB4 || 0
        );
        
        locationData.push({
          timestamp: timestamp.toISOString(),
          hour: timestamp.getUTCHours() + 1,
          dayAheadPrice: tbValue, // Store TB2/TB4 as dayAheadPrice for compatibility
          realTimePrice: undefined,
          energyComponent: undefined,
          congestionComponent: undefined,
          lossComponent: undefined
        });
      });
      
      if (locationData.length > 0) {
        result.set(location.locationName, locationData);
      }
    });
    
    return result;
  }
  
  /**
   * Parse HTML table response from Yes Energy
   */
  private parseHtmlTable(html: string): any[] {
    // Simple HTML table parser for Yes Energy responses
    const rows: any[] = [];
    
    // Extract table rows (this is a simplified parser)
    const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
    if (!tableMatch) return this.parseCsv(html);
    
    const table = tableMatch[0];
    const rowMatches = table.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    
    if (rowMatches.length < 2) return [];
    
    // Parse headers
    const headerRow = rowMatches[0];
    if (!headerRow) return [];
    
    const headerCells = headerRow.match(/<th[\s\S]*?>([\s\S]*?)<\/th>/gi) || 
                        headerRow.match(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi) || [];
    const headers = headerCells.map(cell => 
      cell.replace(/<[^>]*>/g, '').trim()
    );
    
    // Parse data rows
    for (let i = 1; i < rowMatches.length; i++) {
      const dataCells = rowMatches[i].match(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi) || [];
      const values = dataCells.map(cell => 
        cell.replace(/<[^>]*>/g, '').trim()
      );
      
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        rows.push(row);
      }
    }
    
    return rows;
  }
  
  /**
   * Simple CSV parser for Yes Energy responses
   */
  private parseCsv(csvText: string): any[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const rows: any[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim();
      });
      
      rows.push(row);
    }
    
    return rows;
  }
  
  /**
   * Batch fetch for multiple locations
   */
  async fetchMultipleLocations(
    locations: YesEnergyLocation[],
    startDate: Date,
    endDate: Date
  ): Promise<Map<string, LMPDataPoint[]>> {
    
    const results = new Map<string, LMPDataPoint[]>();
    
    // Fetch in parallel (or sequential if rate-limited)
    const promises = locations.map(async (loc) => {
      try {
        const data = await this.fetchDayAheadLMP(loc.nodeId, startDate, endDate);
        results.set(loc.locationName, data);
      } catch (error) {
        console.error(`Error fetching data for ${loc.locationName}:`, error);
        results.set(loc.locationName, []);
      }
    });
    
    await Promise.all(promises);
    
    return results;
  }
}

/**
 * Calculate TB4 value from hourly LMP data
 * TB4 = Average of top 4 hours - Average of bottom 4 hours
 * 
 * @param hourlyPrices Array of 24 hourly prices
 * @returns TB4 calculation result
 */
export function calculateTB4(hourlyPrices: number[]): {
  tb4Value: number;
  peakHours: number[];
  troughHours: number[];
  avgPeakPrice: number;
  avgTroughPrice: number;
} {
  if (hourlyPrices.length !== 24) {
    throw new Error('Expected 24 hourly prices for TB4 calculation');
  }
  
  // Create array of [hour, price] pairs
  const hourPricePairs = hourlyPrices.map((price, hour) => ({ hour: hour + 1, price }));
  
  // Sort by price (descending)
  const sorted = [...hourPricePairs].sort((a, b) => b.price - a.price);
  
  // Get top 4 (peak) and bottom 4 (trough)
  const peakPairs = sorted.slice(0, 4);
  const troughPairs = sorted.slice(-4);
  
  // Calculate averages
  const avgPeakPrice = peakPairs.reduce((sum, p) => sum + p.price, 0) / 4;
  const avgTroughPrice = troughPairs.reduce((sum, p) => sum + p.price, 0) / 4;
  
  // TB4 value
  const tb4Value = avgPeakPrice - avgTroughPrice;
  
  return {
    tb4Value,
    peakHours: peakPairs.map(p => p.hour).sort((a, b) => a - b),
    troughHours: troughPairs.map(p => p.hour).sort((a, b) => a - b),
    avgPeakPrice,
    avgTroughPrice
  };
}

/**
 * Calculate TB2 value (for ERCOT)
 * TB2 = Average of top 2 hours - Average of bottom 2 hours
 */
export function calculateTB2(hourlyPrices: number[]): {
  tb2Value: number;
  peakHours: number[];
  troughHours: number[];
  avgPeakPrice: number;
  avgTroughPrice: number;
} {
  if (hourlyPrices.length !== 24) {
    throw new Error('Expected 24 hourly prices for TB2 calculation');
  }
  
  const hourPricePairs = hourlyPrices.map((price, hour) => ({ hour: hour + 1, price }));
  const sorted = [...hourPricePairs].sort((a, b) => b.price - a.price);
  
  const peakPairs = sorted.slice(0, 2);
  const troughPairs = sorted.slice(-2);
  
  const avgPeakPrice = peakPairs.reduce((sum, p) => sum + p.price, 0) / 2;
  const avgTroughPrice = troughPairs.reduce((sum, p) => sum + p.price, 0) / 2;
  
  const tb2Value = avgPeakPrice - avgTroughPrice;
  
  return {
    tb2Value,
    peakHours: peakPairs.map(p => p.hour).sort((a, b) => a - b),
    troughHours: troughPairs.map(p => p.hour).sort((a, b) => a - b),
    avgPeakPrice,
    avgTroughPrice
  };
}

// Export singleton instance (configure with env vars)
// Exact base URL from your Python implementation
export const yesEnergyService = new YesEnergyService({
  baseUrl: process.env.YES_ENERGY_BASE_URL || 'https://services.yesenergy.com/PS/rest',
  username: process.env.YES_ENERGY_USERNAME,
  password: process.env.YES_ENERGY_PASSWORD
});

/**
 * INTEGRATION CHECKLIST:
 * 
 * To complete the Yes Energy integration, you need to:
 * 
 * 1. API Credentials:
 *    - Add to .env file:
 *      YES_ENERGY_BASE_URL=https://...
 *      YES_ENERGY_API_KEY=your_key
 *      or
 *      YES_ENERGY_USERNAME=your_username
 *      YES_ENERGY_PASSWORD=your_password
 * 
 * 2. Node IDs:
 *    - Update YES_ENERGY_LOCATIONS array with actual node/object IDs
 *    - Check the Modeling Proving Ground project for reference
 * 
 * 3. API Endpoints:
 *    - Implement fetchDayAheadLMP() with correct endpoint
 *    - Implement fetchRealTimeLMP() with correct endpoint
 *    - Common Yes Energy endpoints:
 *      * /ps/rest/timeseries/multiple.csv
 *      * /ps/rest/objects/...
 *      * /ps/rest/markets/...
 * 
 * 4. Response Format:
 *    - Implement transformYesEnergyData() based on actual API response
 *    - Yes Energy typically returns CSV or JSON with columns:
 *      * TIMESTAMP, VALUE, OBJECTID, etc.
 * 
 * 5. Authentication:
 *    - Implement authenticate() method
 *    - Handle token refresh if needed
 * 
 * 6. Rate Limiting:
 *    - Add rate limiting logic if Yes Energy has limits
 *    - Consider caching strategy
 * 
 * 7. Scheduled Jobs:
 *    - Set up cron job to poll daily DA LMPs
 *    - Store in database via Prisma
 *    - Calculate and cache TB4/TB2 values
 */

