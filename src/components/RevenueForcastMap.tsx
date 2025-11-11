'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoAlbersUsa } from 'd3-geo';
import { Download, Loader2, AlertCircle, Filter, Calendar, TrendingUp, Database, Map as MapIcon, Table as TableIcon, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Types for API response
interface LocationData {
  id: string;
  name: string;
  market: 'CAISO' | 'ERCOT' | 'SPP';
  region: string;
  coordinates: [number, number];
  calloutPosition: { x: number; y: number };
  locationType: 'hub' | 'node'; // Location type for visual distinction
  standardDuration: string; // Standard battery duration for market
  curves: {
    energyArbitrage: number;
    ancillaryServices: number;
    capacity: number;
  };
  curveSource: 'GridStor P50' | 'Aurora Base' | 'ASCEND';
  curveRunDate?: string; // Date when curve was generated
  freshThru?: string; // Date through which data is fresh
  duration?: string; // Optional duration label (e.g., "4h", "2.6 h")
  metadata?: {
    dbLocationName?: string;
    aliases?: string[];
  };
  dataFreshness?: {
    lastUpdated: string;
    daysOld: number;
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
  
  // Filter states
  const [timeHorizon, setTimeHorizon] = useState<'1' | '5' | '10' | 'lifetime'>('10');
  const [curveVintage, setCurveVintage] = useState<'all' | 'GridStor' | 'Aurora' | 'Ascend'>('all');
  const [revenueComponent, setRevenueComponent] = useState<'total' | 'energyArb' | 'as' | 'capacity'>('total');
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom date range states
  const [useCustomRange, setUseCustomRange] = useState(false);
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState<number>(currentYear);
  const [endYear, setEndYear] = useState<number>(currentYear + 10);
  
  // Update custom range when timeHorizon changes
  useEffect(() => {
    if (!useCustomRange) {
      const current = new Date().getFullYear();
      switch (timeHorizon) {
        case '1':
          setStartYear(current);
          setEndYear(current);
          break;
        case '5':
          setStartYear(current);
          setEndYear(current + 4);
          break;
        case '10':
          setStartYear(current);
          setEndYear(current + 9);
          break;
        case 'lifetime':
          setStartYear(current);
          setEndYear(current + 29);
          break;
      }
    }
  }, [timeHorizon, useCustomRange]);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (curveVintage !== 'all') {
          params.append('curveSource', curveVintage);
        }
        
        // Always use startYear and endYear (auto-updated based on timeHorizon)
        params.append('startYear', startYear.toString());
        params.append('endYear', endYear.toString());
        
        const response = await fetch(`/api/map-locations?${params.toString()}`);
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
    }, [timeHorizon, curveVintage, useCustomRange, startYear, endYear]);

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

  // Market color helpers
  const MARKET_COLORS = {
    CAISO: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    ERCOT: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600' },
    SPP: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' }
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
  
  // Get the display value based on selected revenue component
  const getDisplayValue = (location: LocationData): { value: string; label: string } => {
    const breakdown = getRevenueBreakdown(location);
    
    switch (revenueComponent) {
      case 'energyArb':
        return { value: breakdown.energyArb, label: 'Energy Arb' };
      case 'as':
        return { value: breakdown.as, label: 'Ancillary Services' };
      case 'capacity':
        return { value: breakdown.capacity, label: 'Capacity' };
      case 'total':
      default:
        return { value: breakdown.total, label: 'Total Revenue' };
    }
  };

  // Filter locations by market, type, and search
  const filteredLocations = locations.filter(loc => {
    // Market filter
    const marketMatch = selectedMarket === 'all' || loc.market === selectedMarket;
    
    // Type filter
    const typeMatch = selectedType === 'all' || loc.locationType === selectedType;
    
    // Search filter
    const searchMatch = searchQuery === '' || 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    return marketMatch && typeMatch && searchMatch;
  });

  // Count locations by type for filter labels
  const typeCounts = {
    all: locations.length,
    hub: locations.filter(loc => loc.locationType === 'hub').length,
    node: locations.filter(loc => loc.locationType === 'node').length,
  };

  const downloadData = () => {
    const data = filteredLocations.map(location => {
      const breakdown = getRevenueBreakdown(location);
      const displayData = getDisplayValue(location);

      // Build filter info for filename
      const startYear = useCustomRange ? startDate.split('-')[0] : null;
      const endYear = useCustomRange ? endDate.split('-')[0] : null;
      const filterSuffix = [
        useCustomRange ? `${startYear}-${endYear}` : `${timeHorizon}yr`,
        curveVintage !== 'all' ? curveVintage : null,
        revenueComponent !== 'total' ? revenueComponent : null
      ].filter(Boolean).join('_');
      
      return {
        Location: location.name,
        DB_Location_Name: location.metadata?.dbLocationName || location.name,
        Market: location.market,
        Region: location.region,
        Curve_Source: location.curveSource,
        Duration: location.standardDuration,
        Energy_Arbitrage: `$${breakdown.energyArb}`,
        Ancillary_Services: `$${breakdown.as}`,
        Capacity: `$${breakdown.capacity}`,
        Total_Revenue: `$${breakdown.total}`,
        Displayed_Value: `$${displayData.value}`,
        Displayed_Component: displayData.label
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
    const downloadFilterSuffix = [
      `${startYear}-${endYear}`,
      curveVintage !== 'all' ? curveVintage : null,
      revenueComponent !== 'total' ? revenueComponent : null
    ].filter(Boolean).join('_');
    a.download = `revenue-forecast-${timestamp}_${downloadFilterSuffix}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Map dimensions - compact for tight layout
  const mapWidth = 550;
  const mapHeight = 350;
  
  // Create projection - adjusted scale for smaller map
  const projection = geoAlbersUsa()
    .scale(620)
    .translate([mapWidth / 2, mapHeight / 2]);

  const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

  // Table Component with Sorting
  type RevenueSortColumn = 'market' | 'location' | 'region' | 'type' | 'duration' | 'energyArb' | 'as' | 'capacity' | 'total' | 'source';
  type SortDirection = 'asc' | 'desc' | null;

  const RevenueTable = () => {
    const [sortColumn, setSortColumn] = useState<RevenueSortColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    const handleSort = (column: RevenueSortColumn) => {
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

    const getSortIcon = (column: RevenueSortColumn) => {
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
    const sortedLocations = [...filteredLocations].sort((a, b) => {
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
        case 'region':
          aValue = a.region;
          bValue = b.region;
          break;
        case 'type':
          aValue = a.locationType;
          bValue = b.locationType;
          break;
        case 'duration':
          aValue = a.standardDuration;
          bValue = b.standardDuration;
          break;
        case 'energyArb':
          aValue = a.curves.energyArbitrage;
          bValue = b.curves.energyArbitrage;
          break;
        case 'as':
          aValue = a.curves.ancillaryServices;
          bValue = b.curves.ancillaryServices;
          break;
        case 'capacity':
          aValue = a.curves.capacity;
          bValue = b.curves.capacity;
          break;
        case 'total':
          aValue = a.curves.energyArbitrage + a.curves.ancillaryServices + a.curves.capacity;
          bValue = b.curves.energyArbitrage + b.curves.ancillaryServices + b.curves.capacity;
          break;
        case 'source':
          aValue = a.curveSource;
          bValue = b.curveSource;
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

    const SortableHeader = ({ column, children, align = 'left' }: { column: RevenueSortColumn; children: React.ReactNode; align?: 'left' | 'center' | 'right' }) => {
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
              <SortableHeader column="region" align="left">Region</SortableHeader>
              <SortableHeader column="type" align="left">Type</SortableHeader>
              <SortableHeader column="duration" align="left">Duration</SortableHeader>
              <SortableHeader column="energyArb" align="right">Energy Arb</SortableHeader>
              <SortableHeader column="as" align="right">Ancillary Svc</SortableHeader>
              <SortableHeader column="capacity" align="right">Capacity</SortableHeader>
              <SortableHeader column="total" align="right">Total Revenue</SortableHeader>
              <SortableHeader column="source" align="left">Source</SortableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedLocations.map((location) => {
              const colors = MARKET_COLORS[location.market as keyof typeof MARKET_COLORS];
              const breakdown = getRevenueBreakdown(location);
              
              return (
                <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-xs ${colors.bg} ${colors.text} px-2 py-1 rounded font-semibold`}>
                      {location.market}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{location.name}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{location.region}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {location.locationType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{location.standardDuration}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-gray-100">${breakdown.energyArb}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-gray-100">${breakdown.as}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-gray-100">${breakdown.capacity}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900 dark:text-gray-100">${breakdown.total}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">
                      {location.curveSource === 'GridStor P50' ? 'Oct 2025' : 
                       location.curveSource === 'Aurora Base' ? 'Sep 2025' : 'Aug 2025'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

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
    <div className="bg-white dark:bg-[#2A2A2A] rounded-lg shadow-sm">
      {/* Filter Bar - Simplified Two-Row Layout */}
      <div className="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
        {/* Row 1: Forecast Period */}
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Forecast Period:</span>
          <button
            onClick={() => { 
              setUseCustomRange(false); 
              setTimeHorizon('1'); 
            }}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
              !useCustomRange && timeHorizon === '1'
                ? 'bg-blue-500 text-white font-medium'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Next 1 Year
          </button>
          <button
            onClick={() => { 
              setUseCustomRange(false); 
              setTimeHorizon('5'); 
            }}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
              !useCustomRange && timeHorizon === '5'
                ? 'bg-blue-500 text-white font-medium'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Next 5 Years
          </button>
          <button
            onClick={() => { 
              setUseCustomRange(false); 
              setTimeHorizon('10'); 
            }}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
              !useCustomRange && timeHorizon === '10'
                ? 'bg-blue-500 text-white font-medium'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Next 10 Years
          </button>
          <button
            onClick={() => { 
              setUseCustomRange(false); 
              setTimeHorizon('lifetime'); 
            }}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
              !useCustomRange && timeHorizon === 'lifetime'
                ? 'bg-blue-500 text-white font-medium'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Lifetime
          </button>
          <button
            onClick={() => setUseCustomRange(true)}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
              useCustomRange
                ? 'bg-blue-500 text-white font-medium'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Row 2: Quick Filters & View Toggle */}
        <div className="flex justify-between items-center">
          {/* Quick Filter Chips */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Quick:</span>
            <button
              onClick={() => { setSelectedMarket('CAISO'); setSelectedType('all'); }}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                selectedMarket === 'CAISO' && selectedType === 'all'
                  ? 'bg-blue-500 text-white font-medium'
                  : 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              CAISO All
            </button>
            <button
              onClick={() => { setSelectedMarket('ERCOT'); setSelectedType('all'); }}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                selectedMarket === 'ERCOT' && selectedType === 'all'
                  ? 'bg-red-500 text-white font-medium'
                  : 'bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              ERCOT All
            </button>
            <button
              onClick={() => { setSelectedMarket('SPP'); setSelectedType('all'); }}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                selectedMarket === 'SPP' && selectedType === 'all'
                  ? 'bg-green-500 text-white font-medium'
                  : 'bg-gray-100 dark:bg-gray-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
            >
              SPP All
            </button>
            <button
              onClick={() => { setSelectedMarket('all'); setSelectedType('hub'); }}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                selectedMarket === 'all' && selectedType === 'hub'
                  ? 'bg-gray-700 text-white font-medium'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Hubs Only
            </button>
            <button
              onClick={() => { setSelectedMarket('all'); setSelectedType('node'); }}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                selectedMarket === 'all' && selectedType === 'node'
                  ? 'bg-gray-700 text-white font-medium'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Nodes Only
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1A1A1A] rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-[#2A2A2A] shadow-sm text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <MapIcon size={16} />
              <span className="text-sm font-medium">Map View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#2A2A2A] shadow-sm text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <TableIcon size={16} />
              <span className="text-sm font-medium">Table View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content - Map or Table */}
      {viewMode === 'map' ? (
      <div className="relative p-4" style={{ height: '500px' }}>
        {/* SVG Overlay for Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {filteredLocations.map((location) => {
            const screenCoords = projection(location.coordinates);
            if (!screenCoords) return null;
            
            // Container dimensions
            const containerHeight = 500;
            const containerPadding = 16; // p-4 padding
            const containerWidth = 1000; // Approximate container width (will scale responsively)
            
            // The map (550x350) is centered both vertically and horizontally
            const innerHeight = containerHeight - (containerPadding * 2);
            const innerWidth = containerWidth - (containerPadding * 2);
            const mapOffsetY = (innerHeight - mapHeight) / 2;
            const mapOffsetX = (innerWidth - mapWidth) / 2;
            
            // Marker position from top-left of container
            // Y: padding + vertical offset + position within map
            const markerAbsoluteY = containerPadding + mapOffsetY + screenCoords[1];
            
            // X: padding + horizontal offset + position within map
            const markerAbsoluteX = containerPadding + mapOffsetX + screenCoords[0];
            
            // Convert to percentage for responsive positioning
            const markerX = (markerAbsoluteX / containerWidth) * 100;
            const markerY = (markerAbsoluteY / containerHeight) * 100;
            
            // Callout positions are already in percentage
            const calloutX = location.calloutPosition.x;
            const calloutY = location.calloutPosition.y;
            
            return (
              <line
                key={location.id}
                x1={`${markerX}%`}
                y1={`${markerY}%`}
                x2={`${calloutX}%`}
                y2={`${calloutY}%`}
                stroke="#6B7280"
                strokeWidth="1.5"
                strokeDasharray="4,3"
                opacity="0.5"
              />
            );
          })}
        </svg>

        {/* Map Container - Centered */}
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="relative" style={{ width: `${mapWidth}px`, height: `${mapHeight}px` }}>
            {/* US Map */}
            <ComposableMap
              projection="geoAlbersUsa"
              width={mapWidth}
              height={mapHeight}
              projectionConfig={{
                scale: 620
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
              
              {/* Location Markers - Different styles for hubs vs nodes */}
              {filteredLocations.map((location) => {
                const color = getMarketColor(location.market);
                return (
                  <Marker key={location.id} coordinates={location.coordinates}>
                    {location.locationType === 'hub' ? (
                      // Hub marker: square
                      <rect
                        x={-5}
                        y={-5}
                        width={10}
                        height={10}
                        fill={color}
                        stroke="white"
                        strokeWidth={2}
                        style={{
                          filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
                        }}
                      />
                    ) : (
                      // Node marker: small tight circle
                      <circle
                        r={4}
                        fill={color}
                        stroke="white"
                        strokeWidth={1.5}
                        style={{
                          filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
                        }}
                      />
                    )}
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>
        </div>

        {/* Callout Boxes - Larger and clearer */}
        {filteredLocations.map((location) => {
          const displayData = getDisplayValue(location);
          const color = getMarketColor(location.market);
          
          return (
            <motion.div
              key={location.id}
              whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
              className="absolute bg-white rounded-lg border-l-4 shadow-md"
              style={{
                left: `${location.calloutPosition.x}%`,
                top: `${location.calloutPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '160px',
                borderColor: color,
                zIndex: 20
              }}
            >
              <div className="p-3">
                {/* Type indicator and location name with duration */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {location.locationType === 'hub' ? (
                      <div className="w-3 h-3 shrink-0" style={{ backgroundColor: color }} />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    )}
                    <h3 className="text-sm font-bold text-gray-900 truncate" title={location.metadata?.dbLocationName}>
                      {location.name}
                    </h3>
                  </div>
                  <span className="text-[9px] text-gray-500 font-semibold shrink-0 mt-0.5">
                    {location.standardDuration}
                  </span>
                </div>
                
                {/* Region */}
                <div className="text-xs text-gray-600 mb-2">{location.region}</div>
                
                {/* Value with inline units */}
                <div className="mb-2">
                  <div 
                    className="text-xl font-bold font-mono leading-none mb-0.5"
                    style={{ 
                      color: color,
                      fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace"
                    }}
                  >
                    ${displayData.value} <span className="text-xs text-gray-500 font-normal">/ kW-mo</span>
                  </div>
                  {revenueComponent !== 'total' && (
                    <div className="text-[9px] text-gray-400 mt-1 uppercase font-semibold">
                      {displayData.label}
                    </div>
                  )}
                </div>
                
                {/* Curve Dates */}
                <div className="border-t border-gray-100 pt-1.5">
                  <div className="text-[8px] text-gray-400 uppercase tracking-wide">
                    Curve Run Date: <span className="text-gray-600 font-medium">
                      {location.curveRunDate ? (() => {
                        const date = new Date(location.curveRunDate);
                        return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getFullYear()}`;
                      })() : 'Oct 2025'}
                    </span>
                  </div>
                  {location.freshThru && (
                    <div className="text-[8px] text-gray-400 uppercase tracking-wide mt-0.5">
                      Fresh Thru: <span className="text-gray-600 font-medium">
                        {(() => {
                          const date = new Date(location.freshThru);
                          return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()} ${date.getFullYear()}`;
                        })()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      ) : (
        <div className="p-4">
          <div className="bg-white dark:bg-[#2A2A2A] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <RevenueTable />
          </div>
        </div>
      )}
    </div>
  );
}
