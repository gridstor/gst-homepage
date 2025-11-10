/**
 * GridStor Market Sight - Unified Navigation Header
 * Single source of truth for navigation across all GridStor applications
 * 
 * DEPLOYMENT:
 * This file is served from: https://gst-homepage.netlify.app/shared-header.js
 * 
 * USAGE IN OTHER REPOS:
 * Add this to your HTML <head>:
 * <script src="https://gst-homepage.netlify.app/shared-header.js"></script>
 * 
 * Then in your <body>:
 * <div id="gridstor-header"></div>
 * 
 * The script will automatically render the navigation header.
 */

(function() {
  'use strict';

  // ============================================================================
  // NAVIGATION CONFIGURATION
  // ============================================================================
  // To add/modify navigation, update this object
  // The structure supports nested dropdowns with descriptions
  
  const NAVIGATION_CONFIG = {
    logo: {
      text: 'GridStor Market Sight',
      homeUrl: '/',
      // SVG lightning bolt icon embedded
      svg: `<svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" role="presentation">
        <path d="M55 10L30 55H50L45 90L70 45H50L55 10Z" fill="#06B6D4" stroke="#06B6D4" stroke-width="2" stroke-linejoin="round"/>
      </svg>`
    },
    
    // ========================================================================
    // PRIMARY NAVIGATION ITEMS
    // ========================================================================
    // Top-level items that appear in the main navigation bar
    
    menuItems: [
      // --------------------------------------------------------------------
      // LONG-TERM OUTLOOK
      // --------------------------------------------------------------------
      {
        id: 'long-term-outlook',
        title: 'Long-term outlook',
        type: 'dropdown', // 'dropdown' or 'link'
        
        // Dropdown items (first level)
        items: [
          {
            id: 'revenue-forecast',
            label: 'Revenue Forecast',
            description: 'Forecasting and analytics',
            type: 'submenu', // 'submenu' or 'link'
            
            // Nested submenu items (second level)
            subItems: [
              { 
                label: 'Revenue Forecast Grapher', 
                href: '/revenue-forecasts',
                description: 'Build and compare forecast graphs'
              },
              { 
                label: 'Curve Browser', 
                href: '/revenue-forecasts/curves',
                description: 'Browse and download curves'
              },
              { 
                label: 'Curve Uploader', 
                href: '/admin/upload',
                description: 'Upload new curve data'
              },
              { 
                label: 'Curve Inventory', 
                href: '/admin/inventory',
                description: 'View all curve definitions'
              },
              { 
                label: 'Curve Schedule', 
                href: '/curve-schedule',
                description: 'Manage delivery schedules'
              }
            ]
          },
          {
            id: 'futures-markets',
            label: 'Futures Markets',
            href: '/futures-markets',
            description: 'Natural gas, power, heat rate futures',
            type: 'link'
          }
        ]
      },
      
      // --------------------------------------------------------------------
      // SHORT-TERM OUTLOOK
      // --------------------------------------------------------------------
      {
        id: 'short-term-outlook',
        title: 'Short-term outlook',
        type: 'link',
        href: '/short-term-outlook'
        
        // TO ADD DROPDOWN: Change type to 'dropdown' and add items array
        // items: [
        //   { label: 'Overview', href: '/short-term-outlook', description: '...' },
        //   { label: 'New Page', href: '/short-term-outlook/new-page', description: '...' }
        // ]
      },
      
      // --------------------------------------------------------------------
      // RISK AND STRUCTURING
      // --------------------------------------------------------------------
      {
        id: 'risk-structuring',
        title: 'Risk and structuring',
        type: 'link',
        href: '/risk-structuring'
      }
    ]
  };

  // ============================================================================
  // HTML GENERATION
  // ============================================================================
  
  function createHeader() {
    const currentPath = window.location.pathname;
    
    // Generate navigation items HTML
    const navItemsHTML = NAVIGATION_CONFIG.menuItems.map(item => {
      if (item.type === 'dropdown') {
        return createDropdownItem(item, currentPath);
      } else {
        return createLinkItem(item, currentPath);
      }
    }).join('');
    
    const headerHTML = `
      <header class="gridstor-header bg-[#2A2A2A] text-white shadow-sm border-b border-gray-800 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center gap-8">
              <!-- Logo -->
              <a 
                href="${NAVIGATION_CONFIG.logo.homeUrl}" 
                class="flex items-center gap-3 hover:opacity-80 transition-opacity"
                aria-label="${NAVIGATION_CONFIG.logo.text} Home"
              >
                ${NAVIGATION_CONFIG.logo.svg}
                <span class="text-xl font-bold">${NAVIGATION_CONFIG.logo.text}</span>
              </a>
              
              <!-- Navigation Links -->
              <nav class="hidden lg:flex items-center gap-8" role="navigation" aria-label="Primary">
                ${navItemsHTML}
              </nav>
            </div>
            
            <!-- Right side: Settings -->
            <div class="flex items-center gap-2 ml-4">
              <button 
                class="p-2 hover:bg-gray-700 rounded-md transition-colors" 
                aria-label="Settings"
                title="Settings"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Decorative Strip -->
        <div 
          class="absolute bottom-0 left-0 right-0 h-2"
          style="background-color: #00BCD4;"
          aria-hidden="true"
        ></div>
      </header>
    `;
    
    return headerHTML;
  }
  
  // Create dropdown navigation item
  function createDropdownItem(item, currentPath) {
    const isActive = item.items.some(subItem => {
      if (subItem.href) return currentPath.startsWith(subItem.href);
      if (subItem.subItems) return subItem.subItems.some(nested => currentPath.startsWith(nested.href));
      return false;
    });
    
    const dropdownItemsHTML = item.items.map(subItem => {
      if (subItem.type === 'submenu') {
        return createSubmenuItem(subItem, currentPath);
      } else {
        return createDropdownLinkItem(subItem, currentPath);
      }
    }).join('');
    
    return `
      <div class="relative group">
        <button 
          class="text-white hover:text-gray-300 transition-colors font-medium flex items-center gap-1 ${isActive ? 'text-gray-300' : ''}"
        >
          ${item.title}
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div class="absolute left-0 mt-1 pt-1 w-64 group-hover:block z-50 hidden">
          <div class="bg-white rounded-lg shadow-xl border border-gray-200">
            ${dropdownItemsHTML}
          </div>
        </div>
      </div>
    `;
  }
  
  // Create nested submenu item
  function createSubmenuItem(item, currentPath) {
    const isActive = item.subItems.some(nested => currentPath.startsWith(nested.href));
    const isFirst = true; // You might want to pass this from parent
    
    const nestedItemsHTML = item.subItems.map((nested, idx) => {
      const isNestedActive = currentPath.startsWith(nested.href);
      const isFirstNested = idx === 0;
      const isLastNested = idx === item.subItems.length - 1;
      
      return `
        <a 
          href="${nested.href}" 
          class="block px-4 py-3 text-sm transition-colors ${isFirstNested ? 'rounded-t-lg' : ''} ${isLastNested ? 'rounded-b-lg' : ''} ${!isFirstNested ? 'border-t border-gray-100' : ''} ${isNestedActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}"
        >
          <div class="font-medium">${nested.label}</div>
          ${nested.description ? `<div class="text-xs text-gray-500 mt-0.5">${nested.description}</div>` : ''}
        </a>
      `;
    }).join('');
    
    return `
      <div class="relative submenu-group">
        <div class="block px-4 py-3 text-sm transition-colors ${isFirst ? 'rounded-t-lg' : ''} ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">${item.label}</div>
              ${item.description ? `<div class="text-xs text-gray-500 mt-0.5">${item.description}</div>` : ''}
            </div>
            <svg class="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
        <div class="absolute left-full top-0 ml-1 pt-1 w-64 submenu-hover:block z-50 hidden">
          <div class="bg-white rounded-lg shadow-xl border border-gray-200">
            ${nestedItemsHTML}
          </div>
        </div>
      </div>
    `;
  }
  
  // Create simple dropdown link item
  function createDropdownLinkItem(item, currentPath) {
    const isActive = currentPath.startsWith(item.href);
    
    return `
      <a 
        href="${item.href}" 
        class="block px-4 py-3 text-sm transition-colors border-t border-gray-100 rounded-b-lg ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}"
      >
        <div class="font-medium">${item.label}</div>
        ${item.description ? `<div class="text-xs text-gray-500 mt-0.5">${item.description}</div>` : ''}
      </a>
    `;
  }
  
  // Create simple link item
  function createLinkItem(item, currentPath) {
    const isActive = currentPath.startsWith(item.href);
    
    return `
      <a 
        href="${item.href}" 
        class="text-white hover:text-gray-300 transition-colors font-medium ${isActive ? 'text-gray-300' : ''}"
        aria-current="${isActive ? 'page' : 'false'}"
      >
        ${item.title}
      </a>
    `;
  }
  
  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  function init() {
    const headerContainer = document.getElementById('gridstor-header');
    
    if (headerContainer) {
      headerContainer.innerHTML = createHeader();
      
      // Inject required styles
      injectStyles();
    }
  }
  
  // Inject CSS styles for dropdown behavior
  function injectStyles() {
    if (document.getElementById('gridstor-header-styles')) return;
    
    const styleEl = document.createElement('style');
    styleEl.id = 'gridstor-header-styles';
    styleEl.textContent = `
      /* Dropdown hover behavior */
      .group .group-hover\\:block {
        display: none;
      }
      
      .group:hover .group-hover\\:block {
        display: block !important;
      }
      
      /* Smooth fade-in effect for dropdowns */
      .group .group-hover\\:block > div {
        animation: fadeIn 0.15s ease-in-out;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Nested submenu styles */
      .submenu-group {
        position: relative;
      }
      
      .submenu-group .submenu-hover\\:block {
        display: none;
      }
      
      .submenu-group:hover .submenu-hover\\:block {
        display: block !important;
      }
      
      /* Smooth fade-in for nested menus */
      .submenu-group .submenu-hover\\:block > div {
        animation: fadeIn 0.15s ease-in-out;
      }
    `;
    
    document.head.appendChild(styleEl);
  }
  
  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Export for manual initialization
  window.GridStorHeader = {
    init: init,
    config: NAVIGATION_CONFIG
  };
})();
