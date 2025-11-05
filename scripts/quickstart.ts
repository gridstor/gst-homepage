/**
 * Quick Start Script - Automated setup for Yes Energy integration
 * 
 * This script will:
 * 1. Check prerequisites
 * 2. Generate Prisma client
 * 3. Sync database schema
 * 4. Test Yes Energy connection
 * 5. Optionally run initial data poll
 * 
 * Usage: npx tsx scripts/quickstart.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

function runCommand(command: string, description: string) {
  console.log(`\n🔧 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} complete`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed`);
    return false;
  }
}

async function quickStart() {
  console.log('🚀 Yes Energy Integration Quick Start\n');
  console.log('This will set up your environment for live data.\n');
  
  // Step 1: Check .env
  console.log('--- Step 1: Check Prerequisites ---\n');
  
  if (!fs.existsSync('.env')) {
    console.log('❌ .env file not found');
    console.log('\nPlease create a .env file with:');
    console.log('  YES_ENERGY_USERNAME="..."');
    console.log('  YES_ENERGY_PASSWORD="..."');
    console.log('  DATABASE_URL="postgresql://..."');
    console.log('\nYou can run: npx tsx scripts/setup-env.ts');
    rl.close();
    process.exit(1);
  }
  
  console.log('✅ .env file found');
  
  // Check if database URL is set
  const envContent = fs.readFileSync('.env', 'utf-8');
  if (!envContent.includes('DATABASE_URL')) {
    console.log('⚠️  DATABASE_URL not found in .env');
    console.log('Please add your PostgreSQL connection string to .env');
    rl.close();
    process.exit(1);
  }
  
  console.log('✅ DATABASE_URL configured');
  
  // Step 2: Generate Prisma client
  console.log('\n--- Step 2: Generate Prisma Client ---');
  if (!runCommand('npx prisma generate', 'Generating Prisma client')) {
    rl.close();
    process.exit(1);
  }
  
  // Step 3: Sync database schema
  console.log('\n--- Step 3: Sync Database Schema ---');
  const syncDb = await question('\nSync database schema? This will create/update tables. (Y/n): ');
  if (syncDb.toLowerCase() !== 'n') {
    if (!runCommand('npx prisma db push', 'Syncing database schema')) {
      console.log('\n⚠️  Database sync failed. Please check:');
      console.log('  1. PostgreSQL is running');
      console.log('  2. DATABASE_URL is correct');
      console.log('  3. Database user has permissions');
      rl.close();
      process.exit(1);
    }
  }
  
  // Step 4: Test Yes Energy connection
  console.log('\n--- Step 4: Test Yes Energy Connection ---');
  const testConnection = await question('\nTest Yes Energy API connection? (Y/n): ');
  if (testConnection.toLowerCase() !== 'n') {
    console.log('\n📡 Testing Yes Energy API...');
    console.log('Note: This test is in test-yes-energy.ts and needs object ID configured');
    console.log('Skipping automated test - please run manually: npx tsx test-yes-energy.ts');
  }
  
  // Step 5: Poll data
  console.log('\n--- Step 5: Fetch Initial Data ---');
  const pollData = await question('\nFetch YTD data from Yes Energy? This will take ~2 minutes. (Y/n): ');
  if (pollData.toLowerCase() !== 'n') {
    if (!runCommand('npx tsx src/lib/jobs/poll-yes-energy.ts', 'Fetching YTD data')) {
      console.log('\n⚠️  Data poll failed. Please check:');
      console.log('  1. Yes Energy credentials are correct');
      console.log('  2. Object IDs are valid');
      console.log('  3. Date range is not in future');
      console.log('\nYou can retry manually: npx tsx src/lib/jobs/poll-yes-energy.ts');
    }
  }
  
  // Step 6: Check status
  console.log('\n--- Step 6: Verify Setup ---');
  if (!runCommand('npx tsx scripts/check-data-status.ts', 'Checking data status')) {
    console.log('⚠️  Could not verify data status');
  }
  
  // Done!
  console.log('\n✨ Quick Start Complete!\n');
  console.log('Next steps:');
  console.log('  1. Start dev server: npm run dev');
  console.log('  2. Open: http://localhost:4321');
  console.log('  3. Scroll to "Market Performance Overview"');
  console.log('  4. Cards should show live data!');
  console.log('\nHelpful commands:');
  console.log('  npm run check-data     - Check database status');
  console.log('  npm run poll-data      - Manually fetch latest data');
  console.log('  npm run db-studio      - Open Prisma Studio');
  console.log('  npm run test-yes       - Test Yes Energy connection');
  
  rl.close();
}

quickStart().catch(error => {
  console.error('Fatal error:', error);
  rl.close();
  process.exit(1);
});

