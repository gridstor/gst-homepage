import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, TrendingDown, Loader2, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MarketAnalyticsCardProps {
  market: string;
  accent: string;
  accentColor: string;
}

interface LocationPerformance {
  name: string;
  locationId: string;
  ytdTB4: number;
  ytdDaysCount: number;
  yearAheadForecast: number;
  pValue: string;
  pValueAmount: number;
  boyForecast: number;
  boyDaysRemaining: number;
  neededToMeet: number;
  neededPValue: string;
  projectedTotal: number;
  yoyChange: string;
  asProportion: number;
}

interface MarketPerformanceData {
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

export default function MarketAnalyticsCard({ 
  market,
  accent, 
  accentColor 
}: MarketAnalyticsCardProps) {
  const [performanceData, setPerformanceData] = useState<MarketPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  // Fetch performance data from API
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/market-performance?market=${market}`);
        const result = await response.json();
        
        if (!result.success) {
          throw new Error('Failed to fetch performance data');
        }
        
        // Get data for this market
        const marketData = result.data.find((d: MarketPerformanceData) => d.market === market);
        
        if (!marketData) {
          throw new Error(`No data found for market ${market}`);
        }
        
        setPerformanceData(marketData);
        
        // Set default location
        if (marketData.locations.length > 0 && !selectedLocation) {
          setSelectedLocation(marketData.locations[0].name);
        }
        
      } catch (err) {
        console.error('Error fetching performance data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPerformance();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchPerformance, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [market]);
  
  // Loading state
  if (loading) {
    return (
      <motion.div 
        className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${accent} transition-all duration-200 flex items-center justify-center min-h-[400px]`}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading {market} data...</p>
        </div>
      </motion.div>
    );
  }
  
  // Error state
  if (error || !performanceData) {
    return (
      <motion.div 
        className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${accent} transition-all duration-200`}
      >
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Failed to load {market} data</p>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </motion.div>
    );
  }
  
  // Get current location data
  const currentLocationData = performanceData.locations.find(loc => loc.name === selectedLocation) 
    || performanceData.locations[0];
  
  if (!currentLocationData) {
    return null;
  }
  
  const isPositive = currentLocationData.yoyChange.startsWith('+');
  const isOverForecast = currentLocationData.pValueAmount > 0;
  const pValueNumber = parseInt(currentLocationData.pValue.replace('P', ''));
  const totalWithAS = (currentLocationData.projectedTotal * currentLocationData.asProportion).toFixed(2);
  
  // Format last updated timestamp
  const lastUpdated = new Date(performanceData.lastUpdated).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return (
    <motion.div 
      whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
      className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${accent} transition-all duration-200`}
    >
      {/* Last Updated */}
      <div className="mb-4 pb-3 border-b border-gray-100">
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Clock size={12} />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>

      {/* Header with Location Dropdown */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-800" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            {market}
          </h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
            {performanceData.tbType}
          </span>
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{currentLocationData.yoyChange} YoY</span>
        </div>
      </div>

      {/* Location Selector */}
      <div className="mb-4">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full bg-gray-50 border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {performanceData.locations.map((location) => (
              <SelectItem key={location.locationId} value={location.name}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* YTD TB */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">YTD {performanceData.tbType}</div>
          <div className="text-lg font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
            ${currentLocationData.ytdTB4.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">$/kW-month</div>
        </div>

        {/* Year Ahead Forecast */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Year Ahead Forecast</div>
          <div className="text-lg font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
            ${currentLocationData.yearAheadForecast.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">$/kW-month</div>
        </div>

        {/* P-Value YTD */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">{currentLocationData.pValue} YTD</div>
          <div className={`text-sm font-semibold ${isOverForecast ? 'text-green-600' : 'text-red-600'}`}>
            {isOverForecast ? '+' : ''}{currentLocationData.pValueAmount.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">vs forecast</div>
        </div>

        {/* BOY Forecast */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">BOY Forecast</div>
          <div className="text-lg font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
            ${currentLocationData.boyForecast.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">$/kW-month</div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <div className="bg-yellow-50 rounded-md p-3">
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-1 font-medium">Needed to Meet {currentLocationData.neededPValue}</div>
          <div className="text-base font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
            ${currentLocationData.neededToMeet.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">$/kW-month</div>
        </div>
</div>

      {/* Projected Total */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 font-medium">Projected Total (YTD + BOY)</div>
            <div className="text-xl font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
              ${currentLocationData.projectedTotal.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">$/kW-month</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">vs Forecast</div>
            <div className={`text-sm font-semibold ${currentLocationData.projectedTotal > currentLocationData.yearAheadForecast ? 'text-green-600' : 'text-red-600'}`}>
              {currentLocationData.projectedTotal > currentLocationData.yearAheadForecast ? '+' : ''}{(currentLocationData.projectedTotal - currentLocationData.yearAheadForecast).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* AS Proportion */}
      <div className="bg-green-50 rounded-md p-4">
        <div className="text-xs text-gray-600 uppercase tracking-wider mb-2 font-medium">Estimated AS Proportion</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Multiplier</div>
            <div className="text-base font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
              {currentLocationData.asProportion.toFixed(2)}x
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Energy Arb + AS Revenue</div>
            <div className="text-base font-bold text-green-600 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
              ${totalWithAS}
            </div>
            <div className="text-xs text-gray-600">$/kW-month</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
