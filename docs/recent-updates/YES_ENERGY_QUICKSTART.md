# Yes Energy Integration - Quick Start Guide

This guide will help you get the Yes Energy integration up and running quickly.

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Add Environment Variables

Create or update your `.env` file with:

```bash
# Yes Energy API
YES_ENERGY_BASE_URL="https://services.yesenergy.com"
YES_ENERGY_API_KEY="your_api_key_here"
```

Or if using username/password:
```bash
YES_ENERGY_USERNAME="your_username"
YES_ENERGY_PASSWORD="your_password"
```

### Step 2: Get Node IDs from Modeling Project

Look in your Modeling Proving Ground project for node IDs. Common locations:
- Configuration files
- Example queries
- Database schemas

Update `src/lib/services/yes-energy.ts` lines 24-65:

```typescript
export const YES_ENERGY_LOCATIONS: YesEnergyLocation[] = [
  {
    market: 'CAISO',
    locationName: 'NP15',
    nodeId: '12345'  // ← Replace with actual node ID
  },
  // ... etc
];
```

### Step 3: Implement API Calls

In `src/lib/services/yes-energy.ts`, complete these 3 methods:

#### A. Authentication (line 52)
```typescript
private async authenticate(): Promise<string> {
  const response = await fetch(`${this.config.baseUrl}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      username: this.config.username,
      password: this.config.password
    })
  });
  return (await response.json()).token;
}
```

#### B. Fetch Day-Ahead LMPs (line 79)
```typescript
async fetchDayAheadLMP(nodeId: string, startDate: Date, endDate: Date) {
  const token = await this.authenticate();
  
  const response = await fetch(
    `${this.config.baseUrl}/ps/rest/timeseries/multiple.csv?` +
    `objectid=${nodeId}&startdate=${startDate.toISOString().split('T')[0]}` +
    `&enddate=${endDate.toISOString().split('T')[0]}&datatype=LMP_DA`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  return this.transformYesEnergyData(await response.json());
}
```

#### C. Transform Response (line 125)
```typescript
private transformYesEnergyData(data: any): LMPDataPoint[] {
  return data.rows.map(row => ({
    timestamp: row.timestamp,
    hour: new Date(row.timestamp).getHours() + 1,
    dayAheadPrice: row.value,
    // ... other fields
  }));
}
```

### Step 4: Test with One Location

```bash
# Run the poll job manually
npx ts-node src/lib/jobs/poll-yes-energy.ts
```

Or create a test script:
```typescript
import { pollYesEnergyData } from './src/lib/jobs/poll-yes-energy';

pollYesEnergyData({
  locations: ['NP15'],  // Test one location first
  backfillDays: 7       // Get last week of data
}).then(console.log);
```

### Step 5: Set Up Scheduled Job

Once testing works, schedule the job to run daily:

#### Option A: Netlify Scheduled Functions
Create `netlify/functions/scheduled-poll.ts`:
```typescript
import { schedule } from '@netlify/functions';
import { pollYesEnergyData } from '../../src/lib/jobs/poll-yes-energy';

export const handler = schedule('0 6 * * *', async () => {
  const result = await pollYesEnergyData();
  return {
    statusCode: result.success ? 200 : 500,
    body: JSON.stringify(result)
  };
});
```

#### Option B: GitHub Actions
Create `.github/workflows/poll-yes-energy.yml`:
```yaml
name: Poll Yes Energy Data
on:
  schedule:
    - cron: '0 6 * * *'  # 6 AM daily
  workflow_dispatch:     # Manual trigger

jobs:
  poll:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx ts-node src/lib/jobs/poll-yes-energy.ts
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          YES_ENERGY_API_KEY: ${{ secrets.YES_ENERGY_API_KEY }}
```

---

## 📋 Testing Checklist

- [ ] Environment variables set
- [ ] Node IDs configured
- [ ] Authentication works
- [ ] Can fetch 1 day of data for 1 location
- [ ] Data appears in database (LMPData table)
- [ ] TB4 calculation produces reasonable values
- [ ] YTD performance updates correctly
- [ ] API endpoint returns live data (not mock)
- [ ] Frontend cards display live data
- [ ] Scheduled job runs successfully

---

## 🔍 Troubleshooting

### "Authentication not implemented" error
→ Complete the `authenticate()` method in `yes-energy.ts`

### "Node ID not found" error
→ Check that node IDs are correct in `YES_ENERGY_LOCATIONS`

### Data not appearing in cards
→ Check that `/api/market-performance` is querying the database
→ Verify `getMarketPerformanceData()` isn't falling back to mock data

### Missing hours in data
→ Check Yes Energy response format
→ Verify hour numbering (1-24 vs 0-23)
→ Handle DST transitions (23/25 hour days)

---

## 💡 Pro Tips

1. **Start Small**: Test with 1 location and 1 day first
2. **Check Response Format**: Print raw Yes Energy response to understand structure
3. **Handle Errors**: Add try-catch and logging throughout
4. **Rate Limits**: Add delays between requests if needed
5. **Backfill Smart**: Don't backfill years of data at once - do it in chunks

---

## 📞 Questions?

When you hit issues, provide:
1. Which step you're on
2. Error messages (full stack trace)
3. Sample Yes Energy response (if available)
4. Node ID examples

I'll help debug and get you unblocked!

---

## 🎯 Success Criteria

You'll know it's working when:
✅ Running the poll job completes without errors
✅ LMPData table has hourly records
✅ TB4Calculation table has daily records
✅ Homepage cards show "database" as data source (not "mock")
✅ Values update when you refresh after running poll job
✅ Location switching works on cards
✅ YTD values calculate correctly

Once all these pass, you're live! 🎉

