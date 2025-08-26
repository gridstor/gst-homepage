import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MarketAnalyticsCardProps {
  market: string;
  tbType: string;
  locations: string[];
  lastUpdated: string;
  ytdTB: string;
  yearAheadForecast: string;
  pValue: string;
  pValueAmount: string;
  boyForecast: string;
  neededToMeet: string;
  neededPValue: string;
  projectedTotal: string;
  yoyChange: string;
  asProportion: string;
  accent: string;
  accentColor: string;
}

export default function MarketAnalyticsCard({ 
  market, 
  tbType, 
  locations, 
  lastUpdated,
  ytdTB, 
  yearAheadForecast, 
  pValue, 
  pValueAmount, 
  boyForecast, 
  neededToMeet, 
  neededPValue, 
  projectedTotal, 
  yoyChange,
  asProportion,
  accent, 
  accentColor 
}: MarketAnalyticsCardProps) {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const isPositive = yoyChange.startsWith('+');
  const isOverForecast = pValueAmount.startsWith('+');
  const pValueNumber = parseInt(pValue.replace('P', ''));
  const totalWithAS = (parseFloat(projectedTotal) * parseFloat(asProportion)).toFixed(2);
  
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
            {tbType}
          </span>
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{yoyChange} YoY</span>
        </div>
      </div>

      {/* Location Selector */}
      <div className="mb-4">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full bg-gray-50 border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* YTD TB */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">YTD {tbType}</div>
          <div className="text-lg font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
            ${ytdTB}
          </div>
          <div className="text-xs text-gray-600">$/kW-month</div>
        </div>

        {/* Year Ahead Forecast */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Year Ahead Forecast</div>
          <div className="text-lg font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
            ${yearAheadForecast}
          </div>
          <div className="text-xs text-gray-600">$/kW-month</div>
        </div>

        {/* P-Value YTD */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">{pValue} YTD</div>
          <div className={`text-sm font-semibold ${isOverForecast ? 'text-green-600' : 'text-red-600'}`}>
            {pValueAmount}
          </div>
          <div className="text-xs text-gray-600">vs forecast</div>
        </div>

        {/* BOY Forecast */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">BOY Forecast</div>
          <div className="text-lg font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
            ${boyForecast}
          </div>
          <div className="text-xs text-gray-600">$/kW-month</div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <div className="bg-yellow-50 rounded-md p-3">
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-1 font-medium">Needed to Meet {neededPValue}</div>
          <div className="text-base font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
            ${neededToMeet}
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
              ${projectedTotal}
            </div>
            <div className="text-xs text-gray-600">$/kW-month</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">vs Forecast</div>
            <div className={`text-sm font-semibold ${parseFloat(projectedTotal) > parseFloat(yearAheadForecast) ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(projectedTotal) > parseFloat(yearAheadForecast) ? '+' : ''}{(parseFloat(projectedTotal) - parseFloat(yearAheadForecast)).toFixed(2)}
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
              {asProportion}x
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
