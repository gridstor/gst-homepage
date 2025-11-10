import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, TrendingDown, Loader2, AlertCircle, LayoutGrid, Table, Filter, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MarketAnalyticsCardProps {
  market: string;
  accent: string;
  accentColor: string;
}

interface LocationPerformance {
  name: string;
  locationId: string;
  market: string;
  locationType: 'hub' | 'node';
  duration: string;
  
  // Year-to-date actuals - Energy Arbitrage Revenue
  ytdEnergyRevenue: number;
  ytdDaysCount: number;
  
  // Year-to-date forecast (prorated portion)
  ytdForecast: number;
  ytdPValue: string;
  ytdPValueAmount: number;
  
  // Full year forecast
  yearAheadForecast: number;
  
  // Balance of year
  boyForecast: number;
  boyDaysRemaining: number;
  
  // Performance targets
  neededToMeet: number;
  boyPValue: string;
  
  // Projections
  projectedTotal: number;
  yoyChange: string;
  
  // Ancillary services
  asProportion: number;
  totalWithAS: number;
  
  lastUpdated?: string;
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

const MARKET_COLORS = {
  CAISO: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
  ERCOT: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600' },
  SPP: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' }
};

function LocationCard({ location }: { location: LocationPerformance }) {
  const colors = MARKET_COLORS[location.market as keyof typeof MARKET_COLORS];
  
  // Determine if YTD performance is above or below forecast
  const ytdIsAboveForecast = location.ytdPValueAmount > 0;
  
  // Determine if projected total will meet P50
  const boyPValueNum = parseInt(location.boyPValue.replace('P', ''));
  const boyWillMeetP50 = boyPValueNum >= 50;
  
  // Calculate AS revenue (not just the multiplier)
  const asRevenue = location.projectedTotal * (location.asProportion - 1);
  
  // Calculate start of year AS revenue
  const startOfYearAS = location.yearAheadForecast * (location.asProportion - 1);
  
  return (
    <motion.div 
      whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
      className={`bg-white dark:bg-[#2A2A2A] rounded-lg shadow-sm p-4 border-l-4 ${colors.border} transition-all duration-200`}
    >
      {/* Header: Market, Location, Hub/Node, Duration */}
      <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 text-base">
          <span className={`font-semibold ${colors.text}`}>{location.market}</span>
          <span className="font-bold text-gray-900 dark:text-gray-100">{location.name}</span>
          <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded font-medium capitalize">
            {location.locationType}
          </span>
          <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded font-mono">
            {location.duration}
          </span>
        </div>
      </div>

      {/* YTD Energy Revenue Section */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2.5">
          Year-to-Date Energy Revenue
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {/* YTD Actual */}
          <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-md p-2.5">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">YTD Actual</div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">
              ${location.ytdEnergyRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">$/kW-mo</div>
          </div>

          {/* YTD Forecast */}
          <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-md p-2.5">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">YTD Forecast</div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">
              ${location.ytdForecast.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">$/kW-mo</div>
          </div>

          {/* YTD P-Value */}
          <div className={`rounded-md p-2.5 ${ytdIsAboveForecast ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">P-Value</div>
            <div className={`text-lg font-bold font-mono ${ytdIsAboveForecast ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              {location.ytdPValue}
            </div>
            <div className={`text-xs font-semibold ${ytdIsAboveForecast ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              {ytdIsAboveForecast ? '+' : ''}{location.ytdPValueAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Balance of Year Section */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2.5">
          Balance of Year
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {/* BOY Forecast */}
          <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-md p-2.5">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">BOY Forecast</div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">
              ${location.boyForecast.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">$/kW-mo</div>
          </div>

          {/* Needed for P50 */}
          <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-md p-2.5">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">For P50 Need</div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">
              ${location.neededToMeet.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">$/kW-mo</div>
          </div>

          {/* BOY P-Value */}
          <div className={`rounded-md p-2.5 ${boyWillMeetP50 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">P-Value vs P50</div>
            <div className={`text-lg font-bold font-mono ${boyWillMeetP50 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              {location.boyPValue}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {boyWillMeetP50 ? 'Above P50' : 'Below P50'}
            </div>
          </div>
        </div>
      </div>

      {/* Annual Revenue Projection Section */}
      <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-md p-3 border border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
          Annual Revenue Projection (YTD + BOY)
        </h4>
        
        {/* Current Year Projection - Left to Right */}
        <div className="mb-3 pb-3 border-b border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-2 text-xs">
            <div className="text-center">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Energy Arb</div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                ${location.projectedTotal.toFixed(2)}
              </div>
            </div>
            <span className="text-gray-400 dark:text-gray-500">+</span>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">AS</div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                ${asRevenue.toFixed(2)}
              </div>
            </div>
            <span className="text-gray-400 dark:text-gray-500">=</span>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Total Proj</div>
              <div className="text-base font-bold text-gray-900 dark:text-gray-100 font-mono">
                ${location.totalWithAS.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Start of Year Revenue Forecast - Same Layout */}
        <div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Start of Year Forecast</div>
          <div className="flex items-center gap-2 text-xs">
            <div className="text-center">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Energy Arb</div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                ${location.yearAheadForecast.toFixed(2)}
              </div>
              <div className={`text-[9px] font-semibold mt-0.5 ${(location.projectedTotal - location.yearAheadForecast) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({(location.projectedTotal - location.yearAheadForecast) >= 0 ? '+' : ''}{(location.projectedTotal - location.yearAheadForecast).toFixed(2)})
              </div>
            </div>
            <span className="text-gray-400 dark:text-gray-500">+</span>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">AS</div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                ${startOfYearAS.toFixed(2)}
              </div>
              <div className={`text-[9px] font-semibold mt-0.5 ${(asRevenue - startOfYearAS) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({(asRevenue - startOfYearAS) >= 0 ? '+' : ''}{(asRevenue - startOfYearAS).toFixed(2)})
              </div>
            </div>
            <span className="text-gray-400 dark:text-gray-500">=</span>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Start of Year</div>
              <div className="text-base font-bold text-gray-900 dark:text-gray-100 font-mono">
                ${(location.yearAheadForecast + startOfYearAS).toFixed(2)}
              </div>
              <div className={`text-[9px] font-semibold mt-0.5 ${(location.totalWithAS - (location.yearAheadForecast + startOfYearAS)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({(location.totalWithAS - (location.yearAheadForecast + startOfYearAS)) >= 0 ? '+' : ''}{(location.totalWithAS - (location.yearAheadForecast + startOfYearAS)).toFixed(2)})
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type SortColumn = 'market' | 'location' | 'type' | 'duration' | 'ytdActual' | 'ytdForecast' | 'ytdPValue' | 'boyForecast' | 'neededToMeet' | 'boyPValue' | 'projectedTotal' | 'totalWithAS';
type SortDirection = 'asc' | 'desc' | null;

function PerformanceTable({ locations }: { locations: LocationPerformance[] }) {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
    }
    return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
  };

  // Sort locations based on current sort state
  const sortedLocations = [...locations].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    let aValue: any;
    let bValue: any;

    switch (sortColumn) {
      case 'market':
        aValue = a.market;
        bValue = b.market;
        break;
      case 'location':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'type':
        aValue = a.locationType;
        bValue = b.locationType;
        break;
      case 'duration':
        aValue = a.duration;
        bValue = b.duration;
        break;
      case 'ytdActual':
        aValue = a.ytdEnergyRevenue;
        bValue = b.ytdEnergyRevenue;
        break;
      case 'ytdForecast':
        aValue = a.ytdForecast;
        bValue = b.ytdForecast;
        break;
      case 'ytdPValue':
        aValue = a.ytdPValueAmount;
        bValue = b.ytdPValueAmount;
        break;
      case 'boyForecast':
        aValue = a.boyForecast;
        bValue = b.boyForecast;
        break;
      case 'neededToMeet':
        aValue = a.neededToMeet;
        bValue = b.neededToMeet;
        break;
      case 'boyPValue':
        aValue = parseInt(a.boyPValue.replace('P', ''));
        bValue = parseInt(b.boyPValue.replace('P', ''));
        break;
      case 'projectedTotal':
        aValue = a.projectedTotal;
        bValue = b.projectedTotal;
        break;
      case 'totalWithAS':
        aValue = a.totalWithAS;
        bValue = b.totalWithAS;
        break;
      default:
        return 0;
    }

    // Handle string vs number comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      const comparison = aValue - bValue;
      return sortDirection === 'asc' ? comparison : -comparison;
    }
  });

  const SortableHeader = ({ column, children, align = 'left' }: { column: SortColumn; children: React.ReactNode; align?: 'left' | 'center' | 'right' }) => {
    const alignClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';
    const textAlignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
    
    return (
      <th className={`px-4 py-3 ${textAlignClass} font-semibold text-gray-700 dark:text-gray-300`}>
        <button
          onClick={() => handleSort(column)}
          className={`flex items-center gap-1.5 ${alignClass} w-full hover:text-gray-900 dark:hover:text-gray-100 transition-colors`}
        >
          {children}
          {getSortIcon(column)}
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-700">
          <tr>
            <SortableHeader column="market" align="left">Market</SortableHeader>
            <SortableHeader column="location" align="left">Location</SortableHeader>
            <SortableHeader column="type" align="center">Type</SortableHeader>
            <SortableHeader column="duration" align="center">Duration</SortableHeader>
            <SortableHeader column="ytdActual" align="right">YTD Actual</SortableHeader>
            <SortableHeader column="ytdForecast" align="right">YTD Forecast</SortableHeader>
            <SortableHeader column="ytdPValue" align="center">YTD P-Val</SortableHeader>
            <SortableHeader column="boyForecast" align="right">BOY Forecast</SortableHeader>
            <SortableHeader column="neededToMeet" align="right">Need for P50</SortableHeader>
            <SortableHeader column="boyPValue" align="center">BOY P-Val</SortableHeader>
            <SortableHeader column="projectedTotal" align="right">Proj Total</SortableHeader>
            <SortableHeader column="totalWithAS" align="right">Total w/ AS</SortableHeader>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedLocations.map((location) => {
            const colors = MARKET_COLORS[location.market as keyof typeof MARKET_COLORS];
            const ytdIsAboveForecast = location.ytdPValueAmount > 0;
            const boyPValueNum = parseInt(location.boyPValue.replace('P', ''));
            const boyWillMeetP50 = boyPValueNum >= 50;
            
            return (
              <tr key={location.locationId} className="hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors">
                <td className="px-4 py-3">
                  <span className={`text-xs ${colors.bg} ${colors.text} px-2 py-1 rounded font-semibold`}>
                    {location.market}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{location.name}</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded capitalize">
                    {location.locationType}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded font-mono">
                    {location.duration}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-gray-100">${location.ytdEnergyRevenue.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-gray-100">${location.ytdForecast.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={`text-xs px-2 py-1 rounded font-mono font-semibold ${ytdIsAboveForecast ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                      {location.ytdPValue}
                    </span>
                    <span className={`text-xs font-semibold ${ytdIsAboveForecast ? 'text-green-600' : 'text-red-600'}`}>
                      {ytdIsAboveForecast ? '+' : ''}{location.ytdPValueAmount.toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-gray-100">${location.boyForecast.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono text-amber-700 dark:text-amber-500 font-semibold">${location.neededToMeet.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded font-mono font-semibold ${boyWillMeetP50 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                    {location.boyPValue}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900 dark:text-gray-100">${location.projectedTotal.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-green-600">${location.totalWithAS.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Classify location type based on name
function getLocationType(name: string): 'hub' | 'node' | 'location' {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('hub')) return 'hub';
  if (lowerName.includes('node') || lowerName.includes('np15') || lowerName.includes('sp15')) return 'node';
  return 'location';
}

export default function MarketAnalyticsCard({ 
  market,
  accent, 
  accentColor 
}: MarketAnalyticsCardProps) {
  const [allLocations, setAllLocations] = useState<LocationPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Fetch performance data from API
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/market-performance');
        const result = await response.json();
        
        if (!result.success) {
          throw new Error('Failed to fetch performance data');
        }
        
        // Flatten all locations from all markets
        const locations: LocationPerformance[] = [];
        result.data.forEach((marketData: MarketPerformanceData) => {
          marketData.locations.forEach(loc => {
            locations.push(loc);
          });
        });
        
        setAllLocations(locations);
        
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
  }, []);
  
  // Filter locations by selected market, type, and search query
  const filteredLocations = allLocations.filter(loc => {
    // Market filter
    const marketMatch = selectedMarket === 'all' || loc.market === selectedMarket;
    
    // Type filter
    const locationType = getLocationType(loc.name);
    const typeMatch = selectedType === 'all' || locationType === selectedType;
    
    // Search filter
    const searchMatch = searchQuery === '' || 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.market.toLowerCase().includes(searchQuery.toLowerCase());
    
    return marketMatch && typeMatch && searchMatch;
  });
  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gray-400 dark:text-gray-600 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading performance data...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Failed to load performance data</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{error}</p>
        </div>
      </div>
    );
  }
  
  // No data available state (not an error, just empty)
  if (allLocations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">No Performance Data Available</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 max-w-md mx-auto">
            The Homepage_YTD_TBx table is not populated yet. Please ensure the data pipeline is running and has completed at least one update cycle.
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
            Contact your database administrator to populate the table with year-to-date performance metrics.
          </p>
        </div>
      </div>
    );
  }
  
  // Count locations by type for filter labels
  const typeCounts = {
    all: allLocations.length,
    hub: allLocations.filter(loc => getLocationType(loc.name) === 'hub').length,
    node: allLocations.filter(loc => getLocationType(loc.name) === 'node').length,
    location: allLocations.filter(loc => getLocationType(loc.name) === 'location').length
  };

  return (
    <div>
      {/* Filters and View Toggle */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Top Row: Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Filter size={16} className="text-gray-500 dark:text-gray-400" />
          
          {/* Market/Region Filter */}
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[160px] bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="CAISO">CAISO</SelectItem>
              <SelectItem value="ERCOT">ERCOT</SelectItem>
              <SelectItem value="SPP">SPP</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[160px] bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types ({typeCounts.all})</SelectItem>
              <SelectItem value="hub">Hubs ({typeCounts.hub})</SelectItem>
              <SelectItem value="node">Nodes ({typeCounts.node})</SelectItem>
              <SelectItem value="location">Locations ({typeCounts.location})</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Filter */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-9 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Bottom Row: Quick Filters & View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Quick:</span>
            <button
              onClick={() => { setSelectedMarket('CAISO'); setSelectedType('all'); }}
              className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              CAISO All
            </button>
            <button
              onClick={() => { setSelectedMarket('ERCOT'); setSelectedType('all'); }}
              className="text-xs px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              ERCOT All
            </button>
            <button
              onClick={() => { setSelectedMarket('SPP'); setSelectedType('all'); }}
              className="text-xs px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              SPP All
            </button>
            <button
              onClick={() => { setSelectedMarket('all'); setSelectedType('hub'); }}
              className="text-xs px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              All Hubs
            </button>
            {(selectedMarket !== 'all' || selectedType !== 'all' || searchQuery !== '') && (
              <button
                onClick={() => { setSelectedMarket('all'); setSelectedType('all'); setSearchQuery(''); }}
                className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1A1A1A] rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-[#2A2A2A] shadow-sm text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <LayoutGrid size={16} />
              <span className="text-sm font-medium">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#2A2A2A] shadow-sm text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Table size={16} />
              <span className="text-sm font-medium">Table</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Content - Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.map((location) => (
            <LocationCard key={location.locationId} location={location} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#2A2A2A] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <PerformanceTable locations={filteredLocations} />
        </div>
      )}
    </div>
  );
}
