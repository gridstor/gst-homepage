# GridStor Analytics - Main Hub

**Production URL:** [https://gridstoranalytics.com](https://gridstoranalytics.com)

A unified analytics platform for battery energy storage market intelligence, integrating multiple specialized tools under one domain with seamless authentication.

---

## 🏗️ Architecture

This is the **main hub** that proxies to specialized sub-applications:

```
gridstoranalytics.com/
├── /                    → Main homepage (this repo)
├── /curve-viewer        → Revenue Forecasts (gridstor.netlify.app)
├── /admin               → Admin Tools (gridstor.netlify.app)
├── /market-ops          → Market Operations (gridstordayzer.netlify.app)
└── /fundamentals        → Market Fundamentals (gst-fundamentals.netlify.app)
```

### How It Works
- **Seamless Proxying:** Netlify redirects (status 200) keep users on `gridstoranalytics.com`
- **Unified Auth:** Shared password protection across all tools
- **Independent Deployments:** Each sub-app deploys independently
- **Single Navigation:** Consistent header across all pages

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.20.8
- npm >= 9.0.0
- PostgreSQL database (optional, if using Prisma)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gst-homepage

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your database URL and other secrets

# Start development server
npm run dev
```

Visit `http://localhost:4321` to view the site.

---

## 📦 Tech Stack

- **[Astro 5.8](https://astro.build)** - Static site generation + SSR
- **[React 18](https://react.dev)** - Interactive components
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Styling with custom GridStor design system
- **[Prisma](https://www.prisma.io)** - Database ORM (optional)
- **[Netlify](https://www.netlify.com)** - Hosting + Edge Functions
- **[Chart.js](https://www.chartjs.org)** - Data visualizations
- **[Recharts](https://recharts.org)** - React charts

---

## 📁 Project Structure

```
gst-homepage/
├── src/
│   ├── components/         # React components
│   │   ├── common/         # Shared components
│   │   ├── ui/             # UI primitives (select, button, etc.)
│   │   ├── MarketAnalyticsCard.tsx
│   │   └── RevenueForcastMap.tsx
│   ├── layouts/            # Astro layouts
│   │   └── Layout.astro    # Main layout with navigation
│   ├── pages/              # Routes (file-based routing)
│   │   ├── index.astro     # Homepage
│   │   ├── docs.astro      # Documentation
│   │   ├── 404.astro       # Error page
│   │   └── api/            # API endpoints
│   ├── lib/                # Utilities and helpers
│   │   └── db.ts           # Prisma client
│   └── styles/
│       └── globals.css     # Global styles
├── public/                 # Static assets
│   ├── GST_logo.svg
│   └── curve-viewer-iframe.html
├── prisma/                 # Database schema
│   └── schema.prisma
├── netlify.toml           # Netlify configuration (CRITICAL!)
├── astro.config.mjs       # Astro configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Dependencies
```

---

## 🔧 Development Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build for production to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Run TypeScript type checking |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |

---

## 🌐 Proxy Configuration

The magic happens in `netlify.toml`. Key redirects:

### Market Ops
```toml
[[redirects]]
  from = "/market-ops"
  to = "https://gridstordayzer.netlify.app/market-ops/"
  status = 200
  force = true
```

### Curve Viewer
```toml
[[redirects]]
  from = "/curve-viewer"
  to = "https://gridstor.netlify.app/curve-viewer/"
  status = 200
  force = true
```

### Fundamentals
```toml
[[redirects]]
  from = "/fundamentals"
  to = "https://gst-fundamentals.netlify.app/fundamentals/"
  status = 200
  force = true
```

**Status 200** = Proxy (URL stays on your domain)  
**Status 301/302** = Redirect (URL changes to target)

---

## 🔐 Environment Variables

### Local Development (`.env`)
```env
# Database (if using Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/gridstor"

# Development
NODE_ENV="development"
```

### Production (Netlify Dashboard)
Set these in: Site Settings > Environment Variables

```env
# Database
DATABASE_URL="your-production-database-url"

# Authentication (optional)
SITE_PASSWORD="your-shared-password"

# Build
NODE_VERSION="22"
```

---

## 🚢 Deployment

### Netlify Setup

1. **Connect Repository**
   - Link your GitHub repo to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Configure Domain**
   - Add custom domain: `gridstoranalytics.com`
   - Enable SSL (automatic with Netlify)

3. **Set Environment Variables**
   - Add `DATABASE_URL` (if using database)
   - Add `SITE_PASSWORD` (if using password protection)

4. **Password Protection** (Optional)
   - Go to Site Settings > Access Control
   - Enable "Password protection"
   - Use same password across all GridStor sites

### Deploy
```bash
# Automatic on git push to main
git push origin main

# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

---

## 🧪 Testing

Currently configured but no tests written. To add tests:

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

Example test structure:
```typescript
// src/components/__tests__/MarketAnalyticsCard.test.tsx
import { render } from '@testing-library/react';
import MarketAnalyticsCard from '../MarketAnalyticsCard';

test('renders market name', () => {
  const { getByText } = render(
    <MarketAnalyticsCard market="CAISO" {...mockProps} />
  );
  expect(getByText('CAISO')).toBeInTheDocument();
});
```

---

## 📖 Documentation

**All documentation is organized in the `/docs` folder:**

👉 **[View Complete Documentation Index](docs/README.md)** 👈

### Quick Links

**Design System:**
- [Complete Design Specification](docs/design-system/DESIGN_SYSTEM_SPECIFICATION.md) ⭐
- [Navigation Bar Specification](docs/design-system/NAVIGATION_BAR_SPEC.md) ⭐

**Deployment:**
- [Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md) ⭐
- [Proxy Setup](docs/deployment/SEAMLESS_PROXY_SETUP.md)

**Troubleshooting:**
- [API Routing Guide](docs/troubleshooting/API_ROUTING_GUIDE.md) ⭐
- [Authentication Troubleshooting](docs/troubleshooting/AUTHENTICATION_TROUBLESHOOTING.md)

**Recent Changes:**
- [Rebranding Summary](docs/recent-updates/REBRANDING_COMPLETE.md) ⭐
- [Recommendations](docs/recent-updates/RECOMMENDATIONS.md) ⭐
- [Complete Changes Log](docs/recent-updates/CHANGES_SUMMARY.md)

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

### Proxy Not Working
1. Check `netlify.toml` syntax
2. Verify target URLs are accessible
3. Clear browser cache
4. Check Netlify deploy logs

### Assets Not Loading
- **Don't hardcode asset hashes** in `netlify.toml`
- Use wildcard patterns: `/_astro/*.css`
- Let Netlify's fallback rules handle dynamic hashes

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Reset database
npx prisma migrate reset

# Generate client
npx prisma generate
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with `npm run dev`
4. Run type checking: `npm run type-check`
5. Submit a pull request

### Code Style
- TypeScript for type safety
- Tailwind CSS for styling (no custom CSS unless necessary)
- Components in `src/components/`
- Follow existing naming conventions

---

## 📊 Sub-Applications

| App | URL | Repository | Purpose |
|-----|-----|------------|---------|
| **Main Hub** | `gridstoranalytics.com` | This repo | Homepage + navigation |
| **Curve Viewer** | `/curve-viewer` | `gridstor` | Revenue forecasting |
| **Admin Tools** | `/admin` | `gridstor` | System administration |
| **Market Ops** | `/market-ops` | `gridstordayzer` | Market operations |
| **Fundamentals** | `/fundamentals` | `gst-fundamentals` | Market fundamentals |

---

## 🔮 Roadmap

- [ ] **Risk Module** - Advanced risk analytics (Coming Soon)
- [ ] **Admin Dashboard** - User management and analytics
- [ ] **Real-time Updates** - WebSocket integration for live data
- [ ] **Mobile App** - Native mobile experience
- [ ] **API Documentation** - Public API for integrations

---

## 📄 License

Proprietary - GridStor Analytics © 2025

---

## 💬 Support

For questions or issues:
- Check documentation files in repo
- Review `RECOMMENDATIONS.md` for common issues
- Contact GridStor team

---

**Last Updated:** October 7, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready