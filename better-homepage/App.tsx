import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Menu, 
  X, 
  BarChart3, 
  Zap, 
  Target, 
  Power, 
  TrendingUp, 
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Activity,
  Clock,
  Settings,
  User,
  TrendingDown,
  ChevronDown,
  MapPin,
  Download
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import RevenueForcastMap from "./components/RevenueForcastMap";

export default function GridstorAnalytics() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <header className="bg-[#2A2A2A] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-6">
              <div className="text-xl font-bold">GridStor Analytics</div>
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#revenue-forecasting" className="text-white hover:text-gray-300 transition-colors font-medium">
                Revenue Forecasting
              </a>
              <a href="#market-fundamentals" className="text-white hover:text-gray-300 transition-colors font-medium">
                Market Fundamentals
              </a>
              <a href="#risk-metrics" className="text-white hover:text-gray-300 transition-colors font-medium">
                Risk Metrics
              </a>
              <a href="#transmission-outages" className="text-white hover:text-gray-300 transition-colors font-medium">
                Transmission & Outages
              </a>
              <a href="#market-intelligence" className="text-white hover:text-gray-300 transition-colors font-medium">
                Market Intelligence
              </a>
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
                  <Settings size={20} />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-md transition-colors">
                  <User size={20} />
                </button>
              </div>
            </nav>
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-gray-300 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#2A2A2A] border-t border-gray-600"
          >
            <div className="px-4 py-3 space-y-2">
              <a href="#revenue-forecasting" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md font-medium" onClick={toggleMenu}>
                Revenue Forecasting
              </a>
              <a href="#market-fundamentals" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md font-medium" onClick={toggleMenu}>
                Market Fundamentals
              </a>
              <a href="#risk-metrics" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md font-medium" onClick={toggleMenu}>
                Risk Metrics
              </a>
              <a href="#transmission-outages" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md font-medium" onClick={toggleMenu}>
                Transmission & Outages
              </a>
              <a href="#market-intelligence" className="block px-3 py-2 text-white hover:bg-gray-700 rounded-md font-medium" onClick={toggleMenu}>
                Market Intelligence
              </a>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-[#F9FAFB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl lg:text-5xl font-bold text-[#2A2A2A] mb-6"
              style={{ fontSize: '2.25rem', lineHeight: '1.2' }}
            >
              GridStor Analytics Intelligence Platform
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-4xl mx-auto mb-8"
              style={{ fontSize: '1.125rem' }}
            >
              Real-time market intelligence and revenue forecasting for utility-scale battery storage across CAISO, ERCOT, and SPP markets.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">System Status: Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-gray-600">Last Updated: 2 minutes ago</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Compact Revenue Forecasting Map */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#2A2A2A] mb-1">Revenue Forecasting Map</h2>
            <p className="text-sm text-gray-600">Interactive energy arbitrage forecasting across market locations</p>
          </div>
          
          <RevenueForcastMap />
        </div>
      </section>

      {/* Market Performance Overview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#2A2A2A] mb-2">Market Performance Overview</h2>
            <p className="text-gray-600">Energy arbitrage analytics and forecasting updated monthly</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MarketAnalyticsCard 
              market="CAISO"
              tbType="TB4"
              locations={["Goleta", "SP15", "NP15"]}
              lastUpdated="Dec 28, 2024 8:45 AM"
              ytdTB="7.85"
              yearAheadForecast="8.20"
              pValue="P35"
              pValueAmount="+0.45"
              boyForecast="8.45"
              neededToMeet="8.55"
              neededPValue="P25"
              projectedTotal="8.32"
              yoyChange="+4.2%"
              asProportion="1.10"
              accent="border-blue-500"
              accentColor="blue"
            />
            <MarketAnalyticsCard 
              market="ERCOT"
              tbType="TB2"
              locations={["Houston Hub", "Hidden Lakes", "Gunnar", "South Hub"]}
              lastUpdated="Dec 28, 2024 9:15 AM"
              ytdTB="9.12"
              yearAheadForecast="8.75"
              pValue="P65"
              pValueAmount="+1.24"
              boyForecast="8.95"
              neededToMeet="8.38"
              neededPValue="P85"
              projectedTotal="9.05"
              yoyChange="+7.8%"
              asProportion="1.25"
              accent="border-red-500"
              accentColor="red"
            />
            <MarketAnalyticsCard 
              market="SPP"
              tbType="TB4"
              locations={["North Hub", "South Hub"]}
              lastUpdated="Dec 28, 2024 7:30 AM"
              ytdTB="6.43"
              yearAheadForecast="6.90"
              pValue="P20"
              pValueAmount="-0.82"
              boyForecast="7.10"
              neededToMeet="7.37"
              neededPValue="P15"
              projectedTotal="6.73"
              yoyChange="-1.8%"
              asProportion="1.34"
              accent="border-green-500"
              accentColor="green"
            />
          </div>
          <div className="mt-8 text-center">
            <a 
              href="#revenue-forecasting" 
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
              style={{ fontSize: '1rem', fontWeight: '500' }}
            >
              Go To Revenue Forecasting Page
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Analytics Capabilities */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A2A2A] mb-4">Our Analytics Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive intelligence platform covering all aspects of battery storage market analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsCard 
              icon={<BarChart3 size={24} />}
              title="Revenue Forecasting"
              description="Long, medium, and short-term revenue projections using fundamentals, heuristics, and stochastic modeling"
              features={[
                "Scenario analysis and risk assessment",
                "Monte Carlo simulations",
                "Sensitivity analysis across market conditions"
              ]}
              ctaText="Access Forecasting Tools"
              href="#revenue-forecasting"
            />
            <AnalyticsCard 
              icon={<Zap size={24} />}
              title="Market Fundamentals"
              description="Real-time tracking of supply, demand, transmission, and regulatory factors across all markets"
              features={[
                "Supply and demand analysis",
                "Regulatory impact assessment",
                "Price formation analysis"
              ]}
              ctaText="Access Market Data"
              href="#market-fundamentals"
            />
            <AnalyticsCard 
              icon={<Target size={24} />}
              title="Risk Metrics"
              description="Comprehensive risk assessment and scenario modeling for portfolio optimization"
              features={[
                "Portfolio risk assessment",
                "Stress testing and sensitivity analysis",
                "Value-at-Risk calculations"
              ]}
              ctaText="Access Risk Analysis"
              href="#risk-metrics"
            />
            <AnalyticsCard 
              icon={<Power size={24} />}
              title="Transmission & Outages"
              description="Grid reliability monitoring and impact analysis across CAISO, ERCOT, and SPP"
              features={[
                "Outage impact analysis",
                "Transmission constraint tracking",
                "Grid reliability monitoring"
              ]}
              ctaText="Access Grid Intelligence"
              href="#transmission-outages"
            />
            <AnalyticsCard 
              icon={<TrendingUp size={24} />}
              title="Market Intelligence"
              description="Third-party vendor curve tracking, futures market data, and competitive landscape analysis"
              features={[
                "Third-party vendor curve tracking",
                "Futures market data integration",
                "Competitive landscape analysis"
              ]}
              ctaText="Access Market Intelligence"
              href="#market-intelligence"
              fullWidth
            />
          </div>
        </div>
      </section>

      {/* Markets We Serve */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A2A2A] mb-4">Markets We Serve</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Deep expertise across the three major electricity markets where GridStor operates
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MarketInfoCard 
              market="CAISO"
              description="California's grid operator serving 80% of the state"
              target="45 GW battery storage target"
              color="bg-blue-500"
            />
            <MarketInfoCard 
              market="ERCOT"
              description="Texas's grid operator serving 26M customers"
              target="12 GW battery storage target"
              color="bg-red-500"
            />
            <MarketInfoCard 
              market="SPP"
              description="Southwest Power Pool serving 17 states"
              target="8 GW battery storage target"
              color="bg-green-500"
            />
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A2A2A] mb-4">Current System Status</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real-time monitoring of platform health and recent analytics updates
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatusCard 
              title="System Health"
              items={[
                { icon: <CheckCircle size={16} className="text-green-500" />, text: "All systems operational" },
                { icon: <Activity size={16} className="text-green-500" />, text: "Last data refresh: 2 minutes ago" },
                { icon: <CheckCircle size={16} className="text-green-500" />, text: "99.8% uptime this month" }
              ]}
            />
            <StatusCard 
              title="Recent Forecasts"
              items={[
                { icon: <BarChart3 size={16} className="text-blue-500" />, text: "Q1 2025 Revenue Forecast updated 15 minutes ago" },
                { icon: <TrendingUp size={16} className="text-blue-500" />, text: "CAISO price forecast updated 1 hour ago" },
                { icon: <Target size={16} className="text-blue-500" />, text: "Risk assessment model run completed" }
              ]}
            />
            <StatusCard 
              title="Active Alerts"
              items={[
                { icon: <AlertTriangle size={16} className="text-orange-500" />, text: "ERCOT: High volatility expected 3-5 PM today" },
                { icon: <Info size={16} className="text-blue-500" />, text: "SPP: Maintenance window scheduled this weekend" },
                { icon: <CheckCircle size={16} className="text-green-500" />, text: "CAISO: All systems normal" }
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2A2A] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold text-white">GridStor Analytics</div>
              <div className="text-gray-400 text-sm">Internal Intelligence Platform</div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#revenue-forecasting" className="text-gray-300 hover:text-white transition-colors">Revenue Forecasting</a>
              <a href="#market-fundamentals" className="text-gray-300 hover:text-white transition-colors">Market Fundamentals</a>
              <a href="#risk-metrics" className="text-gray-300 hover:text-white transition-colors">Risk Metrics</a>
              <a href="#transmission-outages" className="text-gray-300 hover:text-white transition-colors">Transmission & Outages</a>
              <a href="#market-intelligence" className="text-gray-300 hover:text-white transition-colors">Market Intelligence</a>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-6 pt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} GridStor. Internal use only.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Enhanced Market Analytics Card Component
