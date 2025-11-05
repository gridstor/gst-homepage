/**
 * Interactive script to set up .env file for Yes Energy integration
 * 
 * Usage: npx tsx scripts/setup-env.ts
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setupEnv() {
  console.log('🔧 Yes Energy Integration Setup\n');
  console.log('This script will help you create a .env file with the required credentials.\n');
  
  // Check if .env already exists
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }
  
  console.log('\n--- Yes Energy Credentials ---\n');
  
  const username = await question('Yes Energy Username (brett.rudder@gridstor.com): ') || 'brett.rudder@gridstor.com';
  const password = await question('Yes Energy Password (commonFibre!2): ') || 'commonFibre!2';
  const baseUrl = await question('Yes Energy Base URL (https://services.yesenergy.com/PS/rest): ') || 'https://services.yesenergy.com/PS/rest';
  
  console.log('\n--- Database Configuration ---\n');
  console.log('Format: postgresql://username:password@host:port/database');
  const databaseUrl = await question('Database URL: ');
  
  if (!databaseUrl) {
    console.log('\n⚠️  Warning: Database URL is empty. You will need to add it manually to .env');
  }
  
  // Build .env content
  const envContent = `# Yes Energy API Credentials
YES_ENERGY_USERNAME="${username}"
YES_ENERGY_PASSWORD="${password}"
YES_ENERGY_BASE_URL="${baseUrl}"

# Database Connection
DATABASE_URL="${databaseUrl}"

# Optional: Node Environment
NODE_ENV="development"
`;
  
  // Write .env file
  try {
    fs.writeFileSync(envPath, envContent, { encoding: 'utf-8' });
    console.log('\n✅ .env file created successfully!');
    console.log(`\nFile location: ${envPath}`);
    console.log('\nNext steps:');
    console.log('1. Run: npx prisma generate');
    console.log('2. Run: npx prisma db push');
    console.log('3. Run: npx tsx test-yes-energy.ts');
    console.log('4. Run: npx tsx src/lib/jobs/poll-yes-energy.ts');
  } catch (error) {
    console.error('\n❌ Error creating .env file:', error);
    console.error('\nPlease create .env file manually with the following content:\n');
    console.log(envContent);
  }
  
  rl.close();
}

setupEnv().catch(console.error);

