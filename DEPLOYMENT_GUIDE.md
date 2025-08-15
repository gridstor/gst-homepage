# GridStor Analytics - Deployment Guide

## Overview
This is the main homepage for GridStor Analytics that acts as a central hub for multiple Astro sites deployed on Netlify. It provides seamless navigation between different tools while maintaining password protection.

## Architecture
- **Main Site**: GridStor Analytics homepage (this repository)
- **Curve Viewer**: Proxied from `https://gridstor.netlify.app/curve-viewer`
- **Dayzer**: Proxied from `https://gridstordayzer.netlify.app/`

## Deployment Steps

### 1. Deploy to Netlify
1. Push this repository to GitHub
2. Connect the repository to a new Netlify site
3. Set the custom domain to `gridstoranalytics.com`
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 2. Configure Password Protection
1. Go to your Netlify site dashboard
2. Navigate to **Site Settings** > **Access Control**
3. Enable **Password Protection**
4. Set a password for site access
5. Choose protection scope (entire site recommended)

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
- Route `/dayzer/*` to the dayzer Netlify site
- Preserve the URL structure for seamless navigation

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
