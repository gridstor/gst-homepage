# 🚀 Quick Start: Populate Market Performance Cards with Live Data

## ✨ Current Status

Your Market Performance Overview cards are **already built and ready** - they're just waiting for live data!

**What you have:**
- ✅ Beautiful cards with proper layout
- ✅ 8 locations configured (CAISO, ERCOT, SPP)
- ✅ Yes Energy integration ready
- ✅ Database schema designed
- ✅ API endpoint functional
- ✅ Auto-refresh every 5 minutes

**What happens now:**
- Cards show mock data as fallback
- Once you populate the database, cards **automatically** switch to live data
- **NO code changes needed** - just run the data import!

---

## 🎯 Recommended Approach: Yes Energy Direct Pull

**Data Flow:**
```
Yes Energy API → Poll Job → Database → API → Cards (Auto-refreshed)
```

**Why this is best:**
- Pre-calculated TB2/TB4 values (96% less data than hourly LMPs!)
- Daily automated updates
- Fast API responses
- Works offline when Yes Energy is down
- Can backfill historical data

---

## 🏁 3-Minute Setup

### Option 1: Automated Setup (Easiest)

```bash
# Install dependencies if needed
npm install

# Run interactive setup
npm run setup
```

This will:
1. Check for `.env` file
2. Generate Prisma client
3. Sync database schema
4. Test Yes Energy connection
5. Fetch YTD 2025 data

### Option 2: Manual Setup

```bash
# 1. Create .env file (see below for content)
npm run setup:env

# 2. Generate Prisma client
npx prisma generate

# 3. Sync database
npx prisma db push

# 4. Test connection
npm run test-yes

# 5. Fetch YTD data (takes ~2 minutes)
npm run poll-data

# 6. Verify data
npm run check-data
```

---

## 📝 Required: .env File

Create a `.env` file in the project root:

```bash
# Yes Energy Credentials
YES_ENERGY_USERNAME="brett.rudder@gridstor.com"
YES_ENERGY_PASSWORD="commonFibre!2"
YES_ENERGY_BASE_URL="https://services.yesenergy.com/PS/rest"

# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/database"
```

---

## ✅ Verify Live Data

### 1. Check Database
```bash
npm run check-data
```

Look for:
- ~2,400 TB4Calculation records
- 8 YTDPerformance records

### 2. Check API
Open: `http://localhost:4321/api/market-performance`

Look for `"dataSource": "database"` (not "mock")

### 3. View Homepage
```bash
npm run dev
```

Then open `http://localhost:4321` and scroll to "Market Performance Overview"

**You should see:**
- Real YTD TB2/TB4 values
- P-value performance indicators
- Balance of year projections
- "Last updated" timestamp
- Same beautiful card layout! ✨

---

## 🔄 Daily Updates

Set up automated polling (pick one):

### Option A: GitHub Actions

Create `.github/workflows/poll-yes-energy.yml`:

```yaml
name: Daily Yes Energy Poll
on:
  schedule:
    - cron: '0 6 * * *'  # 6 AM UTC
  workflow_dispatch:

jobs:
  poll:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx prisma generate
      - run: npm run poll-data
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          YES_ENERGY_USERNAME: ${{ secrets.YES_ENERGY_USERNAME }}
          YES_ENERGY_PASSWORD: ${{ secrets.YES_ENERGY_PASSWORD }}
```

### Option B: Cron Job

Add to your server's crontab:
```bash
0 6 * * * cd /path/to/project && npm run poll-data
```

---

## 🔀 Alternative Data Sources

### Option 1: GOATS Database

If you have TB4 data in GOATS:

1. Create `src/lib/services/goats.ts` (similar to yes-energy.ts)
2. Update poll job to query GOATS
3. Same database structure, different source

Need help? I can build this integration.

### Option 2: CSV Import

Have CSV files with historical data?

```bash
# CSV Format: date,location,market,tb_value
npm run import-csv path/to/data.csv
```

Example CSV:
```csv
date,location,market,tb_value
2025-01-01,NP15,CAISO,125.34
2025-01-01,Houston Hub,ERCOT,95.12
```

### Option 3: Manual Entry

```bash
# Open database GUI
npm run db-studio
```

Add records to `TB4Calculation` and `YTDPerformance` tables.

---

## 🎨 What's Preserved

**Your cards will keep:**
- ✅ Same layout and design
- ✅ Same fields and metrics
- ✅ Same color schemes (blue/red/green)
- ✅ Same animations and interactions
- ✅ Location dropdown
- ✅ All calculations (TB4→revenue, P-values, BOY projections)

**Only changes:**
- Mock data → Live data
- "Last updated" shows real timestamp
- Values update daily

---

## 📊 What Gets Displayed

Each card shows:

| Metric | Description | Source |
|--------|-------------|--------|
| **YTD TB2/TB4** | Year-to-date average | Calculated from daily TB values |
| **P-Value** | Percentile vs forecast | Actual vs forecast distribution |
| **BOY Forecast** | Balance of year projection | Extrapolated from YTD trend |
| **Projected Total** | Full year estimate | YTD weighted + BOY weighted |
| **YoY Change** | vs last year | Historical comparison |
| **With AS** | Including ancillary services | TB4 × market multiplier |

---

## 🛠️ Helpful Commands

```bash
npm run setup          # Interactive setup wizard
npm run setup:env      # Create .env file
npm run poll-data      # Fetch latest Yes Energy data
npm run check-data     # Verify database status
npm run import-csv     # Import from CSV file
npm run test-yes       # Test Yes Energy connection
npm run db-studio      # Open database GUI
npm run dev            # Start dev server
```

---

## 🐛 Troubleshooting

### "No data from database, using mock data"
→ Run `npm run check-data` to verify database has records
→ If empty, run `npm run poll-data`

### "Authentication failed"
→ Check `.env` credentials
→ Verify Yes Energy account is active

### "Database connection error"
→ Check `DATABASE_URL` in `.env`
→ Ensure PostgreSQL is running

### "Cards still show mock data"
→ Check API: `http://localhost:4321/api/market-performance`
→ Look for `"dataSource": "database"`
→ Hard refresh browser (Ctrl+Shift+R)

---

## 📞 Need a Different Data Source?

Let me know if you want to:
- Pull from GOATS instead of Yes Energy
- Import from CSV files
- Connect to a different API
- Use a hybrid approach

I can adapt the integration to your specific data flow!

---

## 🎉 Success Checklist

- [ ] `.env` file created
- [ ] `npm install` completed
- [ ] `npx prisma generate` completed
- [ ] `npx prisma db push` completed
- [ ] `npm run poll-data` completed successfully
- [ ] `npm run check-data` shows records in database
- [ ] API returns `"dataSource": "database"`
- [ ] Cards display live data
- [ ] Layout and design look good ✨

---

**Once all checked, you're live with real data!** 🚀

The cards will automatically refresh every 5 minutes, and you can set up daily polling to keep data fresh.

