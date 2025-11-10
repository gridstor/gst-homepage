# Shared Header - Password Protection Bypass

**Problem:** gst-homepage.netlify.app is password-protected, blocking shared-header.js from loading in other repos.

**Solution:** Serve shared-header.js through a Netlify serverless function that bypasses authentication.

---

## 🏗️ **How It Works**

```
Request: https://gst-homepage.netlify.app/shared-header.js
    ↓
Netlify Redirect (netlify.toml)
    ↓
/.netlify/functions/shared-header
    ↓
Serverless Function (bypasses password)
    ↓
Reads: dist/shared-header.js or public/shared-header.js
    ↓
Returns: File content with CORS headers
    ↓
✅ Other sites can load it!
```

---

## 📂 **Files Involved**

1. **`netlify/functions/shared-header.ts`**
   - Serverless function that serves the file
   - Bypasses password protection
   - Adds CORS headers
   - Returns JavaScript content

2. **`netlify.toml`**
   - Redirects `/shared-header.js` → `/.netlify/functions/shared-header`
   - Sets `force = true` to override password protection
   - Must be FIRST in redirects list (order matters!)

3. **`public/shared-header.js`**
   - Actual navigation component source code
   - Gets copied to `dist/` during build
   - Served by the serverless function

---

## ✅ **Testing**

### **After Deployment:**

1. **Test public access** (no auth required):
   ```bash
   curl https://gst-homepage.netlify.app/shared-header.js
   # Should return JavaScript code, not password prompt
   ```

2. **Test CORS headers:**
   ```bash
   curl -I https://gst-homepage.netlify.app/shared-header.js
   # Should show: Access-Control-Allow-Origin: *
   ```

3. **Test from localhost:**
   ```html
   <script src="https://gst-homepage.netlify.app/shared-header.js"></script>
   <div id="gridstor-header"></div>
   ```
   - Should load without CORS errors
   - Navigation should render

4. **Test from other Netlify sites:**
   - gst-forecast should load it successfully
   - No password prompt
   - No CORS errors

---

## 🔐 **Security Notes**

- ✅ **File is safe to be public** - It contains only navigation HTML/CSS/JS
- ✅ **No sensitive data** - No API keys, credentials, or private info
- ✅ **Read-only** - Function only serves file, doesn't accept input
- ✅ **Cached** - 5-minute cache reduces serverload
- ✅ **CORS restricted to GET** - Only GET and OPTIONS methods allowed

---

## 🛠️ **Troubleshooting**

### **Issue: Still getting password prompt**

**Solution:** Ensure `force = true` in the redirect:
```toml
[[redirects]]
  from = "/shared-header.js"
  to = "/.netlify/functions/shared-header"
  force = true  # ← Must be true!
```

### **Issue: Function returns 404**

**Cause:** File not found in dist/ or public/

**Solution:** Check that build command copies public/ files to dist/

### **Issue: CORS error persists**

**Cause:** Headers not being applied

**Solution:** 
1. Check function returns correct headers
2. Verify function deployed successfully
3. Clear browser cache

---

## 🚀 **Deployment Checklist**

- [ ] `netlify/functions/shared-header.ts` created
- [ ] `netlify.toml` redirect added (force = true)
- [ ] `netlify.toml` redirect is FIRST in list
- [ ] Commit and push changes
- [ ] Netlify build succeeds
- [ ] Function deployed successfully
- [ ] Test URL returns JavaScript (not password page)
- [ ] Test from localhost (no CORS error)
- [ ] Test from other repos

---

## 📝 **Implementation Details**

### **Why Not Just Headers?**

Netlify's password protection applies **before** headers, so adding CORS headers alone doesn't work.

### **Why Serverless Function?**

- Runs **before** password protection layer
- Can serve files with custom headers
- Bypasses authentication automatically
- Works with all Netlify sites

### **Why `force = true`?**

Ensures this redirect takes priority over password protection and other redirects.

---

## 🔄 **Alternative Solutions** (Not Recommended)

### **Option A: Disable Password Protection**
❌ Security risk - exposes entire site

### **Option B: Host on Separate Domain**
❌ Complexity - requires DNS, separate deploy

### **Option C: Copy File to Each Repo**
❌ Defeats purpose - no centralization

### **Option D: Serverless Function** ✅
✅ Secure - only exposes this one file  
✅ Simple - just redirects + function  
✅ Works - bypasses password protection  

---

**Result:** Public, CORS-enabled shared-header.js while keeping site password-protected! 🎉

