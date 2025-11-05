/**
 * Seed location data into database
 * Creates the 8 market locations with Yes Energy object IDs
 * 
 * Usage: npx tsx scripts/seed-locations.ts
 */

// Bypass SSL certificate validation for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { prisma } from '../src/lib/db';

const LOCATIONS = [
  // CAISO (TB4)
  {
    name: 'NP15',
    market: 'CAISO',
    nodeId: '20000004677',
    region: 'Northern California',
    latitude: 38.5816,
    longitude: -121.4944,
    isActive: true
  },
  {
    name: 'SP15',
    market: 'CAISO',
    nodeId: '20000004682',
    region: 'Southern California',
    latitude: 34.0522,
    longitude: -118.2437,
    isActive: true
  },
  {
    name: 'Goleta',
    market: 'CAISO',
    nodeId: '20000001321',
    region: 'Southern California',
    latitude: 34.4208,
    longitude: -119.8286,
    isActive: true
  },
  // ERCOT (TB2)
  {
    name: 'Houston Hub',
    market: 'ERCOT',
    nodeId: '10000697077',
    region: 'Houston Zone',
    latitude: 29.7604,
    longitude: -95.3698,
    isActive: true
  },
  {
    name: 'Hidden Lakes',
    market: 'ERCOT',
    nodeId: '10002872961',
    region: 'West Zone',
    latitude: 31.9686,
    longitude: -99.9018,
    isActive: true
  },
  {
    name: 'South Hub',
    market: 'ERCOT',
    nodeId: '10000697079',
    region: 'South Zone',
    latitude: 28.0000,
    longitude: -98.0000,
    isActive: true
  },
  // SPP (TB4)
  {
    name: 'North Hub',
    market: 'SPP',
    nodeId: '10002511523',
    region: 'SPP North',
    latitude: 41.2565,
    longitude: -95.9345,
    isActive: true
  },
  {
    name: 'South Hub',
    market: 'SPP',
    nodeId: '10002511524',
    region: 'SPP South',
    latitude: 35.4676,
    longitude: -97.5164,
    isActive: true
  }
];

async function seedLocations() {
  console.log('📍 Seeding locations...\n');
  
  try {
    let created = 0;
    let updated = 0;
    
    for (const location of LOCATIONS) {
      const result = await (prisma as any).location.upsert({
        where: {
          market_name: {
            market: location.market,
            name: location.name
          }
        },
        create: location,
        update: {
          nodeId: location.nodeId,
          region: location.region,
          latitude: location.latitude,
          longitude: location.longitude,
          isActive: location.isActive
        }
      });
      
      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++;
        console.log(`  ✅ Created: ${location.market} - ${location.name}`);
      } else {
        updated++;
        console.log(`  🔄 Updated: ${location.market} - ${location.name}`);
      }
    }
    
    console.log(`\n✨ Seeding complete!`);
    console.log(`  Created: ${created} locations`);
    console.log(`  Updated: ${updated} locations`);
    
  } catch (error) {
    console.error('❌ Error seeding locations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedLocations().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

