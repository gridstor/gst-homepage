/**
 * Market Configuration and Asset Mappings
 * 
 * This file contains the mapping between database asset names and display names,
 * as well as forecast and performance targets for each market/location.
 */

export interface LocationConfig {
  assetName: string;        // Name in Homepage_YTD_TBx table
  displayName: string;      // Display name in UI
  market: string;           // CAISO, ERCOT, SPP
  tbType: string;           // TB2, TB4, etc.
  
  // Forecast data (to be configured)
  yearAheadForecast?: number;  // $/kW-month
  targetPValue?: number;        // Target P-value (e.g., 50 for P50)
  asProportion?: number;        // AS revenue multiplier
}

// Market configurations
export const MARKET_CONFIGS = {
  CAISO: {
    tbType: 'TB4',
    asProportion: 1.10,
    defaultTargetPValue: 50
  },
  ERCOT: {
    tbType: 'TB2',
    asProportion: 1.25,
    defaultTargetPValue: 50
  },
  SPP: {
    tbType: 'TB4',
    asProportion: 1.34,
    defaultTargetPValue: 50
  }
};

/**
 * Location mappings - UPDATE THESE based on your actual asset names
 * 
 * TODO: Replace assetName values with actual names from Homepage_YTD_TBx table
 * TODO: Add yearAheadForecast values for each location
 */
export const LOCATION_MAPPINGS: LocationConfig[] = [
  // CAISO
  {
    assetName: 'Goleta',  // TODO: Verify this matches your database
    displayName: 'Goleta',
    market: 'CAISO',
    tbType: 'TB4',
    yearAheadForecast: 8.20,  // TODO: Update with actual forecast
    targetPValue: 50,
    asProportion: 1.10
  },
  {
    assetName: 'SP15',
    displayName: 'SP15',
    market: 'CAISO',
    tbType: 'TB4',
    yearAheadForecast: 8.30,
    targetPValue: 50,
    asProportion: 1.10
  },
  {
    assetName: 'NP15',
    displayName: 'NP15',
    market: 'CAISO',
    tbType: 'TB4',
    yearAheadForecast: 8.40,
    targetPValue: 50,
    asProportion: 1.10
  },
  
  // ERCOT
  {
    assetName: 'Houston Hub',
    displayName: 'Houston Hub',
    market: 'ERCOT',
    tbType: 'TB2',
    yearAheadForecast: 8.75,
    targetPValue: 50,
    asProportion: 1.25
  },
  {
    assetName: 'Hidden Lakes',
    displayName: 'Hidden Lakes',
    market: 'ERCOT',
    tbType: 'TB2',
    yearAheadForecast: 8.85,
    targetPValue: 50,
    asProportion: 1.25
  },
  {
    assetName: 'Gunnar',
    displayName: 'Gunnar',
    market: 'ERCOT',
    tbType: 'TB2',
    yearAheadForecast: 8.60,
    targetPValue: 50,
    asProportion: 1.25
  },
  {
    assetName: 'South Hub',
    displayName: 'South Hub',
    market: 'ERCOT',
    tbType: 'TB2',
    yearAheadForecast: 8.70,
    targetPValue: 50,
    asProportion: 1.25
  },
  
  // SPP
  {
    assetName: 'North Hub',
    displayName: 'North Hub',
    market: 'SPP',
    tbType: 'TB4',
    yearAheadForecast: 6.90,
    targetPValue: 50,
    asProportion: 1.34
  },
  {
    assetName: 'South Hub',
    displayName: 'South Hub',
    market: 'SPP',
    tbType: 'TB4',
    yearAheadForecast: 7.05,
    targetPValue: 50,
    asProportion: 1.34
  }
];

/**
 * Get location config by asset name
 */
export function getLocationConfig(assetName: string, market: string): LocationConfig | undefined {
  return LOCATION_MAPPINGS.find(
    loc => loc.assetName.toLowerCase() === assetName.toLowerCase() && 
           loc.market.toUpperCase() === market.toUpperCase()
  );
}

/**
 * Get all locations for a market
 */
export function getMarketLocations(market: string): LocationConfig[] {
  return LOCATION_MAPPINGS.filter(loc => loc.market.toUpperCase() === market.toUpperCase());
}

/**
 * No conversion needed - values from Homepage_YTD_TBx are already in $/kW-month
 */

