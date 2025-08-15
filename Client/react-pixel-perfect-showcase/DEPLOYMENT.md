# Deployment Instructions

## Vercel Deployment (Frontend Only)

This project is configured to deploy only the React frontend to Vercel.

### Steps to Deploy:

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import this repository
   - **Important:** Set the root directory to `Client/react-pixel-perfect-showcase`

2. **Vercel Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `Client/react-pixel-perfect-showcase`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

3. **Environment Variables:**
   - No environment variables needed for frontend-only deployment
   - API calls are made to external endpoint: `https://dev-landing-ngab.vercel.app`

### Project Structure:
```
Client/react-pixel-perfect-showcase/
├── src/
├── public/
├── package.json
├── vite.config.ts
├── vercel.json (SPA routing config)
└── dist/ (build output)
```

### Features:
- ✅ React + TypeScript + Vite
- ✅ Tailwind CSS + shadcn/ui
- ✅ Client-side routing
- ✅ Theme switching (light/dark)
- ✅ Responsive design
- ✅ External API integration