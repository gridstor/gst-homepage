'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoAlbersUsa } from 'd3-geo';
import { Download, Loader2, AlertCircle } from 'lucide-react';

// Types for API response
interface LocationData {
  id: string;
  name: string;
  market: 'CAISO' | 'ERCOT' | 'SPP';
  region: string;
  coordinates: [number, number];
  calloutPosition: { x: number; y: number };
  curves: {
    energyArbitrage: number;
    ancillaryServices: number;
    capacity: number;
  };
  curveSource: 'GridStor P50' | 'Aurora Base' | 'ASCEND';
  metadata?: {
    dbLocationName?: string;
    aliases?: string[];
  };
}

interface ApiResponse {
  success: boolean;
  data: LocationData[];
  metadata?: {
    total: number;
    timestamp: string;
    source: string;
  };
}

// Compact React Simple Maps Dashboard with Fixed Callouts
export default function RevenueForcastMap() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/map-locations');
        const result: ApiResponse = await response.json();
        
        if (!result.success) {
          throw new Error('Failed to fetch location data');
        }
        
        setLocations(result.data);
        
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load location data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  // Helper function to get market color
  const getMarketColor = (market: string) => {
    switch (market) {
      case 'CAISO': return '#3B82F6';
      case 'ERCOT': return '#EF4444';
      case 'SPP': return '#10B981';
      default: return '#6B7280';
    }
  };

  // State to market mapping
  const stateMarkets: { [key: string]: string } = {
    "06": "CAISO", // California
    "48": "ERCOT", // Texas
    "40": "SPP",   // Oklahoma
    "20": "SPP",   // Kansas
    "31": "SPP",   // Nebraska
    "05": "SPP",   // Arkansas
    "22": "SPP",   // Louisiana
    "29": "SPP",   // Missouri
    "19": "SPP",   // Iowa
    "27": "SPP",   // Minnesota
    "38": "SPP",   // North Dakota
    "46": "SPP",   // South Dakota
    "56": "SPP",   // Wyoming
    "08": "SPP",   // Colorado
    "35": "SPP"    // New Mexico
  };

  const getStateColor = (geo: any) => {
    const stateId = geo.id;
    const market = stateMarkets[stateId];
    switch (market) {
      case "CAISO": return "#3B82F6";
      case "ERCOT": return "#EF4444";
      case "SPP": return "#10B981";
      default: return "#E5E7EB";
    }
  };

  const getRevenueBreakdown = (location: LocationData) => {
    const energyArb = location.curves.energyArbitrage;
    const as = location.curves.ancillaryServices;
    const capacity = location.curves.capacity;
    const total = energyArb + as + capacity;
    
    return {
      energyArb: energyArb.toFixed(2),
      as: as.toFixed(2),
      capacity: capacity.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const downloadData = () => {
    const data = locations.map(location => {
      const breakdown = getRevenueBreakdown(location);
      return {
        Location: location.name,
        DB_Location_Name: location.metadata?.dbLocationName || location.name,
        Market: location.market,
        Region: location.region,
        Curve_Source: location.curveSource,
        Duration: '4h',
        Energy_Arbitrage: `$${breakdown.energyArb}`,
        Ancillary_Services: `$${breakdown.as}`,
        Capacity: `$${breakdown.capacity}`,
        Total_Revenue: `$${breakdown.total}`
      };
    });
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    a.download = `revenue-forecast-${timestamp}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Map dimensions - smaller map for better spacing
  const mapWidth = 600;
  const mapHeight = 400;
  
  // Create projection - adjusted scale for smaller map
  const projection = geoAlbersUsa()
    .scale(675)
    .translate([mapWidth / 2, mapHeight / 2]);

  const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading location data...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching latest revenue forecasts</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-white rounded-lg shadow-sm">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Location Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No locations found
  if (locations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No location data available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Download Button Only */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={downloadData}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
        >
          <Download size={16} />
          Download Data
        </button>
      </div>

      {/* Map Container with Edge Callouts */}
      <div className="relative bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md min-h-[600px]" style={{ height: '800px' }}>
        {/* SVG Overlay for Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {locations.map((location) => {
            const screenCoords = projection(location.coordinates);
            if (!screenCoords) return null;
            
            // Container dimensions
            const containerPadding = 24; // p-6 = 24px
            const availableWidth = 1200 - (containerPadding * 2); // Estimate container width minus padding
            const availableHeight = 800 - (containerPadding * 2); // Container height minus padding
            
            // Map is centered in the available space
            const mapOffsetX = (availableWidth - mapWidth) / 2;
            const mapOffsetY = (availableHeight - mapHeight) / 2;
            
            // Marker position relative to container (including padding)
            const markerX = ((containerPadding + mapOffsetX + screenCoords[0]) / 1200) * 100;
            const markerY = ((containerPadding + mapOffsetY + screenCoords[1]) / 800) * 100;
            
            // Use callout position from API
            const calloutX = location.calloutPosition.x;
            const calloutY = location.calloutPosition.y;
            
            const color = getMarketColor(location.market);
            
            return (
              <line
                key={location.id}
                x1={`${markerX}%`}
                y1={`${markerY}%`}
                x2={`${calloutX}%`}
                y2={`${calloutY}%`}
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray="3,3"
                opacity="0.4"
              />
            );
          })}
        </svg>

        {/* Map Container - Centered with more space around */}
        <div className="absolute inset-6 flex items-center justify-center">
          <div className="relative" style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}>
            {/* US Map */}
            <ComposableMap
              projection="geoAlbersUsa"
              width={mapWidth}
              height={mapHeight}
              projectionConfig={{
                scale: 675
              }}
              className="w-full h-full"
            >
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStateColor(geo)}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                        },
                        hover: {
                          outline: "none",
                          filter: "brightness(1.1)",
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                      onMouseEnter={() => setHoveredState(geo.properties.name)}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                  ))
                }
              </Geographies>
              
              {/* Location Markers */}
              {locations.map((location) => (
                <Marker key={location.id} coordinates={location.coordinates}>
                  <circle
                    r={8}
                    fill={getMarketColor(location.market)}
                    stroke="white"
                    strokeWidth={2}
                    style={{
                      filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
                    }}
                  />
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </div>

        {/* Edge Callout Boxes */}
        {locations.map((location) => {
          const breakdown = getRevenueBreakdown(location);
          const color = getMarketColor(location.market);
          
          return (
            <motion.div
              key={location.id}
              whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
              className="absolute bg-white rounded-lg p-4 border-l-4 shadow-sm transition-all duration-200"
              style={{
                left: `${location.calloutPosition.x}%`,
                top: `${location.calloutPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '180px',
                borderColor: color,
                zIndex: 20
              }}
            >
              {/* Header with Location + Total */}
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <h3 className="text-sm font-semibold text-gray-800" title={location.metadata?.dbLocationName}>
                    {location.name}
                  </h3>
                </div>
                <div 
                  className="text-base font-bold font-mono"
                  style={{ 
                    color: color,
                    fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace"
                  }}
                >
                  ${breakdown.total}
                </div>
              </div>
              
              {/* Region */}
              <div className="text-[10px] text-gray-500 mb-2">{location.region}</div>
              
              {/* Divider */}
              <div className="border-t border-gray-100 mb-2" />
              
              {/* Energy Arbitrage - Featured */}
              <div className="bg-gray-50 rounded-md p-2 mb-2">
                <div className="text-[10px] uppercase tracking-wider font-medium text-gray-500 mb-0.5">
                  ENERGY ARBITRAGE (4h)
                </div>
                <div className="mb-0.5">
                  <div 
                    className="text-base font-bold font-mono text-gray-900"
                    style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}
                  >
                    ${breakdown.energyArb}
                  </div>
                </div>
                <div className="text-[10px] text-gray-600">$/kW-month</div>
              </div>
              
              {/* AS & Capacity Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-gray-50 rounded-md p-1.5">
                  <div className="text-[9px] uppercase tracking-wider font-medium text-gray-500 mb-0.5">
                    AS
                  </div>
                  <div 
                    className="text-xs font-bold font-mono text-gray-900"
                    style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}
                  >
                    ${breakdown.as}
                  </div>
                  <div className="text-[9px] text-gray-600">$/kW-mo</div>
                </div>
                
                <div className="bg-gray-50 rounded-md p-1.5">
                  <div className="text-[9px] uppercase tracking-wider font-medium text-gray-500 mb-0.5">
                    CAPACITY
                  </div>
                  <div 
                    className="text-xs font-bold font-mono text-gray-900"
                    style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}
                  >
                    ${breakdown.capacity}
                  </div>
                  <div className="text-[9px] text-gray-600">$/kW-mo</div>
                </div>
              </div>
              
              {/* Total Section */}
              <div className="border-t-2 border-gray-200 pt-2 mb-1">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-600">
                    TOTAL
                  </div>
                  <div 
                    className="text-base font-bold font-mono"
                    style={{ 
                      color: color,
                      fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace"
                    }}
                  >
                    ${breakdown.total}
                  </div>
                </div>
              </div>
              
              {/* Curve Source Indicator */}
              <div className="text-[9px] text-gray-500 text-center pt-1 border-t border-gray-100">
                {location.curveSource}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
