/**
 * Fetch YTD 2025 data from Yes Energy
 * This will fetch from January 1, 2025 to today
 * 
 * Usage: npx tsx scripts/fetch-ytd-data.ts
 */

// Bypass SSL certificate validation for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { pollYesEnergyData } from '../src/lib/jobs/poll-yes-energy';

async function fetchYTDData() {
  console.log('📅 Fetching YTD 2025 data from Yes Energy...\n');
  
  const startDate = new Date('2025-01-01');
  const endDate = new Date(); // Today
  
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  console.log(`Date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
  console.log(`Total days: ${daysDiff}`);
  console.log(`This will take approximately ${Math.ceil(daysDiff * 8 * 6 / 60)} minutes (6 seconds per location)\n`);
  
  const result = await pollYesEnergyData({
    date: endDate,
    backfillDays: daysDiff
  });
  
  if (result.success) {
    console.log('\n✅ YTD data fetch complete!');
    console.log(`   Succeeded: ${result.succeeded} locations`);
    console.log(`   Failed: ${result.failed} locations`);
    console.log(`   Duration: ${result.duration}s\n`);
  } else {
    console.error('\n❌ YTD data fetch failed!');
    console.error(`   Errors: ${result.errors.join(', ')}`);
  }
  
  return result;
}

fetchYTDData()
  .then(result => process.exit(result.success ? 0 : 1))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

