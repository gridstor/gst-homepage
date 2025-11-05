# Market Performance Overview - Live Data Integration

**Date:** October 31, 2025  
**Status:** ✅ Infrastructure Complete | 🔄 Awaiting Yes Energy Configuration

---

## 🎯 Overview

Successfully implemented a complete infrastructure for pulling live TB4 data from Yes Energy and displaying it in the Market Performance Overview section on the homepage. The system is ready to go live once Yes Energy API details are configured.

---

## 📋 What Was Built

### 1. **Database Schema** (`prisma/schema.prisma`)

Created comprehensive tables for storing LMP data and performance metrics:

#### **Location** Table
- Stores market locations (nodes) for CAISO, ERCOT, SPP
- Links to Yes Energy node IDs
- Tracks lat/long for mapping

#### **LMPData** Table  
- Stores hourly LMP data (day-ahead and real-time)
- Indexed by location, date, and hour
- Tracks energy, congestion, and loss components

#### **TB4Calculation** Table
- Pre-calculated TB4 values (peak-to-trough spread)
- Stores peak hours, trough hours, and averages
- One record per location per day

#### **Forecast** Table
- Stores year-ahead forecasts for comparison
- Tracks P-value targets
- Links to locations

#### **YTDPerformance** Table
- Aggregated year-to-date metrics
- Calculated P-value performance
- Updated daily via batch job

---

### 2. **API Endpoint** (`src/pages/api/market-performance.ts`)

Created `/api/market-performance` endpoint that:

- ✅ Returns performance data for all three markets
- ✅ Calculates YTD averages from TB4 data
- ✅ Computes P-value performance vs forecasts
- ✅ Projects balance-of-year performance
- ✅ Provides location-specific data
- ✅ Falls back to mock data until DB is populated
- ✅ Caches responses for 5 minutes

**Query Parameters:**
- `market` - Filter by CAISO, ERCOT, or SPP (optional)
- `year` - Target year (optional, defaults to current)
- `location` - Specific location name (optional)

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "market": "CAISO",
      "tbType": "TB4",
      "locations": [
        {
          "name": "NP15",
          "locationId": "caiso_np15",
          "ytdTB4": 7.85,
          "ytdDaysCount": 304,
          "yearAheadForecast": 8.20,
          "pValue": "P35",
          "pValueAmount": -0.35,
          "boyForecast": 8.45,
          "projectedTotal": 8.32,
          "yoyChange": "+4.2%",
          "asProportion": 1.10
        }
      ]
    }
  ]
}
```

---

### 3. **Yes Energy Service** (`src/lib/services/yes-energy.ts`)

Created a service class for Yes Energy integration with:

#### **Features:**
- ✅ Authentication placeholder
- ✅ Day-ahead LMP fetching structure
- ✅ Real-time LMP fetching structure
- ✅ TB4/TB2 calculation functions
- ✅ Batch location fetching
- ✅ Data transformation pipeline

#### **TB4/TB2 Calculation Functions:**
```typescript
// TB4 = Average of top 4 hours - Average of bottom 4 hours
calculateTB4(hourlyPrices: number[])

// TB2 = Average of top 2 hours - Average of bottom 2 hours (ERCOT)
calculateTB2(hourlyPrices: number[])
```

#### **Location Mappings:**
Pre-configured locations ready for node ID assignment:
- CAISO: NP15, SP15, Goleta
- ERCOT: Houston Hub, Hidden Lakes, Gunnar, South Hub
- SPP: North Hub, South Hub

---

### 4. **Updated Component** (`src/components/MarketAnalyticsCard.tsx`)

Completely refactored the MarketAnalyticsCard to:

- ✅ Fetch live data from `/api/market-performance`
- ✅ Display loading states
- ✅ Handle errors gracefully
- ✅ Auto-refresh every 5 minutes
- ✅ Support location switching
- ✅ Show YTD, forecasts, P-values, BOY projections

**Simplified Props:**
```typescript
<MarketAnalyticsCard 
  market="CAISO"
  accent="border-blue-500"
  accentColor="blue"
