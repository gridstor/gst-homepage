# GridStor Analytics - Deployment Guide

## Overview
This is the main homepage for GridStor Analytics that acts as a central hub for multiple Astro sites deployed on Netlify. It provides seamless navigation between different tools while maintaining password protection.

## Architecture
- **Main Site**: GridStor Analytics homepage (this repository)
- **Curve Viewer**: Proxied from `https://gridstor.netlify.app/curve-viewer`
- **Dayzer**: Proxied from `https://gridstordayzer.netlify.app/`

## Updated Integration Notes
The Dayzer sub-site has been updated to use the new deployment URL and enhanced security configuration with shared authentication across all GridStor platforms.

## Deployment Steps

### 1. Deploy to Netlify
1. Push this repository to GitHub
2. Connect the repository to a new Netlify site
3. Set the custom domain to `gridstoranalytics.com`
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 2. Configure Shared Authentication
1. **Set Environment Variables** in Netlify dashboard:
   - `SITE_PASSWORD=your_secure_password_here`
   - Use the same password across all GridStor sites

2. **Configure Password Protection**:
   - Go to **Site Settings** > **Access Control**
   - Enable **Password Protection**
   - Set the same password as the environment variable
   - Choose protection scope (entire site recommended)

3. **Cookie Configuration** (for custom auth if needed):
   - Cookie name: `site-auth`
   - Settings: `httpOnly`, `secure`, `sameSite: 'strict'`

### 3. Domain Configuration
1. In Netlify DNS settings, add your domain
2. Update DNS records to point to Netlify
3. Enable SSL certificate

### 4. Test Navigation
After deployment, test these URLs:
- `gridstoranalytics.com` - Main homepage
- `gridstoranalytics.com/curve-viewer` - Should proxy to curve viewer site
- `gridstoranalytics.com/dayzer` - Should proxy to dayzer site

## Redirects Configuration
The `netlify.toml` file contains redirects that:
- Route `/curve-viewer/*` to the curve viewer Netlify site
- Route `/dayzer/*` to the dayzer Netlify site (updated URL)
- Preserve the URL structure for seamless navigation
- Include security headers for frame protection

## Expected User Flow

### Public Access (Dayzer)
1. User visits `gridstoranalytics.com`
2. User clicks "Launch Dayzer" button
3. User is redirected directly to `gridstordayzer.netlify.app`
4. **No authentication required** - public access

### Protected Access (Curve Viewer)
1. User visits `gridstoranalytics.com`
2. User clicks "Launch Curve Viewer" button  
3. User is redirected to `gridstor.netlify.app/curve-viewer`
4. User authenticates on the target site if required

### Main Site Authentication
- Main homepage may have password protection
- `/dayzer` paths bypass authentication (public access)
- Other paths may require authentication based on configuration

## Updating Sub-sites
To update the URLs of the sub-sites:
1. Edit the `netlify.toml` file
2. Update the redirect URLs to point to new deployments
3. Redeploy the main site

## Security Features
- Password protection at the main site level
- All sub-sites inherit the same authentication
- Secure proxy routing maintains domain consistency

## Local Development
```bash
npm install
npm run dev
```
Visit `http://localhost:4321` to test locally.

## Tech Stack
- **Astro.js** - Static site generation and server-side rendering
- **React** - Interactive components
- **Tailwind CSS** - Styling
- **Netlify** - Hosting and serverless functions
- **TypeScript** - Type safety

## Troubleshooting

### Redirects Not Working
- Check `netlify.toml` syntax
- Verify target site URLs are accessible
- Check Netlify deployment logs

### Authentication Issues
- Verify password protection is enabled in Netlify dashboard
- Check if authentication covers all routes
- Test in incognito mode

### Build Failures
- Run `npm run type-check` to find TypeScript errors
- Ensure all dependencies are installed
- Check build logs in Netlify dashboard
