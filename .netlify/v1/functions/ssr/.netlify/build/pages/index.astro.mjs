/* empty css                                */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D0YNkI8Y.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_AQybK9g5.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoAlbersUsa } from 'd3-geo';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon, ChevronUpIcon, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export { renderers } from '../renderers.mjs';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}

function RevenueForcastMap() {
  const [codYear, setCodYear] = useState("2026");
  const [horizon, setHorizon] = useState("10");
  const [hoveredState, setHoveredState] = useState(null);
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
      coordinates: [-121.4687, 38.5816],
      market: "CAISO",
      color: "#3B82F6",
      revenue: {
        energyArb: { "2": 8.45, "4": 9.12, "8": 9.78 },
        capacity: 7
      },
      region: "Northern California",
      calloutPosition: { x: 15, y: 20 }
      // Left edge, more spacing
    },
    "Goleta": {
      coordinates: [-119.8276, 34.4208],
      market: "CAISO",
      color: "#3B82F6",
      revenue: {
        energyArb: { "2": 8.12, "4": 8.89, "8": 9.56 },
        capacity: 7
      },
      region: "Santa Barbara",
      calloutPosition: { x: 15, y: 50 }
      // Left edge, center
    },
    "SP15": {
      coordinates: [-118.2437, 34.0522],
      market: "CAISO",
      color: "#3B82F6",
      revenue: {
        energyArb: { "2": 8.67, "4": 9.34, "8": 10.01 },
        capacity: 7
      },
      region: "Southern California",
      calloutPosition: { x: 15, y: 80 }
      // Left edge, more spacing
    },
    "Houston": {
      coordinates: [-95.3698, 29.7604],
      market: "ERCOT",
      color: "#EF4444",
      revenue: {
        energyArb: { "2": 9.34, "4": 10.12, "8": 10.89 },
        capacity: 0
      },
      region: "Houston Hub",
      calloutPosition: { x: 85, y: 20 }
      // Right edge, more spacing
    },
    "Hidden Lakes": {
      coordinates: [-94.7977, 29.2733],
      market: "ERCOT",
      color: "#EF4444",
      revenue: {
        energyArb: { "2": 9.12, "4": 9.89, "8": 10.56 },
        capacity: 0
      },
      region: "South of Houston",
      calloutPosition: { x: 85, y: 50 }
      // Right edge, center
    },
    "Gunnar": {
      coordinates: [-97.0633, 28.0367],
      market: "ERCOT",
      color: "#EF4444",
      revenue: {
        energyArb: { "2": 8.56, "4": 9.23, "8": 9.9 },
        capacity: 0
      },
      region: "South Central Texas",
      calloutPosition: { x: 85, y: 80 }
      // Right edge, more spacing
    },
    "South Hub": {
      coordinates: [-98.23, 26.2034],
      market: "ERCOT",
      color: "#EF4444",
      revenue: {
        energyArb: { "2": 8.78, "4": 9.45, "8": 10.12 },
        capacity: 0
      },
      region: "Southern Texas",
      calloutPosition: { x: 50, y: 85 }
      // Bottom edge, more spacing
    },
    "North Hub": {
      coordinates: [-98.3834, 39.0473],
      market: "SPP",
      color: "#10B981",
      revenue: {
        energyArb: { "2": 6.45, "4": 7.12, "8": 7.78 },
        capacity: 5
      },
      region: "Kansas/Northern SPP",
      calloutPosition: { x: 35, y: 15 }
      // Top edge, moved right
    },
    "South Hub SPP": {
      coordinates: [-97.5164, 35.4676],
      market: "SPP",
      color: "#10B981",
      revenue: {
        energyArb: { "2": 6.78, "4": 7.45, "8": 8.12 },
        capacity: 5
      },
      region: "Oklahoma/Southern SPP",
      calloutPosition: { x: 65, y: 15 }
      // Top edge, moved left
    }
  };
  const stateMarkets = {
    "06": "CAISO",
    // California
    "48": "ERCOT",
    // Texas
    "40": "SPP",
    // Oklahoma
    "20": "SPP",
    // Kansas
    "31": "SPP",
    // Nebraska
    "05": "SPP",
    // Arkansas
    "22": "SPP",
    // Louisiana
    "29": "SPP",
    // Missouri
    "19": "SPP",
    // Iowa
    "27": "SPP",
    // Minnesota
    "38": "SPP",
    // North Dakota
    "46": "SPP",
    // South Dakota
    "56": "SPP",
    // Wyoming
    "08": "SPP",
    // Colorado
    "35": "SPP"
    // New Mexico
  };
  const getStateColor = (geo) => {
    const stateId = geo.id;
    const market = stateMarkets[stateId];
    switch (market) {
      case "CAISO":
        return "#3B82F6";
      case "ERCOT":
        return "#EF4444";
      case "SPP":
        return "#10B981";
      default:
        return "#E5E7EB";
    }
  };
  const updateLocationDuration = (location, duration) => {
    setLocationDurations((prev) => ({
      ...prev,
      [location]: duration
    }));
  };
  const getRevenueBreakdown = (locationKey) => {
    const location = locations[locationKey];
    const duration = locationDurations[locationKey];
    const baseEnergyArb = location.revenue.energyArb[duration.replace("h", "")];
    const codMultiplier = 1 + (parseInt(codYear) - 2026) * 0.03;
    const horizonMultiplier = 1 + (parseInt(horizon) - 1) * 0.02;
    const energyArb = baseEnergyArb * codMultiplier * horizonMultiplier;
    const as = energyArb * 0.1;
    const capacity = location.revenue.capacity;
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
        Duration: `${locationDurations[key]}`,
        Energy_Arbitrage: `$${breakdown.energyArb}`,
        Ancillary_Services: `$${breakdown.as}`,
        Capacity: `$${breakdown.capacity}`,
        Total_Revenue: `$${breakdown.total}`,
        COD_Year: codYear,
        Forecast_Horizon: `${horizon} years`
      };
    });
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-forecast-${codYear}-${horizon}yr.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const mapWidth = 600;
  const mapHeight = 400;
  const projection = geoAlbersUsa().scale(675).translate([mapWidth / 2, mapHeight / 2]);
  const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
  return /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-lg p-6", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-md p-4 border shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "COD Year" }),
          /* @__PURE__ */ jsxs(Select, { value: codYear, onValueChange: setCodYear, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 w-24 text-sm", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: Array.from({ length: 7 }, (_, i) => 2026 + i).map((year) => /* @__PURE__ */ jsx(SelectItem, { value: year.toString(), children: year }, year)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Forecast Horizon" }),
          /* @__PURE__ */ jsxs(Select, { value: horizon, onValueChange: setHorizon, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 w-24 text-sm", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: Array.from({ length: 20 }, (_, i) => i + 1).map((year) => /* @__PURE__ */ jsxs(SelectItem, { value: year.toString(), children: [
              year,
              "y"
            ] }, year)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: downloadData,
          className: "inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm",
          children: [
            /* @__PURE__ */ jsx(Download, { size: 16 }),
            "Download Data"
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-white rounded-lg border border-gray-200 p-6", style: { height: "800px" }, children: [
      /* @__PURE__ */ jsx("svg", { className: "absolute inset-0 w-full h-full pointer-events-none z-10", children: Object.entries(locations).map(([key, location]) => {
        const screenCoords = projection(location.coordinates);
        if (!screenCoords) return null;
        const containerPadding = 24;
        const availableWidth = 1200 - containerPadding * 2;
        const availableHeight = 800 - containerPadding * 2;
        const mapOffsetX = (availableWidth - mapWidth) / 2;
        const mapOffsetY = (availableHeight - mapHeight) / 2;
        const markerX = (containerPadding + mapOffsetX + screenCoords[0]) / 1200 * 100;
        const markerY = (containerPadding + mapOffsetY + screenCoords[1]) / 800 * 100;
        const calloutX = location.calloutPosition.x;
        const calloutY = location.calloutPosition.y;
        return /* @__PURE__ */ jsx(
          "line",
          {
            x1: `${markerX}%`,
            y1: `${markerY}%`,
            x2: `${calloutX}%`,
            y2: `${calloutY}%`,
            stroke: location.color,
            strokeWidth: "2",
            strokeDasharray: "4,4",
            opacity: "0.7"
          },
          key
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-6 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "relative", style: { width: `${mapWidth}px`, height: `${mapHeight}px` }, children: /* @__PURE__ */ jsxs(
        ComposableMap,
        {
          projection: "geoAlbersUsa",
          width: mapWidth,
          height: mapHeight,
          projectionConfig: {
            scale: 675
          },
          className: "w-full h-full",
          children: [
            /* @__PURE__ */ jsx(Geographies, { geography: geoUrl, children: ({ geographies }) => geographies.map((geo) => /* @__PURE__ */ jsx(
              Geography,
              {
                geography: geo,
                fill: getStateColor(geo),
                stroke: "#FFFFFF",
                strokeWidth: 0.5,
                style: {
                  default: {
                    outline: "none"
                  },
                  hover: {
                    outline: "none",
                    filter: "brightness(1.1)"
                  },
                  pressed: {
                    outline: "none"
                  }
                },
                onMouseEnter: () => setHoveredState(geo.properties.name),
                onMouseLeave: () => setHoveredState(null)
              },
              geo.rsmKey
            )) }),
            Object.entries(locations).map(([key, location]) => /* @__PURE__ */ jsx(Marker, { coordinates: location.coordinates, children: /* @__PURE__ */ jsx(
              "circle",
              {
                r: 6,
                fill: location.color,
                stroke: "white",
                strokeWidth: 2,
                style: {
                  filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))"
                }
              }
            ) }, key))
          ]
        }
      ) }) }),
      Object.entries(locations).map(([key, location]) => {
        const breakdown = getRevenueBreakdown(key);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "absolute bg-white border-2 rounded-lg p-3 shadow-lg",
            style: {
              left: `${location.calloutPosition.x}%`,
              top: `${location.calloutPosition.y}%`,
              transform: "translate(-50%, -50%)",
              width: "180px",
              borderColor: location.color,
              zIndex: 20
            },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: { backgroundColor: location.color }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: key })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 mb-2", children: location.region }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-xs", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { children: "Energy:" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                    "$",
                    breakdown.energyArb
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { children: "AS:" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                    "$",
                    breakdown.as
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { children: "Capacity:" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                    "$",
                    breakdown.capacity
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-semibold border-t pt-1", children: [
                  /* @__PURE__ */ jsx("span", { children: "Total:" }),
                  /* @__PURE__ */ jsxs("span", { style: { color: location.color }, children: [
                    "$",
                    breakdown.total
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: locationDurations[key],
                  onValueChange: (value) => updateLocationDuration(key, value),
                  children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs mt-2", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsx(SelectItem, { value: "2h", children: "2h" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "4h", children: "4h" }),
                      /* @__PURE__ */ jsx(SelectItem, { value: "8h", children: "8h" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1 text-center", children: "$/kW-month" })
            ]
          },
          key
        );
      })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Home" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-full bg-white">  <section class="bg-[#F9FAFB] py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center"> <h1 class="text-4xl lg:text-5xl font-bold text-[#2A2A2A] mb-6" style="font-size: 2.25rem; line-height: 1.2;">
GridStor Analytics Intelligence Platform
</h1> <p class="text-lg text-gray-600 max-w-4xl mx-auto mb-8" style="font-size: 1.125rem;">
Real-time market intelligence and revenue forecasting for utility-scale battery storage across CAISO, ERCOT, and SPP markets.
</p> <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm"> <div class="flex items-center gap-2"> <div class="w-2 h-2 bg-green-500 rounded-full"></div> <span class="text-gray-700 font-medium">System Status: Online</span> </div> <div class="flex items-center gap-2"> <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <span class="text-gray-600">Last Updated: 2 minutes ago</span> </div> </div> </div> </div> </section>  <section class="py-8 bg-white border-b"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="mb-4"> <h2 class="text-xl font-bold text-[#2A2A2A] mb-1">Revenue Forecasting Map</h2> <p class="text-sm text-gray-600">Interactive energy arbitrage forecasting across market locations</p> </div> ${renderComponent($$result2, "RevenueForcastMap", RevenueForcastMap, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Administrator/Documents/gst-homepage/gst-homepage/src/components/RevenueForcastMap.tsx", "client:component-export": "default" })} </div> </section>  <section class="py-12 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="mb-8"> <h2 class="text-2xl font-bold text-[#2A2A2A] mb-2">Market Performance Overview</h2> <p class="text-gray-600">Energy arbitrage analytics and forecasting updated monthly</p> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">  <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 transition-all duration-200 hover:shadow-lg"> <div class="mb-4 pb-3 border-b border-gray-100"> <div class="text-xs text-gray-500 flex items-center gap-1"> <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <span>Last updated: Dec 28, 2024 8:45 AM</span> </div> </div> <div class="flex justify-between items-start mb-6"> <div class="flex items-center gap-3"> <h3 class="text-xl font-bold text-gray-800">CAISO</h3> <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">TB4</span> </div> <div class="flex items-center gap-1 text-sm font-semibold text-green-600"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path> </svg> <span>+4.2% YoY</span> </div> </div> <div class="grid grid-cols-2 gap-4 mb-6"> <div class="bg-gray-50 rounded-md p-3"> <div class="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">YTD TB4</div> <div class="text-lg font-bold text-gray-900 font-mono">$7.85</div> <div class="text-xs text-gray-600">$/kW-month</div> </div> <div class="bg-gray-50 rounded-md p-3"> <div class="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Year Ahead</div> <div class="text-lg font-bold text-gray-900 font-mono">$8.20</div> <div class="text-xs text-gray-600">$/kW-month</div> </div> </div> <div class="text-center"> <a href="/curve-viewer" class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm">
View Details
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> </div>  <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500 transition-all duration-200 hover:shadow-lg"> <div class="mb-4 pb-3 border-b border-gray-100"> <div class="text-xs text-gray-500 flex items-center gap-1"> <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <span>Last updated: Dec 28, 2024 9:15 AM</span> </div> </div> <div class="flex justify-between items-start mb-6"> <div class="flex items-center gap-3"> <h3 class="text-xl font-bold text-gray-800">ERCOT</h3> <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">TB2</span> </div> <div class="flex items-center gap-1 text-sm font-semibold text-green-600"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path> </svg> <span>+7.8% YoY</span> </div> </div> <div class="grid grid-cols-2 gap-4 mb-6"> <div class="bg-gray-50 rounded-md p-3"> <div class="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">YTD TB2</div> <div class="text-lg font-bold text-gray-900 font-mono">$9.12</div> <div class="text-xs text-gray-600">$/kW-month</div> </div> <div class="bg-gray-50 rounded-md p-3"> <div class="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Year Ahead</div> <div class="text-lg font-bold text-gray-900 font-mono">$8.75</div> <div class="text-xs text-gray-600">$/kW-month</div> </div> </div> <div class="text-center"> <a href="/market-ops" class="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium text-sm">
View Details
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> </div>  <div class="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 transition-all duration-200 hover:shadow-lg"> <div class="mb-4 pb-3 border-b border-gray-100"> <div class="text-xs text-gray-500 flex items-center gap-1"> <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <span>Last updated: Dec 28, 2024 7:30 AM</span> </div> </div> <div class="flex justify-between items-start mb-6"> <div class="flex items-center gap-3"> <h3 class="text-xl font-bold text-gray-800">SPP</h3> <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">TB4</span> </div> <div class="flex items-center gap-1 text-sm font-semibold text-red-600"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path> </svg> <span>-1.8% YoY</span> </div> </div> <div class="grid grid-cols-2 gap-4 mb-6"> <div class="bg-gray-50 rounded-md p-3"> <div class="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">YTD TB4</div> <div class="text-lg font-bold text-gray-900 font-mono">$6.43</div> <div class="text-xs text-gray-600">$/kW-month</div> </div> <div class="bg-gray-50 rounded-md p-3"> <div class="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Year Ahead</div> <div class="text-lg font-bold text-gray-900 font-mono">$6.90</div> <div class="text-xs text-gray-600">$/kW-month</div> </div> </div> <div class="text-center"> <a href="/about" class="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm">
View Details
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> </div> </div> </div> </section>  <section class="py-16 bg-[#F9FAFB]"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <h2 class="text-3xl font-bold text-[#2A2A2A] mb-4">Analytics Tools</h2> <p class="text-lg text-gray-600 max-w-3xl mx-auto">
Comprehensive suite of analysis tools for battery storage market intelligence
</p> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">  <div class="bg-white rounded-lg shadow-sm p-8 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"> <div class="flex items-center gap-3 mb-4"> <div class="text-blue-600"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-800">Curve Viewer</h3> </div> <p class="text-gray-600 mb-6 leading-relaxed">
Advanced curve analysis and visualization tools for complex data patterns and market forecasting.
</p> <ul class="space-y-2 mb-6"> <li class="flex items-start gap-2 text-gray-600"> <span class="text-blue-600 mt-1">•</span>
Interactive curve visualization
</li> <li class="flex items-start gap-2 text-gray-600"> <span class="text-blue-600 mt-1">•</span>
Historical data analysis
</li> <li class="flex items-start gap-2 text-gray-600"> <span class="text-blue-600 mt-1">•</span>
Trend identification and forecasting
</li> </ul> <a href="/curve-viewer" class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
Launch Curve Viewer
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div>  <div class="bg-white rounded-lg shadow-sm p-8 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"> <div class="flex items-center gap-3 mb-4"> <div class="text-green-600"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-800">Market Ops</h3> </div> <p class="text-gray-600 mb-6 leading-relaxed">
Comprehensive market operations analysis tools for tracking performance, forecasting, and optimization opportunities.
</p> <ul class="space-y-2 mb-6"> <li class="flex items-start gap-2 text-gray-600"> <span class="text-green-600 mt-1">•</span>
Market performance tracking
</li> <li class="flex items-start gap-2 text-gray-600"> <span class="text-green-600 mt-1">•</span>
PCM forecasting and analysis
</li> <li class="flex items-start gap-2 text-gray-600"> <span class="text-green-600 mt-1">•</span>
Revenue optimization insights
</li> </ul> <a href="/market-ops" class="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium">
Launch Market Ops
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> </div> </div> </section>  <section class="py-16 bg-white"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <h2 class="text-3xl font-bold text-[#2A2A2A] mb-4">Markets We Serve</h2> <p class="text-lg text-gray-600 max-w-3xl mx-auto">
Deep expertise across the three major electricity markets where GridStor operates
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">  <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-200 hover:-translate-y-1"> <div class="bg-blue-500 h-2"></div> <div class="p-6"> <h3 class="text-2xl font-bold text-gray-800 mb-3">CAISO</h3> <p class="text-gray-600 mb-4 leading-relaxed">California's grid operator serving 80% of the state</p> <div class="bg-gray-50 rounded-md p-3"> <span class="text-sm font-medium text-gray-700">45 GW battery storage target</span> </div> </div> </div>  <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-200 hover:-translate-y-1"> <div class="bg-red-500 h-2"></div> <div class="p-6"> <h3 class="text-2xl font-bold text-gray-800 mb-3">ERCOT</h3> <p class="text-gray-600 mb-4 leading-relaxed">Texas's grid operator serving 26M customers</p> <div class="bg-gray-50 rounded-md p-3"> <span class="text-sm font-medium text-gray-700">12 GW battery storage target</span> </div> </div> </div>  <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-200 hover:-translate-y-1"> <div class="bg-green-500 h-2"></div> <div class="p-6"> <h3 class="text-2xl font-bold text-gray-800 mb-3">SPP</h3> <p class="text-gray-600 mb-4 leading-relaxed">Southwest Power Pool serving 17 states</p> <div class="bg-gray-50 rounded-md p-3"> <span class="text-sm font-medium text-gray-700">8 GW battery storage target</span> </div> </div> </div> </div> </div> </section>  <section class="py-16 bg-[#F9FAFB]"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <h2 class="text-3xl font-bold text-[#2A2A2A] mb-4">Current System Status</h2> <p class="text-lg text-gray-600 max-w-3xl mx-auto">
Real-time monitoring of platform health and recent analytics updates
</p> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200"> <h3 class="text-lg font-semibold text-gray-800 mb-4">System Health</h3> <div class="space-y-3"> <div class="flex items-start gap-3"> <svg class="w-4 h-4 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-600 text-sm leading-relaxed">All systems operational</span> </div> <div class="flex items-start gap-3"> <svg class="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg> <span class="text-gray-600 text-sm leading-relaxed">Last data refresh: 2 minutes ago</span> </div> <div class="flex items-start gap-3"> <svg class="w-4 h-4 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-600 text-sm leading-relaxed">99.8% uptime this month</span> </div> </div> </div>  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200"> <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Updates</h3> <div class="space-y-3"> <div class="flex items-start gap-3"> <svg class="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg> <span class="text-gray-600 text-sm leading-relaxed">Curve analysis updated 15 minutes ago</span> </div> <div class="flex items-start gap-3"> <svg class="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path> </svg> <span class="text-gray-600 text-sm leading-relaxed">Market forecasts refreshed 1 hour ago</span> </div> <div class="flex items-start gap-3"> <svg class="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <span class="text-gray-600 text-sm leading-relaxed">Daily analysis completed</span> </div> </div> </div>  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200"> <h3 class="text-lg font-semibold text-gray-800 mb-4">Active Alerts</h3> <div class="space-y-3"> <div class="flex items-start gap-3"> <svg class="w-4 h-4 text-orange-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path> </svg> <span class="text-gray-600 text-sm leading-relaxed">ERCOT: High volatility expected 3-5 PM today</span> </div> <div class="flex items-start gap-3"> <svg class="w-4 h-4 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path> </svg> <span class="text-gray-600 text-sm leading-relaxed">SPP: Maintenance window scheduled this weekend</span> </div> <div class="flex items-start gap-3"> <svg class="w-4 h-4 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-gray-600 text-sm leading-relaxed">CAISO: All systems normal</span> </div> </div> </div> </div> </div> </section> </div> ` })}`;
}, "C:/Users/Administrator/Documents/gst-homepage/gst-homepage/src/pages/index.astro", void 0);

const $$file = "C:/Users/Administrator/Documents/gst-homepage/gst-homepage/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