/>
```

Everything else is fetched from the API!

---

## 🔧 What You Need to Configure

### Step 1: Yes Energy API Credentials

Add to your `.env` file:

```bash
# Yes Energy API Configuration
YES_ENERGY_BASE_URL=https://services.yesenergy.com
YES_ENERGY_API_KEY=your_api_key_here
# OR if using username/password:
YES_ENERGY_USERNAME=your_username
YES_ENERGY_PASSWORD=your_password
```

### Step 2: Node IDs from Modeling Project

Update `src/lib/services/yes-energy.ts` line 24-65:

Replace the `PLACEHOLDER_*_NODE_ID` values with actual Yes Energy node IDs:

```typescript
export const YES_ENERGY_LOCATIONS: YesEnergyLocation[] = [
  {
    market: 'CAISO',
    locationName: 'NP15',
    nodeId: 'ACTUAL_NP15_NODE_ID_HERE'  // ← Replace this
  },
  // ... etc
];
```

**Where to find node IDs:**
- Check the Modeling Proving Ground project for LMP poll examples
- Look for object IDs or node IDs in existing queries
- Common formats: numeric IDs, alphanumeric codes, or location names

### Step 3: API Endpoints

In `src/lib/services/yes-energy.ts`, implement these methods:

#### A. **Authentication** (line 52)
```typescript
private async authenticate(): Promise<string> {
  // Replace with actual Yes Energy auth
  const response = await fetch(`${this.config.baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: this.config.username,
      password: this.config.password
    })
  });
  const { token } = await response.json();
  return token;
}
```

#### B. **Day-Ahead LMP Fetch** (line 79)
```typescript
async fetchDayAheadLMP(
  nodeId: string,
  startDate: Date,
  endDate: Date
): Promise<LMPDataPoint[]> {
  
  const token = await this.authenticate();
  
  // Example endpoint structure (adapt to actual Yes Energy API):
  const params = new URLSearchParams({
    objectid: nodeId,
    startdate: startDate.toISOString().split('T')[0],
    enddate: endDate.toISOString().split('T')[0],
    datatype: 'LMP_DA',  // ← Confirm this with Yes Energy docs
    agglevel: 'hour'
  });
  
  const response = await fetch(
    `${this.config.baseUrl}/ps/rest/timeseries/multiple.csv?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }
  );
  
  const data = await response.json();
  return this.transformYesEnergyData(data);
}
```

**Common Yes Energy Endpoints:**
- `/ps/rest/timeseries/multiple.csv` - Time series data
- `/ps/rest/objects/` - Object/node metadata
- `/ps/rest/markets/` - Market information

### Step 4: Response Transformation (line 125)

Implement `transformYesEnergyData()` based on actual API response format:

```typescript
private transformYesEnergyData(yesEnergyData: any): LMPDataPoint[] {
  // Yes Energy typically returns:
  // - CSV format: timestamp, value, objectid, etc.
  // - JSON format: array of { timestamp, value, ... }
  
  // Example transformation:
  return yesEnergyData.rows.map(row => ({
    timestamp: row.timestamp,
    hour: new Date(row.timestamp).getHours() + 1,
    dayAheadPrice: row.value,
    realTimePrice: row.rt_value,
    energyComponent: row.energy,
    congestionComponent: row.congestion,
    lossComponent: row.loss
  }));
}
```

---

## 📊 Data Flow

Once Yes Energy is configured:

```
Yes Energy API
      ↓
fetchDayAheadLMP() 
      ↓
Store in LMPData table (Prisma)
      ↓
Daily batch job calculates TB4
      ↓
Store in TB4Calculation table
      ↓
Update YTDPerformance table
      ↓
/api/market-performance endpoint
      ↓
MarketAnalyticsCard component
      ↓
