# Migrating Yes Energy Integration from Python to TypeScript

Based on your Python implementation in the Modeling Proving Ground project.

---

## 🔍 What I Found in Your Python Code

Your `YESEnergyClient` uses:
- **Auth**: Username/password from `credentials.yml`
- **Methods**: `fetch_lmp_data(zone_id, start_date, end_date)`
- **Config**: Zone IDs stored as `yes_energy_id` in parameters
- **Output**: Pandas DataFrame with columns: `[timestamp, value, product, zone]`

---

## ✅ What I've Already Adapted

I've updated the TypeScript service (`src/lib/services/yes-energy.ts`) to match your Python client's pattern:

1. ✅ **Authentication**: Username/password based (lines 101-128)
2. ✅ **Fetch LMP**: Similar to your `fetch_lmp_data()` method (lines 139-182)
3. ✅ **Data transformation**: Matches your DataFrame structure (lines 204-226)

---

## 📝 What You Need to Provide

### 1. **Yes Energy Credentials**

From your `conf/local/credentials.yml` file:

```yaml
yes_energy:
  username: "your_username"
  password: "your_password"
```

**Add to `.env` file:**
```bash
YES_ENERGY_USERNAME="your_username_here"
YES_ENERGY_PASSWORD="your_password_here"
YES_ENERGY_BASE_URL="https://services.yesenergy.com"  # or whatever base URL you use
```

### 2. **Zone IDs (yes_energy_id values)**

From your parameters file (likely `conf/base/parameters.yml`), find the section that looks like:

```yaml
markets:
  caiso:
    products:
      - name: "NP15"
        type: "lmp"
        yes_energy_id: "12345"  # ← Need this!
        zone: "NP15"
      
      - name: "SP15"
        type: "lmp"
        yes_energy_id: "67890"  # ← Need this!
        zone: "SP15"
```

**I need the `yes_energy_id` for these 9 locations:**

#### CAISO:
- [ ] NP15: `yes_energy_id = ?`
- [ ] SP15: `yes_energy_id = ?`
- [ ] Goleta: `yes_energy_id = ?`

#### ERCOT:
- [ ] Houston Hub: `yes_energy_id = ?`
- [ ] Hidden Lakes: `yes_energy_id = ?`
- [ ] Gunnar: `yes_energy_id = ?`
- [ ] South Hub: `yes_energy_id = ?`

#### SPP:
- [ ] North Hub: `yes_energy_id = ?`
- [ ] South Hub: `yes_energy_id = ?`

### 3. **Yes Energy API Details**

I need to know the actual endpoints your Python `YESEnergyClient` uses. Can you share:

**From `gst_forecast/utils/api_client.py`:**
- What's the base URL?
- What endpoint does `fetch_lmp_data()` call?
- What parameters does it use?
- What does the response look like?

**Example questions:**
```python
# In your YESEnergyClient class:
def fetch_lmp_data(self, zone_id, start_date, end_date):
    # What URL does this hit?
    url = f"{self.base_url}/???"  # ← What goes here?
    
    # What parameters?
    params = {
        "zone_id": zone_id,  # or "objectid"? or "zoneid"?
        # What else?
    }
```

---

## 🚀 Quick Test Script

Once you provide the above, we can test with this script:

```bash
# 1. Add credentials to .env
echo "YES_ENERGY_USERNAME=your_username" >> .env
echo "YES_ENERGY_PASSWORD=your_password" >> .env

# 2. Update zone IDs in src/lib/services/yes-energy.ts

# 3. Test fetch
npx ts-node -e "
import { yesEnergyService } from './src/lib/services/yes-energy';

const startDate = new Date('2025-10-01');
const endDate = new Date('2025-10-07');
const nodeId = 'YOUR_NP15_ZONE_ID';

yesEnergyService.fetchDayAheadLMP(nodeId, startDate, endDate)
  .then(data => {
    console.log('Success! Fetched', data.length, 'records');
    console.log('Sample:', data[0]);
  })
  .catch(err => console.error('Error:', err));
"
```

---

## 🔄 Alternative: Python Bridge (If Easier)

If it's easier, we can create a Python script that:
1. Uses your existing `YESEnergyClient`
2. Fetches data and calculates TB4
3. Writes directly to our database
4. Gets called by Node.js scheduled job

Would take 30 minutes to set up. Let me know if you prefer this approach!

---

## 📋 Next Steps

**Right now, please share:**

1. **Credentials file** (or just username - I'll help you add it securely)
2. **Parameters file** with the `yes_energy_id` values
3. **API client code** (`gst_forecast/utils/api_client.py`) so I can see the exact API calls

Once I have these, I can:
- Update the service with correct endpoints
- Add your zone IDs
- Test a single location
- Deploy the scheduled job

**Estimated time to go live: 1-2 hours after you provide these details!**

