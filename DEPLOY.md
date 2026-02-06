# Calgary Best - Deployment Guide

## Quick Deploy to Vercel

### 1. Push to GitHub

```bash
cd calgary-best
git init
git add .
git commit -m "Initial commit: Calgary Best city guide"
gh repo create calgary-best --public --push --source=.
```

### 2. Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project (e.g., "calgary-best")
3. Copy the connection string (looks like `postgresql://user:pass@host/db?sslmode=require`)

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. In the deployment settings, add the environment variable:
   - `DATABASE_URL` = your Neon connection string
3. Click **Deploy**

### 4. Seed the Database

After deployment, visit:
```
https://your-site.vercel.app/api/seed
```

This creates all tables and populates them with placeholder articles.

### 5. You're Live!

- **Homepage**: `https://your-site.vercel.app`
- **Admin Panel**: `https://your-site.vercel.app/admin`
- **Search**: `https://your-site.vercel.app/search`

## Local Development

```bash
npm install
cp .env.example .env
# Edit .env with your Neon DATABASE_URL
npm run dev
```

Then seed: `http://localhost:3000/api/seed`

## Tech Stack

- **Framework**: Next.js 16 + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Neon (Vercel Postgres compatible)
- **Fonts**: Playfair Display + Inter (Google Fonts)
- **Icons**: Material Symbols Outlined