Displayed on homepage
```

---

## 🚀 Testing Plan

### Phase 1: Single Location Test
1. Configure credentials for one node (e.g., NP15)
2. Run a test fetch for 7 days
3. Verify data stored in LMPData table
4. Check TB4 calculation accuracy

### Phase 2: All Locations
1. Add all node IDs
2. Implement batch fetching
3. Test error handling for missing data
4. Verify performance with full dataset

### Phase 3: Automated Polling
1. Set up daily cron job to fetch previous day's data
2. Implement retry logic for failures
3. Add monitoring/alerting
4. Verify YTD calculations update correctly

---

## 🔄 Scheduled Jobs (To Implement)

Create a scheduled job (e.g., via cron or Netlify scheduled functions) to:

1. **Daily DA LMP Fetch** (runs at 6 AM daily)
   - Fetch previous day's day-ahead LMP data
   - Store in LMPData table
   - Calculate TB4/TB2 values
   - Update TB4Calculation table

2. **Daily YTD Update** (runs at 7 AM daily)
   - Recalculate YTD averages
   - Update P-value performance
   - Refresh YTDPerformance table

3. **Weekly Forecast Sync** (runs Sunday 2 AM)
   - Sync latest forecasts from forecast system
   - Update Forecast table
   - Recalculate needed-to-meet targets

---

## 📝 Conversion Formulas

### TB4 to Revenue ($/kW-month)

The API includes a conversion function:

```typescript
function tb4ToRevenue(tb4MWh: number): number {
  // Assumes:
  // - 2-hour discharge per day
  // - 30.4 days per month
  // - 85% round-trip efficiency
  
  return (tb4MWh * 2 * 30.4 * 0.85) / 1000;
}
```

**Example:**
- TB4 = $150/MWh (day-ahead spread)
- Revenue = (150 * 2 * 30.4 * 0.85) / 1000 = $7.75/kW-month

### P-Value Calculation

```typescript
function calculatePValue(actual: number, forecast: number): number {
  // Compares actual to forecast distribution
  // Returns percentile (5-95)
  // P50 = median (at forecast)
  // P35 = 35th percentile (below forecast)
  // P65 = 65th percentile (above forecast)
}
```

---

## ⚠️ Important Notes

### 1. Data Quality
- Check for missing hours in LMP data
- Handle daylight saving time transitions (23/25-hour days)
- Validate negative prices (common in CAISO)

### 2. Rate Limiting
- Yes Energy may have API rate limits
- Implement exponential backoff
- Consider batching requests

### 3. Market Differences
- **CAISO/SPP**: Use TB4 (4-hour spread)
- **ERCOT**: Use TB2 (2-hour spread)
- Different AS proportion multipliers per market

### 4. Timezone Handling
- All markets operate in local time
- CAISO/SPP: Pacific Time
- ERCOT: Central Time
- Store timestamps in UTC in database

---

## 🎯 Next Steps

1. ✅ **[DONE]** Set up database schema
2. ✅ **[DONE]** Create API endpoint structure
3. ✅ **[DONE]** Build Yes Energy service template
4. ✅ **[DONE]** Update frontend component
5. 🔄 **[IN PROGRESS]** Get Yes Energy credentials
6. 🔄 **[IN PROGRESS]** Find node IDs in Modeling Project
7. ⏳ **[PENDING]** Implement Yes Energy API calls
8. ⏳ **[PENDING]** Test with real data
9. ⏳ **[PENDING]** Set up scheduled polling jobs
10. ⏳ **[PENDING]** Add monitoring and alerts

---

## 🔗 Related Files

- **Database Schema**: `prisma/schema.prisma`
- **API Endpoint**: `src/pages/api/market-performance.ts`
- **Yes Energy Service**: `src/lib/services/yes-energy.ts`
- **Frontend Component**: `src/components/MarketAnalyticsCard.tsx`
- **Homepage**: `src/pages/index.astro`

---

## 💡 Questions to Ask User

1. **Yes Energy Credentials:**
   - Do you have API keys or username/password?
   - What's the base URL for your Yes Energy API?

2. **Node IDs:**
   - Where in the Modeling Project are the LMP polls?
   - What format do the node IDs use?

3. **API Endpoints:**
   - What endpoint do you use for day-ahead LMPs?
   - What parameters does it expect?
   - What format does it return (CSV/JSON)?

4. **Forecast Data:**
   - Where do year-ahead forecasts come from?
   - Should we pull them from an existing system or enter manually?

5. **Update Frequency:**
   - How often should we poll Yes Energy?
   - Once daily for DA data? Real-time updates?

---

## ✨ Current Status

The system is **fully functional with mock data**. You can see it working on the homepage right now:
- Cards load
- Locations switch
- Data displays correctly
- Loading/error states work

Once you provide the Yes Energy configuration, we can switch from mock data to live data seamlessly!

