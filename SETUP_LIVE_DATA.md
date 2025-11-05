# 🚀 Setup Live Data for Market Performance Cards

## Current Status
Your infrastructure is **100% ready**! The cards are currently showing mock data but will automatically switch to live data once you populate the database.

---

## ✅ What's Already Built

1. **8 Locations Configured** with real Yes Energy object IDs:
   - CAISO: NP15, SP15, Goleta
   - ERCOT: Houston Hub, Hidden Lakes, South Hub
   - SPP: North Hub, South Hub

2. **Database Schema** (`prisma/schema.prisma`)
   - Location, TB4Calculation, YTDPerformance tables ready

3. **Yes Energy Service** (`src/lib/services/yes-energy.ts`)
   - Fetches pre-calculated TB2/TB4 values
   - 96% less data than hourly LMPs!

4. **Poll Job** (`src/lib/jobs/poll-yes-energy.ts`)
   - Ready to fetch YTD 2025 data
   - Backfill support for historical data

5. **API Endpoint** (`src/pages/api/market-performance.ts`)
   - Auto-switches from mock to real data
   - 5-minute cache for performance

6. **Frontend Cards** (`src/components/MarketAnalyticsCard.tsx`)
   - Already fetching from API
   - Auto-refresh every 5 minutes

---

## 🎯 4 Steps to Go Live

### Step 1: Create `.env` File

Create a file named `.env` in the project root with:

```bash
# Yes Energy API Credentials
YES_ENERGY_USERNAME="brett.rudder@gridstor.com"
YES_ENERGY_PASSWORD="commonFibre!2"
YES_ENERGY_BASE_URL="https://services.yesenergy.com/PS/rest"

# Database Connection
# Replace with your actual PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:5432/database"
```

**Note:** If you need a different data source, see "Alternative Data Sources" section below.

---

### Step 2: Setup Database

```bash
# Generate Prisma client types
npx prisma generate

# Sync schema to database (creates tables)
npx prisma db push

# Optional: Open Prisma Studio to verify
npx prisma studio
```

---

### Step 3: Test Yes Energy Connection

```bash
# Test single location fetch
npx tsx test-yes-energy.ts
```

**Expected output:**
```
✅ Success! Fetched 168 hourly records
TB4 Calculation successful!
TB4 Value: $125.34/MWh
```

If this fails, check:
- [ ] `.env` credentials are correct
- [ ] Yes Energy service is accessible
- [ ] Date range is not in the future

---

### Step 4: Populate Database with YTD Data

```bash
# Fetch YTD 2025 data for all 8 locations
# This will take ~2 minutes and store ~2,400 records
npx tsx src/lib/jobs/poll-yes-energy.ts
```

**Expected output:**
```
🚀 Starting Yes Energy data poll...
📅 Fetching data from 2025-01-01 to 2025-11-01
📍 Processing 8 locations...

🔄 Processing CAISO - NP15...
  ✅ Fetched 304 daily TB4 values
  📊 2025-01-01: TB4 = $125.34/MWh
  📈 YTD Updated: 304 days, avg = $128.45/MWh, P42

... (continues for all locations)

✨ Poll complete! 8 succeeded, 0 failed in 147.32s
```

---

## 🎉 Verify Live Data

### Check Database
```bash
npx prisma studio
```

Look for:
- **TB4Calculation** table: ~2,400 records (304 days × 8 locations)
- **YTDPerformance** table: 8 records (1 per location)

### Check API
Visit: `http://localhost:4321/api/market-performance`

Look for `"dataSource": "database"` instead of `"dataSource": "mock"`

### Check Homepage
1. Open homepage: `http://localhost:4321`
2. Scroll to "Market Performance Overview"
3. Cards should show:
   - Real YTD TB2/TB4 values
   - P-value performance vs forecast
   - Balance of year projections
   - Data source indicator at bottom

---

## 🔄 Automated Daily Updates

Once everything works, set up automated polling:

### Option A: GitHub Actions (Recommended)

Create `.github/workflows/poll-yes-energy.yml`:

