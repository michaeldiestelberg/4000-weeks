# Deployment Guide

This project is configured for automatic deployment with both Netlify and Vercel. Choose the option that works best for you.

## Option 1: Deploy with Netlify (Recommended)

### One-Time Setup:

1. **Connect your GitHub repository to Netlify:**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your `4000-weeks` repository

2. **Netlify will auto-detect the settings** from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Just click "Deploy site"

3. **Automatic Preview Deployments:**
   - Every pull request will automatically get a unique preview URL
   - The preview URL will be posted as a comment on your PR
   - Main branch deploys to production automatically

### That's it!

Once connected, every PR will get an automatic preview URL like:
`https://deploy-preview-123--your-site-name.netlify.app`

---

## Option 2: Deploy with Vercel

### One-Time Setup:

1. **Connect your GitHub repository to Vercel:**
   - Go to https://vercel.com/
   - Click "Add New" → "Project"
   - Import your `4000-weeks` repository
   - Vercel will auto-detect it's a Vite project

2. **Vercel will auto-configure** from `vercel.json`:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Click "Deploy"

3. **Automatic Preview Deployments:**
   - Every pull request automatically gets a preview URL
   - Preview URL is posted as a check on your PR
   - Main branch deploys to production automatically

### That's it!

Once connected, every PR will get an automatic preview URL like:
`https://4000-weeks-git-branch-name.vercel.app`

---

## Features Included in Deployment:

- Progressive Web App (PWA) support
- Service Worker for offline functionality
- Custom favicon and app icons
- Responsive design
- Bilingual support (English/German)

## Manual Deployment:

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# The dist/ folder is ready to deploy to any static hosting service
```

You can deploy the `dist/` folder to:
- GitHub Pages
- AWS S3
- Firebase Hosting
- Cloudflare Pages
- Or any static hosting service