function MarketAnalyticsCard({ 
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
}) {
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
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">YTD P-Value</div>
          <div className={`text-lg font-bold font-mono ${pValueNumber >= 50 ? 'text-green-600' : 'text-red-600'}`} 
               style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
            {pValue}
          </div>
          <div className={`text-xs ${isOverForecast ? 'text-green-600' : 'text-red-600'}`}>
            {pValueAmount} vs forecast
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {pValueNumber}th percentile
          </div>
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

      {/* Forecast Analysis */}
      <div className="bg-blue-50 rounded-md p-4 mb-4">
        <div className="text-xs text-gray-600 uppercase tracking-wider mb-2 font-medium">To Meet Year Ahead Forecast</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Needed BOY</div>
            <div className="text-base font-bold text-gray-900 font-mono" style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
              ${neededToMeet}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Probability of reaching Year ahead forecast value</div>
            <div className={`text-base font-bold font-mono ${parseInt(neededPValue.replace('P', '')) >= 50 ? 'text-green-600' : 'text-red-600'}`} 
                 style={{ fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace" }}>
              {neededPValue}
            </div>
          </div>
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

// Analytics Capability Card Component
function AnalyticsCard({ icon, title, description, features, ctaText, href, fullWidth = false }) {
  return (
    <motion.div 
      whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
      className={`bg-white rounded-lg shadow-sm p-8 border border-gray-200 transition-all duration-200 ${fullWidth ? 'lg:col-span-2' : ''}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-primary">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800" style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h3>
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed" style={{ fontSize: '1rem', lineHeight: '1.5' }}>{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-600" style={{ fontSize: '1rem' }}>
            <span className="text-primary mt-1">•</span>
            {feature}
          </li>
        ))}
      </ul>
      <a 
        href={href}
        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
        style={{ fontSize: '1rem', fontWeight: '500' }}
      >
        {ctaText}
        <ChevronRight size={16} />
      </a>
    </motion.div>
  );
}

// Market Information Card Component
function MarketInfoCard({ market, description, target, color }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-200"
    >
      <div className={`${color} h-2`}></div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontSize: '1.5rem', fontWeight: '700' }}>{market}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed" style={{ fontSize: '1rem', lineHeight: '1.5' }}>{description}</p>
        <div className="bg-gray-50 rounded-md p-3">
          <span className="text-sm font-medium text-gray-700" style={{ fontSize: '0.875rem', fontWeight: '500' }}>{target}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Status Card Component
function StatusCard({ title, items }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontSize: '1.125rem', fontWeight: '600' }}>{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            {item.icon}
            <span className="text-gray-600 text-sm leading-relaxed" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}