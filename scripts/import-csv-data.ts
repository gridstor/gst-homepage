/**
 * Import TB2/TB4 data from CSV files
 * 
 * Usage: npx tsx scripts/import-csv-data.ts <path-to-csv>
 * 
 * CSV Format:
 * date,location,market,tb_value
 * 2025-01-01,NP15,CAISO,125.34
 * 2025-01-01,Houston Hub,ERCOT,95.12
 * ...
 */

import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { prisma } from '../src/lib/db';

interface CsvRow {
  date: string;
  location: string;
  market: string;
  tb_value: string;
}

async function importCsvData(csvPath: string) {
  console.log('📊 Importing TB2/TB4 data from CSV...\n');
  
  // Read CSV file
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`);
    process.exit(1);
  }
  
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records: CsvRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  
  console.log(`📄 Found ${records.length} records in CSV\n`);
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  // Process each record
  for (const record of records) {
    try {
      const marketDate = new Date(record.date);
      const tbValue = parseFloat(record.tb_value);
      
      if (isNaN(tbValue)) {
        console.warn(`⚠️  Skipping invalid TB value for ${record.location} on ${record.date}`);
        skipped++;
        continue;
      }
      
      // Find or create location
      const location = await (prisma as any).location.upsert({
        where: {
          market_name: {
            market: record.market.toUpperCase(),
            name: record.location
          }
        },
        create: {
          name: record.location,
          market: record.market.toUpperCase(),
          isActive: true
        },
        update: {}
      });
      
      // Insert TB4 calculation
      await (prisma as any).tB4Calculation.upsert({
        where: {
          locationId_marketDate: {
            locationId: location.id,
            marketDate: marketDate
          }
        },
        create: {
          locationId: location.id,
          marketDate: marketDate,
          tb4Value: tbValue,
          peakHours: [],
          troughHours: [],
          avgPeakPrice: 0,
          avgTroughPrice: 0,
          dataQuality: 'imported'
        },
        update: {
          tb4Value: tbValue,
          dataQuality: 'imported'
        }
      });
      
      imported++;
      
      if (imported % 50 === 0) {
        console.log(`  ✅ Imported ${imported} records...`);
      }
      
    } catch (error) {
      console.error(`❌ Error importing ${record.location} - ${record.date}:`, error);
      errors++;
    }
  }
  
  console.log(`\n✨ Import complete!`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
  
  // Update YTD performance for all locations
  console.log('\n📈 Updating YTD performance...');
  
  const locations = await (prisma as any).location.findMany({
    where: { isActive: true }
  });
  
  for (const location of locations) {
    await updateYTDPerformance(location.id);
  }
  
  console.log('✅ YTD performance updated for all locations');
}

async function updateYTDPerformance(locationId: string) {
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1);
  const now = new Date();
  
  // Get all TB4 calculations for this year
  const tb4Data = await (prisma as any).tB4Calculation.findMany({
    where: {
      locationId,
      marketDate: {
        gte: yearStart,
        lte: now
      }
    },
    orderBy: { marketDate: 'asc' }
  });
  
  if (tb4Data.length === 0) {
    return;
  }
  
  // Calculate YTD average
  const ytdTB4Avg = tb4Data.reduce((sum: number, d: any) => sum + d.tb4Value, 0) / tb4Data.length;
  
  // Update YTD performance record
  await (prisma as any).yTDPerformance.upsert({
    where: {
      locationId_year: {
        locationId,
        year: currentYear
      }
    },
    create: {
      locationId,
      year: currentYear,
      ytdTB4Avg,
      ytdDaysCount: tb4Data.length
    },
    update: {
      ytdTB4Avg,
      ytdDaysCount: tb4Data.length
    }
  });
}

// Run import
const csvPath = process.argv[2];

if (!csvPath) {
  console.error('Usage: npx tsx scripts/import-csv-data.ts <path-to-csv>');
  console.error('\nCSV Format:');
  console.error('date,location,market,tb_value');
  console.error('2025-01-01,NP15,CAISO,125.34');
  console.error('2025-01-01,Houston Hub,ERCOT,95.12');
  process.exit(1);
}

importCsvData(csvPath)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

