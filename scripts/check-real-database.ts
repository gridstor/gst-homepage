import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function checkRealDatabase() {
  console.log('🔍 Checking YOUR REAL Database...\n');
  
  try {
    // Check Location table
    console.log('📍 Locations in YOUR database:\n');
    const locations = await prisma.location.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        market: true,
        region: true,
        nodeId: true
      },
      orderBy: [
        { market: 'asc' },
        { name: 'asc' }
      ]
    });
    
    console.log(`Found ${locations.length} locations:\n`);
    console.table(locations);
    
    // Check YTDPerformance table
    console.log('\n📊 YTD Performance data in YOUR database:\n');
    const ytdData = await prisma.yTDPerformance.findMany({
      include: {
        location: {
          select: {
            name: true,
            market: true
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { location: { market: 'asc' } }
      ],
      take: 20
    });
    
    console.log(`Found ${ytdData.length} YTD performance records:\n`);
    if (ytdData.length > 0) {
      console.table(ytdData.map(record => ({
        Location: record.location.name,
        Market: record.location.market,
        Year: record.year,
        'YTD TB4 Avg': record.ytdTB4Avg.toFixed(2),
        'YTD Days': record.ytdDaysCount,
        'Last Updated': record.lastUpdated.toISOString().split('T')[0]
      })));
    } else {
      console.log('No YTD performance data found.');
    }
    
    // Check TB4Calculation table
    console.log('\n📈 Recent TB4 Calculations in YOUR database:\n');
    const tb4Data = await prisma.tB4Calculation.findMany({
      include: {
        location: {
          select: {
            name: true,
            market: true
          }
        }
      },
      orderBy: {
        marketDate: 'desc'
      },
      take: 10
    });
    
    console.log(`Found ${tb4Data.length} TB4 calculation records (showing most recent):\n`);
    if (tb4Data.length > 0) {
      console.table(tb4Data.map(record => ({
        Location: record.location.name,
        Market: record.location.market,
        Date: record.marketDate.toISOString().split('T')[0],
        'TB4 Value': record.tb4Value.toFixed(2),
        'Avg Peak': record.avgPeakPrice.toFixed(2),
        'Avg Trough': record.avgTroughPrice.toFixed(2)
      })));
    } else {
      console.log('No TB4 calculation data found.');
    }
    
    // Check Forecast table
    console.log('\n📅 Forecasts in YOUR database:\n');
    const forecasts = await prisma.forecast.findMany({
      include: {
        location: {
          select: {
            name: true,
            market: true
          }
        }
      },
      orderBy: [
        { forecastYear: 'desc' },
        { location: { market: 'asc' } }
      ],
      take: 20
    });
    
    console.log(`Found ${forecasts.length} forecast records:\n`);
    if (forecasts.length > 0) {
      console.table(forecasts.map(record => ({
        Location: record.location.name,
        Market: record.location.market,
        Year: record.forecastYear,
        Type: record.forecastType,
        'TB4 Forecast': record.tb4Forecast?.toFixed(2) || 'N/A',
        'Energy Arb': record.energyArbRevenue?.toFixed(2) || 'N/A'
      })));
    } else {
      console.log('No forecast data found.');
    }
    
  } catch (error) {
    console.error('\n❌ Error querying database:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    }
  } finally {
    await prisma.$disconnect();
  }
  
  console.log('\n✅ Database check complete!\n');
}

checkRealDatabase().catch(console.error);

