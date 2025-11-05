# 🚀 Run This Now to Populate Your Cards!

## Step 1: Create .env File

Create a file named `.env` in the project root with this exact content:

```bash
# Analytics Database (your existing database)
DATABASE_URL="postgresql://brett_rudder:XYGyCEdpGqehNPn@gridstor-dev.cxoowsyptaww.us-east-2.rds.amazonaws.com:5432/analytics_workspace?sslmode=require"

# Yes Energy Credentials
YES_ENERGY_USERNAME="brett.rudder@gridstor.com"
YES_ENERGY_PASSWORD="commonFibre!2"
YES_ENERGY_BASE_URL="https://services.yesenergy.com/PS/rest"
```

## Step 2: Run Setup (One Command!)

```bash
npm run setup:production
```

This will automatically:
1. ✅ Generate Prisma client
2. ✅ Create 5 new tables in your analytics database (Location, TB4Calculation, YTDPerformance, Forecast, LMPData)
3. ✅ Seed 8 locations (CAISO, ERCOT, SPP)
4. ✅ Fetch YTD 2025 data from Yes Energy (~2 minutes)
5. ✅ Verify data was populated

## Step 3: View Live Data

```bash
npm run dev
```

Then open `http://localhost:4321` and scroll to **Market Performance Overview**!

---

## That's It!

Your cards will automatically:
- Show live TB2/TB4 data from Yes Energy
- Keep the same beautiful design
- Calculate all metrics in real-time
- Update every 5 minutes

---

## Alternative: Manual Steps

If the automated script has issues, run each step manually:

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Create tables
npx prisma db push

# 3. Seed locations
npm run seed-locations

# 4. Fetch Yes Energy data
npm run poll-data

# 5. Verify
npm run check-data
```

---

## Verify It's Working

### Check API Data Source
Open: `http://localhost:4321/api/market-performance`

Look for:
```json
{
  "success": true,
  "data": [...],
  "metadata": {
    "dataSource": "database"  // ← Should say "database" not "mock"
  }
}
```

### Check Database
```bash
npm run check-data
```

Should show:
- 8 locations
- ~2,400 TB4Calculation records
- 8 YTDPerformance records

---

## Troubleshooting

### "Permission denied to create tables"
Your database user needs CREATE TABLE privileges. Contact your DBA or run:
```sql
GRANT CREATE ON DATABASE analytics_workspace TO brett_rudder;
```

### "Yes Energy authentication failed"
Double-check the credentials in `.env` match exactly

### "Connection refused"
Make sure you can reach the database from your machine

---

**Ready? Create that .env file and run:** `npm run setup:production` 🚀

