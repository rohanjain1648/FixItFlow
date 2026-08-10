# 🌐 FixItFlow — Deployment Guide & Step-by-Step Instructions

This document provides complete, step-by-step deployment instructions for **FixItFlow** across multiple hosting platforms: **Vercel** (Cloud Platform), **Docker** (Containerized), and **Self-Hosted VPS** (PM2 + NGINX).

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have the following ready:

- [x] Node.js ≥ 18.x and `npm` installed
- [x] CALL-E CLI installed (`npm install -g @call-e/cli`)
- [x] Authenticated CALL-E session (`calle auth status`)
- [x] Configured environment variables (see below)

---

## 🔑 Environment Variables Setup

Create a `.env` or set environment variables in your hosting provider console:

```env
# Database Connection (SQLite default)
DATABASE_URL="file:./dev.db"

# CALL-E Telephony Configuration
CALLE_SOURCE="skills_sh"
CALLE_INTEGRATION="skills_sh_skill"
CALLE_INTEGRATION_VERSION="0.1.0"

# Public Application URL
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

---

## ☁️ Option 1: Deploy to Vercel (Recommended)

Vercel is the optimal cloud platform for Next.js 16 App Router.

### Step 1: Push Repository to GitHub
Ensure your latest code is pushed to your GitHub repository:
```bash
git add .
git commit -m "prep: deployment readiness"
git push origin main
```

### Step 2: Import Project in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Click **"Import"** next to your `FixItFlow` GitHub repository.

### Step 3: Configure Project Settings
- **Framework Preset:** `Next.js`
- **Root Directory:** `./`
- **Build Command:** `npx prisma generate && next build`
- **Output Directory:** `.next`

### Step 4: Add Environment Variables
In the Vercel project configuration screen, add the following under **Environment Variables**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `file:./dev.db` (or Turso/LibSQL URL for hosted DB) |
| `CALLE_SOURCE` | `skills_sh` |
| `CALLE_INTEGRATION` | `skills_sh_skill` |
| `CALLE_INTEGRATION_VERSION` | `0.1.0` |
| `NEXT_PUBLIC_APP_URL` | `https://your-vercel-app.vercel.app` |

### Step 5: Deploy
Click **"Deploy"**. Vercel will build the Next.js application, generate Prisma Client types, and deploy to a global CDN edge network.

---

## 🐳 Option 2: Deploy with Docker & Docker Compose

Docker deployment packages the entire Next.js app, Node 20 runtime, Prisma ORM, and SQLite database into a single container.

### Step 1: Build Docker Image
```bash
docker build -t fixitflow:latest .
```

### Step 2: Run Container Locally
```bash
docker run -d \
  --name fixitflow \
  -p 3000:3000 \
  -e DATABASE_URL="file:./dev.db" \
  -e CALLE_SOURCE="skills_sh" \
  -e CALLE_INTEGRATION="skills_sh_skill" \
  -e CALLE_INTEGRATION_VERSION="0.1.0" \
  -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  fixitflow:latest
```

### Step 3: Or Run with Docker Compose
```bash
docker-compose up -d --build
```

Verify deployment:
```bash
docker ps
# Open http://localhost:3000 in browser
```

---

## 🖥️ Option 3: Self-Hosted VPS (PM2 + NGINX + Certbot)

For hosting on Ubuntu/Debian AWS EC2, DigitalOcean Droplet, or Hetzner VPS.

### Step 1: Server Prerequisites Setup
```bash
# Update server packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 & NGINX
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git certbot python3-certbot-nginx

# Install PM2 globally
sudo npm install -g pm2
```

### Step 2: Clone & Build Repository
```bash
# Clone repo
git clone https://github.com/rohanjain1648/FixItFlow.git /var/www/fixitflow
cd /var/www/fixitflow

# Install packages
npm ci

# Configure environment
cp .env.example .env
nano .env

# Migrate & seed database
npx prisma db push
npx tsx prisma/seed.ts

# Build Next.js app
npm run build
```

### Step 3: Start Application with PM2
```bash
pm2 start npm --name "fixitflow" -- run start
pm2 save
pm2 startup
```

### Step 4: Configure NGINX Reverse Proxy
Create `/etc/nginx/sites-available/fixitflow`:
```nginx
server {
    listen 80;
    server_name fixitflow.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site & restart NGINX:
```bash
sudo ln -s /etc/nginx/sites-available/fixitflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Enable SSL (HTTPS)
```bash
sudo certbot --nginx -d fixitflow.yourdomain.com
```

---

## 🧪 Post-Deployment Verification

After completing deployment, verify all services:

1. **Dashboard Home:** Visit `https://your-domain/` — metric cards and seed tickets should load.
2. **Tenant Portal:** Visit `https://your-domain/submit` — test submitting a new repair ticket.
3. **API Health Check:** Test `GET /api/tickets` and verify JSON payload returns status `200 OK`.
4. **CALL-E Telephony Check:** Trigger a ticket dispatch and inspect the live call log timeline.
5. **ICS Download Check:** Click the `.ics` button on a confirmed appointment to download calendar event file.

---

<p align="center">
  <strong>FixItFlow Telephony Dispatch Engine • Built with ☎️ CALL-E</strong>
</p>
