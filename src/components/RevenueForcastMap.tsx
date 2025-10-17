'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoAlbersUsa } from 'd3-geo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download } from 'lucide-react';

// Compact React Simple Maps Dashboard with Fixed Callouts
export default function RevenueForcastMap() {
  const [codYear, setCodYear] = useState('2026');
  const [horizon, setHorizon] = useState('10');
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Individual duration controls for all locations
  const [locationDurations, setLocationDurations] = useState({
    "NP15": "4h",
    "Goleta": "4h", 
    "SP15": "4h",
    "Houston": "4h",
    "Hidden Lakes": "4h",
    "Gunnar": "4h",
    "South Hub": "4h",
    "North Hub": "4h",
    "South Hub SPP": "4h"
  });

  const locations = {
    "NP15": { 
      coordinates: [-121.4687, 38.5816] as [number, number],
      market: "CAISO", color: "#3B82F6",
      revenue: { 
        energyArb: { "2": 8.45, "4": 9.12, "8": 9.78 },
        capacity: 7.0
      },
      region: "Northern California",
      calloutPosition: { x: 15, y: 16 }
    },
    "Goleta": { 
      coordinates: [-119.8276, 34.4208] as [number, number],
      market: "CAISO", color: "#3B82F6",
      revenue: { 
        energyArb: { "2": 8.12, "4": 8.89, "8": 9.56 },
        capacity: 7.0
      },
      region: "Santa Barbara",
      calloutPosition: { x: 15, y: 50 }
    },
    "SP15": { 
      coordinates: [-118.2437, 34.0522] as [number, number],
      market: "CAISO", color: "#3B82F6",
      revenue: { 
        energyArb: { "2": 8.67, "4": 9.34, "8": 10.01 },
        capacity: 7.0
      },
      region: "Southern California",
      calloutPosition: { x: 15, y: 84 }
    },
    "Houston": { 
      coordinates: [-95.3698, 29.7604] as [number, number],
      market: "ERCOT", color: "#EF4444",
      revenue: { 
        energyArb: { "2": 9.34, "4": 10.12, "8": 10.89 },
        capacity: 0
      },
      region: "Houston Hub",
      calloutPosition: { x: 85, y: 16 }
    },
    "Hidden Lakes": { 
      coordinates: [-94.7977, 29.2733] as [number, number],
      market: "ERCOT", color: "#EF4444",
      revenue: { 
        energyArb: { "2": 9.12, "4": 9.89, "8": 10.56 },
        capacity: 0
      },
      region: "South of Houston",
      calloutPosition: { x: 85, y: 50 }
    },
    "Gunnar": { 
      coordinates: [-97.0633, 28.0367] as [number, number],
      market: "ERCOT", color: "#EF4444",
      revenue: { 
        energyArb: { "2": 8.56, "4": 9.23, "8": 9.90 },
        capacity: 0
      },
      region: "South Central Texas",
      calloutPosition: { x: 85, y: 84 }
    },
    "South Hub": { 
      coordinates: [-98.2300, 26.2034] as [number, number],
      market: "ERCOT", color: "#EF4444",
      revenue: { 
        energyArb: { "2": 8.78, "4": 9.45, "8": 10.12 },
        capacity: 0
      },
      region: "Southern Texas",
      calloutPosition: { x: 50, y: 92 }
    },
    "North Hub": { 
      coordinates: [-98.3834, 39.0473] as [number, number],
      market: "SPP", color: "#10B981",
      revenue: { 
        energyArb: { "2": 6.45, "4": 7.12, "8": 7.78 },
        capacity: 5.0
      },
      region: "Kansas/Northern SPP",
      calloutPosition: { x: 35, y: 10 }
    },
    "South Hub SPP": { 
      coordinates: [-97.5164, 35.4676] as [number, number],
      market: "SPP", color: "#10B981",
      revenue: { 
        energyArb: { "2": 6.78, "4": 7.45, "8": 8.12 },
        capacity: 5.0
      },
      region: "Oklahoma/Southern SPP",
      calloutPosition: { x: 65, y: 10 }
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

  const updateLocationDuration = (location: string, duration: string) => {
    setLocationDurations(prev => ({
      ...prev,
      [location]: duration
    }));
  };

  const getRevenueBreakdown = (locationKey: string) => {
    const location = locations[locationKey as keyof typeof locations];
    const duration = locationDurations[locationKey as keyof typeof locationDurations];
    const baseEnergyArb = location.revenue.energyArb[duration.replace('h', '') as keyof typeof location.revenue.energyArb];
    
    // Adjust based on COD year and horizon
    const codMultiplier = 1 + (parseInt(codYear) - 2026) * 0.03;
    const horizonMultiplier = 1 + (parseInt(horizon) - 1) * 0.02;
    
    const energyArb = baseEnergyArb * codMultiplier * horizonMultiplier;
    const as = energyArb * 0.1; // AS is 10% of energy arbitrage
    const capacity = location.revenue.capacity; // Fixed capacity value
    const total = energyArb + as + capacity;
    
    return {
      energyArb: energyArb.toFixed(2),
      as: as.toFixed(2),
      capacity: capacity.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const downloadData = () => {
    const data = Object.entries(locations).map(([key, location]) => {
      const breakdown = getRevenueBreakdown(key);
      return {
        Location: key,
        Market: location.market,
        Region: location.region,
        Duration: `${locationDurations[key as keyof typeof locationDurations]}`,
        Energy_Arbitrage: `$${breakdown.energyArb}`,
        Ancillary_Services: `$${breakdown.as}`,
        Capacity: `$${breakdown.capacity}`,
        Total_Revenue: `$${breakdown.total}`,
        COD_Year: codYear,
        Forecast_Horizon: `${horizon} years`
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
    a.download = `revenue-forecast-${codYear}-${horizon}yr.csv`;
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

  return (
    <div>
      {/* Global Controls */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">COD Year</label>
                <Select value={codYear} onValueChange={setCodYear}>
                  <SelectTrigger className="h-10 w-20 bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 7 }, (_, i) => 2026 + i).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Forecast Horizon</label>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger className="h-10 w-20 bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}y
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <button
              onClick={downloadData}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200 font-medium text-sm hover:-translate-y-0.5"
            >
              <Download size={16} />
              Download Data
            </button>
          </div>
        </div>
      </div>

      {/* Map Container with Edge Callouts */}
      <div className="relative bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md min-h-[600px]" style={{ height: '800px' }}>
        {/* SVG Overlay for Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {Object.entries(locations).map(([key, location]) => {
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
            
            // Callout position (already in percentages)
            const calloutX = location.calloutPosition.x;
            const calloutY = location.calloutPosition.y;
            
            return (
              <line
                key={key}
                x1={`${markerX}%`}
                y1={`${markerY}%`}
                x2={`${calloutX}%`}
                y2={`${calloutY}%`}
                stroke={location.color}
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
              {Object.entries(locations).map(([key, location]) => (
                <Marker key={key} coordinates={location.coordinates}>
                  <circle
                    r={8}
                    fill={location.color}
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
        {Object.entries(locations).map(([key, location]) => {
          const breakdown = getRevenueBreakdown(key);
          return (
            <motion.div
              key={key}
              whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
              className="absolute bg-white rounded-lg p-4 border-l-4 shadow-sm transition-all duration-200"
              style={{
                left: `${location.calloutPosition.x}%`,
                top: `${location.calloutPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '180px',
                borderColor: location.color,
                zIndex: 20
              }}
            >
              {/* Header with Location + Total */}
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: location.color }}
                  />
                  <h3 className="text-sm font-semibold text-gray-800">{key}</h3>
                </div>
                <div 
                  className="text-base font-bold font-mono"
                  style={{ 
                    color: location.color,
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
                  ENERGY ARBITRAGE
                </div>
                <div className="flex items-center justify-between mb-0.5">
                  <div 
                    className="text-base font-bold font-mono text-gray-900"
                    style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}
                  >
                    ${breakdown.energyArb}
                  </div>
                  <Select 
                    value={locationDurations[key as keyof typeof locationDurations]} 
                    onValueChange={(value) => updateLocationDuration(key, value)}
                  >
                    <SelectTrigger className="h-6 w-12 text-[10px] bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2h">2h</SelectItem>
                      <SelectItem value="4h">4h</SelectItem>
                      <SelectItem value="8h">8h</SelectItem>
                    </SelectContent>
                  </Select>
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
              <div className="border-t-2 border-gray-200 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-600">
                    TOTAL
                  </div>
                  <div 
                    className="text-base font-bold font-mono"
                    style={{ 
                      color: location.color,
                      fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace"
                    }}
                  >
                    ${breakdown.total}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
