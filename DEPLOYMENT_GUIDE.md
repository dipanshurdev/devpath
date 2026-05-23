# DevPath Deployment Guide: Netlify + Appwrite → Node.js + Prisma

## Pre-Deployment Checklist

### 1. Fix Remaining Issues (15 minutes)
```bash
# Regenerate Prisma client
npm run prisma:generate

# Type check
npm run type-check

# Build test
npm run build
```

### 2. Create Production Environment File
```bash
cp .env.example .env.production.local
```

Fill in required values:
```
# MongoDB Atlas (Cloud Database)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/devpath?retryWrites=true&w=majority"

# Generate secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Optional: GitHub OAuth  
GITHUB_ID="..."
GITHUB_SECRET="..."

# Optional: Redis (for caching)
REDIS_URL="redis://user:password@host:port"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

---

## Database Setup

### MongoDB Atlas (Recommended)

#### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas)
2. Sign up (free tier available)
3. Create new organization and project

#### Step 2: Create Cluster
1. Choose "Build a Database" → M0 Free Tier
2. Select provider (AWS/Google Cloud/Azure) + region close to you
3. Wait 3-5 minutes for cluster creation

#### Step 3: Security Setup
```
Network Access → Add IP Address:
- Select "Allow Access from Anywhere" (0.0.0.0/0)
- Or whitelist your deployment server's IP

Database Access → Add Database User:
- Username: devpath_user
- Password: [generate strong password]
- Set built-in role: "Atlas admin"
```

#### Step 4: Get Connection String
1. Click "Connect" on your cluster
2. Select "Drivers"
3. Copy connection string → Replace in DATABASE_URL
```
mongodb+srv://devpath_user:PASSWORD@cluster.mongodb.net/devpath?retryWrites=true&w=majority
```

#### Step 5: Create Database
```bash
# First time only - creates database and initializes schema
npx prisma db push
```

#### Step 6: Seed Sample Data
```bash
npm run db:seed
```

---

## Deployment Platform Options

### Option A: Vercel (Easiest for Next.js)

**Pros**: Free tier, automatic deployments, global CDN, serverless  
**Cons**: Paid plan for production, cold starts, limited free tier  

#### Setup:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Configure in Vercel Dashboard:**
1. Settings → Environment Variables
2. Add all variables from `.env.production.local`
3. Set to "Production"

**Important**: Vercel is serverless - ensure MongoDB connections are pooled:
```javascript
// lib/prisma/client.ts
const prisma = new PrismaClient({
  log: ['warn'],
})
```

### Option B: Railway (Recommended - $5/month)

**Pros**: Easy deploy, affordable, good free tier, handles Node.js well  
**Cons**: Smaller platform, smaller community  

#### Setup:
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository

**Database Setup in Railway:**
1. Create PostgreSQL or MongoDB service
2. Connect to your app
3. Railway auto-injects `DATABASE_URL`

**App Configuration:**
1. Set start command:
```
npm run build && npm run start
```

2. Set environment variables in Railway dashboard
3. Set port: `$PORT` (Railway provides this)
4. Deploy

### Option C: Render (Good Free Tier)

**Pros**: Free tier available, generous limits, simple setup  
**Cons**: Free tier sleeps after 15 min inactivity  

#### Setup:
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your repository

**Configuration:**
```
Build Command: npm run build
Start Command: npm run start
Environment: Node
```

**Add Environment Variables:**
- Add all from `.env.production.local`
- Render auto-provides `PORT`

**Connect MongoDB:**
- Use MongoDB Atlas (setup above)
- Add DATABASE_URL to environment variables

### Option D: DigitalOcean App Platform

**Pros**: Straightforward, good pricing, reliable  
**Cons**: Not completely free, more setup  

#### Setup:
1. Go to [digitalocean.com/products/app-platform](https://www.digitalocean.com/products/app-platform)
2. Click "Create App" → Select GitHub repo
3. Configure build settings:

```
Build command: npm run build
Run command: npm run start
```

**Environment Variables:**
- Add all from `.env.production.local`

**Database:**
- DigitalOcean managed MongoDB or use MongoDB Atlas

---

## Step-by-Step Deployment Instructions

### For Railway (Recommended for First-Time):

**1. Prepare Your Code**
```bash
# Make sure everything is committed
git status
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

**2. Create Railway Project**
- Visit railway.app
- Click "New Project" → "Deploy from GitHub repo"
- Authorize GitHub → Select your repository
- Click "Deploy Now"

**3. Wait for Build** (2-3 minutes)
- Railway starts building your app
- Check build logs in "Build" tab
- Monitor for errors

**4. Add Environment Variables**
- Go to "Variables" tab
- Click "New Variable"
- Add each variable from `.env.production.local`:
  - DATABASE_URL
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL (use railway domain)
  - All OAuth keys
  - etc.

