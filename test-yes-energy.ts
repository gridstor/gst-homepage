/**
 * Test script for Yes Energy API integration
 * 
 * Usage:
 *   1. Add credentials to .env file
 *   2. Update nodeId below with actual object ID
 *   3. Run: npx tsx test-yes-energy.ts
 */

import { yesEnergyService, calculateTB4 } from './src/lib/services/yes-energy';

async function testYesEnergyIntegration() {
  console.log('🧪 Testing Yes Energy API Integration\n');
  
  // Configuration
  const nodeId = 'YOUR_NP15_OBJECT_ID_HERE';  // ← REPLACE WITH ACTUAL OBJECT ID
  const startDate = new Date('2025-10-24');
  const endDate = new Date('2025-10-30');
  
  console.log('Configuration:');
  console.log(`  Node ID: ${nodeId}`);
  console.log(`  Date Range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
  console.log('\n---\n');
  
  try {
    // Test 1: Fetch LMP data
    console.log('Test 1: Fetching day-ahead LMP data...');
    const data = await yesEnergyService.fetchDayAheadLMP(
      nodeId,
      startDate,
      endDate
    );
    
    console.log(`✅ Success! Fetched ${data.length} hourly records\n`);
    
    // Show sample data
    console.log('Sample records (first 3):');
    data.slice(0, 3).forEach((record, i) => {
      console.log(`  ${i + 1}. ${record.timestamp} - Hour ${record.hour} - $${record.dayAheadPrice.toFixed(2)}/MWh`);
    });
    console.log('\n---\n');
    
    // Test 2: TB4 Calculation
    if (data.length >= 24) {
      console.log('Test 2: Calculating TB4 for first day...');
      
      // Get first 24 hours
      const firstDayPrices = data.slice(0, 24).map(d => d.dayAheadPrice);
      const tb4Result = calculateTB4(firstDayPrices);
      
      console.log(`✅ TB4 Calculation successful!\n`);
      console.log(`TB4 Value: $${tb4Result.tb4Value.toFixed(2)}/MWh`);
      console.log(`Peak Hours (top 4): ${tb4Result.peakHours.join(', ')}`);
      console.log(`  Average Peak Price: $${tb4Result.avgPeakPrice.toFixed(2)}/MWh`);
      console.log(`Trough Hours (bottom 4): ${tb4Result.troughHours.join(', ')}`);
      console.log(`  Average Trough Price: $${tb4Result.avgTroughPrice.toFixed(2)}/MWh`);
      console.log('\n---\n');
    } else {
      console.log('⚠️  Not enough data for TB4 calculation (need 24 hours)\n');
    }
    
    // Test 3: Data quality checks
    console.log('Test 3: Data quality checks...');
    const missingValues = data.filter(d => !d.dayAheadPrice || isNaN(d.dayAheadPrice));
    const negativeValues = data.filter(d => d.dayAheadPrice < 0);
    const highValues = data.filter(d => d.dayAheadPrice > 1000);
    
    console.log(`  Total records: ${data.length}`);
    console.log(`  Missing values: ${missingValues.length}`);
    console.log(`  Negative prices: ${negativeValues.length} (normal for CAISO)`);
    console.log(`  Prices > $1000/MWh: ${highValues.length} (potential outliers)`);
    
    if (data.length > 0) {
      const avgPrice = data.reduce((sum, d) => sum + d.dayAheadPrice, 0) / data.length;
      const maxPrice = Math.max(...data.map(d => d.dayAheadPrice));
      const minPrice = Math.min(...data.map(d => d.dayAheadPrice));
      
      console.log(`  Average Price: $${avgPrice.toFixed(2)}/MWh`);
      console.log(`  Price Range: $${minPrice.toFixed(2)} to $${maxPrice.toFixed(2)}/MWh`);
    }
    
    console.log('\n---\n');
    console.log('🎉 All tests passed!');
    console.log('\nNext steps:');
    console.log('1. Add all 9 object IDs to src/lib/services/yes-energy.ts');
    console.log('2. Run the polling job: npx tsx src/lib/jobs/poll-yes-energy.ts');
    console.log('3. Check database for data');
    console.log('4. View live data on homepage');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Check that .env file has YES_ENERGY_USERNAME and YES_ENERGY_PASSWORD');
    console.error('2. Verify object ID is correct (not a placeholder)');
    console.error('3. Ensure date range is valid (not future dates)');
    console.error('4. Check network connectivity to Yes Energy API');
    process.exit(1);
  }
}

// Run the test
testYesEnergyIntegration();

