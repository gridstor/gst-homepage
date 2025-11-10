import dotenv from 'dotenv';
import { getLatestYTDData, analyticsDb } from '../src/lib/db-analytics';

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('🔍 Testing Analytics Workspace Connection...\n');
  
  // Check environment variable
  const dbUrl = process.env.DATABASE_URL_ANALYTICSWORKSPACE;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL_ANALYTICSWORKSPACE is not set in .env file');
    console.log('\nPlease create a .env file with:');
    console.log('DATABASE_URL_ANALYTICSWORKSPACE="postgresql://user:password@host:port/database"\n');
    process.exit(1);
  }
  
  console.log('✅ DATABASE_URL_ANALYTICSWORKSPACE is configured');
  console.log(`   Connection: ${dbUrl.split('@')[1] || 'configured'}\n`);
  
  try {
    // Test raw query to check table exists
    console.log('📊 Querying Homepage_YTD_TBx table...\n');
    
    const result = await analyticsDb.$queryRaw`
      SELECT 
        "Asset", 
        "ISO", 
        "TBx", 
        "YTD TBx", 
        "Run Date"
      FROM "Homepage_YTD_TBx"
      ORDER BY "Run Date" DESC
      LIMIT 10
    `;
    
    console.log(`✅ Found ${Array.isArray(result) ? result.length : 0} records (showing up to 10 most recent)\n`);
    
    if (Array.isArray(result) && result.length > 0) {
      console.log('Sample data:');
      console.table(result);
      
      // Get latest data using helper function
      console.log('\n📈 Getting latest YTD data per asset/iso...\n');
      const latestData = await getLatestYTDData();
      
      console.log(`✅ Found ${latestData.length} unique asset/iso combinations:\n`);
      console.table(latestData);
      
      // Group by market
      const byMarket = latestData.reduce((acc, record) => {
        const market = record.ISO.toUpperCase();
        if (!acc[market]) acc[market] = [];
        acc[market].push(record);
        return acc;
      }, {} as Record<string, typeof latestData>);
      
      console.log('\n📊 Data by Market:\n');
      Object.entries(byMarket).forEach(([market, records]) => {
        console.log(`${market}:`);
        records.forEach(r => {
          console.log(`  - ${r.Asset}: ${r["YTD TBx"]} $/kW-month (${r.TBx}) [run date: ${r["Run Date"].toISOString().split('T')[0]}]`);
        });
        console.log();
      });
      
      // Check for data quality issues
      console.log('🔍 Data Quality Check:\n');
      
      const issues = [];
      latestData.forEach(record => {
        const ytdValue = record["YTD TBx"];
        if (ytdValue === 0) {
          issues.push(`⚠️  ${record.ISO} ${record.Asset}: YTD TBx is 0`);
        }
        if (ytdValue < 0) {
          issues.push(`⚠️  ${record.ISO} ${record.Asset}: YTD TBx is negative (${ytdValue})`);
        }
        if (ytdValue > 50) {
          issues.push(`ℹ️  ${record.ISO} ${record.Asset}: YTD TBx is ${ytdValue} $/kW-month (seems high, please verify)`);
        }
      });
      
      if (issues.length > 0) {
        issues.forEach(issue => console.log(issue));
      } else {
        console.log('✅ No data quality issues detected');
      }
      
    } else {
      console.log('⚠️  No records found in Homepage_YTD_TBx table');
      console.log('   Please ensure the table is populated with data');
    }
    
  } catch (error) {
    console.error('❌ Error querying database:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.error('\n💡 The table "Homepage_YTD_TBx" does not exist in the database.');
        console.error('   Please verify the table name and schema.');
      } else if (error.message.includes('connect')) {
        console.error('\n💡 Could not connect to the database.');
        console.error('   Please check your DATABASE_URL_ANALYTICSWORKSPACE connection string.');
      }
    }
    process.exit(1);
  } finally {
    await analyticsDb.$disconnect();
  }
  
  console.log('\n✅ Connection test completed successfully!\n');
}

testConnection().catch(console.error);