**5. Add Custom Domain**
- Go to "Settings"
- Under "Domains", click "Add"
- Add your domain
- Update DNS records (Railway provides instructions)

**6. Initialize Database**
- SSH into Railway instance:
```bash
railway shell
npm run setup:prisma
npm run db:seed
```

Or via Railway CLI:
```bash
railway run npm run setup:prisma
railway run npm run db:seed
```

**7. Test Your App**
- Visit your Railway domain
- Sign up for account
- Test OAuth login (Google/GitHub)
- Check dashboard functionality

---

## Post-Deployment Tasks

### 1. SSL Certificate
- Vercel: Automatic ✓
- Railway: Automatic ✓
- Render: Automatic ✓
- DO App Platform: Automatic ✓

### 2. Enable HTTPS Redirect
In `next.config.mjs`, add to headers:
```javascript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=31536000; includeSubDomains',
}
```

### 3. Update OAuth Redirect URIs
- **Google Cloud Console**:
  - Authorized redirect URIs: `https://your-domain.com/api/auth/callback/google`
  
- **GitHub OAuth App**:
  - Authorization callback URL: `https://your-domain.com/api/auth/callback/github`

### 4. Set Up Monitoring
```bash
# Add error tracking (optional)
npm install sentry-nextjs

# Configure in next.config.mjs
```

### 5. Configure Backup Strategy
For MongoDB Atlas:
1. Settings → Backup & Restore
2. Enable automatic backups
3. Set daily backup frequency
4. Enable point-in-time recovery

### 6. Set Up Logging
```bash
# Enable verbose logging for debugging
# In production environment, set:
NODE_DEBUG="*"
LOG_LEVEL="info"
```

---

## Migrating from Appwrite (If you still have data)

### Export Data from Appwrite
```bash
# Use Appwrite SDK to export collections
npm install appwrite

# Create export script:
# scripts/export-from-appwrite.ts
```

### Import to MongoDB
```bash
# Use existing script
npm run db:import -- --source appwrite

# Or manually:
# 1. Export from Appwrite as JSON
# 2. Transform to MongoDB format
# 3. Import via MongoDB Compass or mongoimport CLI
```

---

## Troubleshooting

### Build Fails
```bash
# Check Node version (need 18+)
node --version

# Clear cache
rm -rf .next
rm -rf node_modules
npm ci
npm run build
```

### Database Connection Errors
```bash
# Check DATABASE_URL format
# Verify MongoDB Atlas whitelist includes deployment IP
# Test connection locally
npm run prisma:studio
```

### Environment Variables Not Loading
- Verify variables in deployment platform dashboard
- Use correct naming (case-sensitive)
- Restart the application after adding variables

### Memory Issues
```bash
# Increase Node memory for builds
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Slow First Request (Cold Start)
- Normal for serverless (Vercel, Render free tier)
- Solution: Use paid tier or always-on instance (Railway, DO)

---

## Cost Estimation

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| **Vercel** | Limited | $20+/month |
| **Railway** | $5 credit/month | $5/month + usage |
| **Render** | Sleeps after 15min | $7+/month |
| **DigitalOcean** | None | $5/month starter |
| **MongoDB Atlas** | 512MB free | $0.10/GB beyond free |

**Recommended Setup**: Railway ($5/month) + MongoDB Atlas (free)  
**Total Monthly Cost**: ~$5

---

## Rollback Plan

If deployment fails:
```bash
# For GitHub-integrated deployments:
# 1. Go to deployment platform dashboard
# 2. Find previous working deployment
# 3. Click "Redeploy" or "Rollback"

# Alternative: Git rollback
git revert <commit-hash>
git push origin main
# Platform auto-redeploys
```

---

## Performance Optimization

After deployment, monitor:

1. **Core Web Vitals**
   - Use Vercel Analytics or Google Analytics
   - Target: LCP < 2.5s, FID < 100ms, CLS < 0.1

2. **Database Performance**
   - MongoDB Atlas: Monitoring tab
   - Check slow queries, connection pool

3. **API Response Times**
   - Use browser DevTools Network tab
   - Monitor server response times

4. **Enable Caching**
```bash
# If using Redis
REDIS_URL="redis://..." npm start
```

---

## Next Steps

1. **Choose Platform**: Railway recommended for easiest setup
2. **Setup Database**: MongoDB Atlas (15 min)
3. **Deploy**: Follow platform-specific steps (30 min)
4. **Test**: Verify all features work (30 min)
5. **Monitor**: Set up logging and alerts
6. **Scale**: Add Redis caching if needed

**Total Time to Production**: ~2-3 hours

---

## Support Resources

- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma Production: https://www.prisma.io/docs/guides/deployment
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Railway Docs: https://docs.railway.app/
- NextAuth Security: https://next-auth.js.org/getting-started/example