```yaml
name: Daily Yes Energy Poll
on:
  schedule:
    - cron: '0 6 * * *'  # 6 AM UTC daily
  workflow_dispatch:

jobs:
  poll:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx prisma generate
      - run: npx tsx src/lib/jobs/poll-yes-energy.ts
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          YES_ENERGY_USERNAME: ${{ secrets.YES_ENERGY_USERNAME }}
          YES_ENERGY_PASSWORD: ${{ secrets.YES_ENERGY_PASSWORD }}
```

Then add these secrets in your GitHub repo settings:
- `DATABASE_URL`
- `YES_ENERGY_USERNAME`
- `YES_ENERGY_PASSWORD`

### Option B: Netlify Scheduled Function

Create `netlify/functions/scheduled-poll.ts`:

```typescript
import { schedule } from '@netlify/functions';
import { pollYesEnergyData } from '../../src/lib/jobs/poll-yes-energy';

export const handler = schedule('0 6 * * *', async () => {
  console.log('Starting daily Yes Energy poll...');
  const result = await pollYesEnergyData();
  
  return {
    statusCode: result.success ? 200 : 500,
    body: JSON.stringify(result)
  };
});
```

---

## 📊 Alternative Data Sources

If Yes Energy isn't available or you want different data:

### Option 1: GOATS Database
If you have existing TB2/TB4 data in GOATS:

1. Create a similar service (`src/lib/services/goats.ts`)
2. Update poll job to fetch from GOATS instead
3. Same data flow: GOATS → Database → API → Cards

### Option 2: CSV Import
If you have CSV files with historical TB2/TB4 data:

```bash
# Create import script
npx tsx scripts/import-tb4-from-csv.ts <path-to-csv>
```

I can create this script if you have CSV files.

### Option 3: Manual Entry
For smaller datasets, use Prisma Studio:

```bash
npx prisma studio
```

Manually add records to `TB4Calculation` and `YTDPerformance` tables.

---

## 🐛 Troubleshooting

### "Prisma client not generated"
```bash
npx prisma generate
```

### "Database connection error"
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify credentials are correct

### "Yes Energy authentication failed"
- Verify username/password in `.env`
- Try accessing Yes Energy web portal with same credentials
- Check if IP is whitelisted

### "No data returned from Yes Energy"
- Check date range isn't in future
- Verify object IDs are correct
- Test URL manually in browser

### "Cards still show mock data after poll"
- Verify `TB4Calculation` table has records
- Check API returns `"dataSource": "database"`
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for errors

---

## 📈 Data Flow Summary

```
┌─────────────────┐
│  Yes Energy API │
│  (TB2/TB4 data) │
└────────┬────────┘
         │ Poll Job (daily at 6 AM)
         ▼
┌─────────────────┐
│    Database     │
│  TB4Calculation │
│  YTDPerformance │
└────────┬────────┘
         │ API queries on demand
         ▼
┌─────────────────────┐
│  /api/market-       │
│  performance        │
│  (5-min cache)      │
└────────┬────────────┘
         │ Cards auto-refresh
         ▼
┌─────────────────────┐
│ Market Performance  │
│  Overview Cards     │
│  (Homepage)         │
└─────────────────────┘
```

---

## 🎯 Success Checklist

- [ ] `.env` file created with credentials
- [ ] `npx prisma generate` completed
- [ ] `npx prisma db push` completed
- [ ] Test script passes
- [ ] Poll job completes successfully
- [ ] Database has TB4 records
- [ ] API returns `"dataSource": "database"`
- [ ] Homepage cards show real values
- [ ] Scheduled job configured
- [ ] Cards look good and layout is preserved ✨

---

## 💡 What You Get

After setup, your Market Performance Overview section will show:

- ✅ **Real TB2/TB4 values** from Yes Energy
- ✅ **YTD performance** across 8 locations
- ✅ **P-value analysis** (where actuals fall in forecast distribution)
- ✅ **Balance of year projections**
- ✅ **Year-over-year comparisons**
- ✅ **Automatic daily updates**
- ✅ **Beautiful cards** (same layout, real data!)

---

## 📞 Need Help?

If you encounter issues or want to use a different data source:

1. Check `docs/recent-updates/` for detailed technical docs
2. Review error messages in console
3. Test each step individually
4. Verify credentials and permissions

---

**Ready? Start with Step 1!** ⬆️

The infrastructure is solid - you're just one command away from live data! 🚀

