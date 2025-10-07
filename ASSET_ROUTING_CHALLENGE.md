# Asset Routing Challenge & Solution

## 🔴 The Problem

When proxying multiple Astro sites through one domain, all apps generate assets at the same path: `/_astro/*`

### What Happens:
```
User visits: /curve-viewer
HTML from: gridstor.netlify.app
HTML contains: <script src="/_astro/client.q1RZUN4J.js">

Browser requests: gridstoranalytics.com/_astro/client.q1RZUN4J.js
Question: Which origin should this come from?
- gridstor.netlify.app? ✅ (correct)
- gridstordayzer.netlify.app? ❌
- gst-fundamentals.netlify.app? ❌
```

**The Challenge:** Netlify redirects are stateless - they can't remember which page the user came from!

---

## 🎯 Current Solution (Pattern Matching)

We use **filename patterns** to route assets to the correct origin:

### Curve Viewer Specific
```toml
/_astro/*CurveViewer*.js → gridstor.netlify.app
/_astro/*api-health*.css → gridstor.netlify.app
/_astro/*api-client*.js  → gridstor.netlify.app
/_astro/client*.js       → gridstor.netlify.app
```

### Market Ops Specific
```toml
/_astro/*MECOverview*.js → gridstordayzer.netlify.app
```

### Fundamentals Specific
```toml
/_astro/*Navbar*.js → gst-fundamentals.netlify.app
```

### Fallback (Default)
```toml
/_astro/* → gridstor.netlify.app (force = true)
```

---

## ⚠️ Current Trade-off

**Default = Gridstor:** Any asset that doesn't match a specific pattern goes to gridstor.

**Why:** Curve Viewer is currently the most critical to fix (was completely broken).

**Risk:** If Market Ops or Fundamentals need generic assets (like `index.abc123.js`), they'll get gridstor's version instead.

---

## ✅ How to Fix Asset Conflicts

### If Market Ops has asset issues:

1. **Identify the failing asset** from browser console
   ```
   Example: /_astro/index.B9qVpYRV.js 404
   ```

2. **Add a specific pattern** in `netlify.toml` (BEFORE the general fallback)
   ```toml
   [[redirects]]
     from = "/_astro/*index*.js"
     to = "https://gridstordayzer.netlify.app/_astro/:splat"
     status = 200
     force = true
   ```

3. **Or add a component-specific pattern**
   ```toml
   [[redirects]]
     from = "/_astro/*MarketOps*.js"
     to = "https://gridstordayzer.netlify.app/_astro/:splat"
     status = 200
     force = true
   ```

### If Fundamentals has asset issues:

Same process, but target `gst-fundamentals.netlify.app`

---

## 🏆 Better Long-term Solutions

### Option 1: Path Prefixes (BEST)
Modify each sub-app to output assets with path prefixes:

**Curve Viewer:**
```
/curve-viewer/_astro/client.abc.js
```

**Market Ops:**
```
/market-ops/_astro/client.abc.js
```

**How:**
- Configure Astro build base path: `base: '/curve-viewer'`
- Update proxy rules to preserve full paths
- No more conflicts! ✅

### Option 2: Subdomain Strategy
```
curve-viewer.gridstoranalytics.com → gridstor.netlify.app
market-ops.gridstoranalytics.com   → gridstordayzer.netlify.app
fundamentals.gridstoranalytics.com → gst-fundamentals.netlify.app
```

**Pros:**
- Clear separation
- No asset conflicts
- Each app is independent

**Cons:**
- Changes user-facing URLs
- Requires DNS configuration
- More complex setup

### Option 3: Unique Asset Names
Ensure each app uses unique identifiers in filenames:

**Curve Viewer:** `client.gridstor.abc.js`  
**Market Ops:** `client.dayzer.abc.js`

**How:**
- Custom Astro plugin to modify asset names
- More reliable pattern matching

---

## 📊 Current Status

| App | Asset Routing | Status |
|-----|--------------|--------|
| **Curve Viewer** | Specific patterns + fallback | ✅ Should work |
| **Market Ops** | MECOverview pattern only | ⚠️ Watch for issues |
| **Fundamentals** | Navbar pattern only | ⚠️ Watch for issues |
| **Main Hub** | Own assets in /dist | ✅ No conflicts |

---

## 🔍 Debugging Asset Issues

### Step 1: Check Browser Console
Look for 404 errors or MIME type mismatches:
```
GET /_astro/example.js 404 (Not Found)
Refused to apply style... MIME type ('text/html')
```

### Step 2: Identify the Asset
Note the exact filename and pattern:
```
/_astro/client.q1RZUN4J.js
         ^^^^^^ component name
                ^^^^^^^^ hash
```

### Step 3: Find Which App Needs It
- Check which page you're on (/curve-viewer, /market-ops, etc.)
- That's the app that generated the asset

### Step 4: Add a Pattern Rule
In `netlify.toml`, add BEFORE the general fallback:
```toml
[[redirects]]
  from = "/_astro/*[pattern]*.js"
  to = "https://[correct-origin]/_astro/:splat"
  status = 200
  force = true
```

### Step 5: Deploy & Test
```bash
git add netlify.toml
git commit -m "Fix asset routing for [component]"
git push origin main
```

---

## 🎯 Recommended Actions

### Immediate (if issues arise)
- [ ] Monitor browser console for 404s on each page
- [ ] Add specific patterns as needed
- [ ] Document any new patterns added

### Short-term (this month)
- [ ] Test all three apps thoroughly
- [ ] Collect list of all asset filenames used
- [ ] Create comprehensive pattern rules

### Long-term (next quarter)
- [ ] Implement path prefixes in each sub-app
- [ ] Or migrate to subdomain strategy
- [ ] Eliminate pattern-based routing

---

## 📝 Pattern Rule Template

When you need to add a new pattern:

```toml
# [App Name] - [Component Name]
[[redirects]]
  from = "/_astro/*[pattern]*.{js,css}"
  to = "https://[origin]/_astro/:splat"
  status = 200
  force = true
```

**Place this BEFORE line 104** (the general fallback) in `netlify.toml`.

---

## 🤔 Why This Happens

Astro's build process:
1. Builds each app independently
2. Generates assets with content-based hashes
3. All apps output to `/_astro/[filename].[hash].{js,css}`
4. No namespace or prefix by default

When proxying multiple apps:
- They share the same URL space
- Assets collide on `/_astro/*`
- Need disambiguation logic

**This is a known limitation of multi-app proxying without path prefixes.**

---

## 📞 Need Help?

1. Check browser console for exact error
2. Review this document for solution
3. Add specific pattern rule
4. If stuck, consider long-term solutions

**Current configuration prioritizes Curve Viewer working correctly.**
