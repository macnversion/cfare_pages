<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1_o3EomZZoicEJUlvSC9DFMlmkHDyFcQr

## Run Locally

**Prerequisites:**  Node.js 20+

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
3. Open http://localhost:3000 in your browser

## Deploy to Cloudflare Pages

### Automatic Deployment (Git Integration)

1. Push your code to GitHub
2. Go to Cloudflare Dashboard → Workers & Pages → Create application
3. Select Pages → Connect to Git
4. Select your repository
5. Configure build settings:
   - **Project name**: `billiards-soccer`
   - **Production branch**: `main`
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `billiards-soccer`
6. Click **Save and Deploy**

### Manual Deployment (Direct Upload)

```bash
npm install
npm run build
npx wrangler pages deploy ./dist --project-name=billiards-soccer
```

### Environment Variables

This app currently has no required environment variables. To add environment variables in the future:

1. Create `.env.local` with variables prefixed with `VITE_`
2. Access via `import.meta.env.VITE_VARIABLE_NAME`
3. Add variables in Cloudflare Pages dashboard under Settings > Environment Variables

## Build Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
