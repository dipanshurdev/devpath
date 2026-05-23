# 🚀 Quick Deploy Guide - DevPath

## Status: READY FOR PRODUCTION ✅

Your app is production-ready. Build succeeds with no errors.

---

## Fastest Path to Deployment (30 minutes)

### Step 1: Prepare Local (5 min)
```bash
# Create production env file
cp .env.example .env.production.local

# Add these values:
# DATABASE_URL="your-mongodb-url"
# NEXTAUTH_SECRET="openssl rand -base64 32"
# NEXTAUTH_URL="https://your-domain.com"
```

### Step 2: Setup MongoDB Atlas (10 min)
1. Visit [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create M0 free cluster
4. Add user: `devpath_user` with strong password
5. Whitelist all IPs (0.0.0.0/0)
6. Copy connection string → paste in DATABASE_URL
7. Test: `npm run prisma:generate` (should succeed)

### Step 3: Deploy to Railway (15 min)
```bash
# Commit your code
git add .
git commit -m "chore: production deployment"
git push origin main
```

**Then on railway.app:**
1. Click "New Project" → Select your GitHub repo
2. Wait for build (2-3 min) → should succeed
3. Add environment variables (from .env.production.local)
4. Get URL and test it works

---

## Pre-Deploy Checklist

```bash
# ✓ All files committed?
git status

# ✓ Build works?
npm run build  # Already tested ✅

# ✓ Production env ready?
ls -la .env.production.local

# ✓ MongoDB Atlas setup?
# Test with: npm run prisma:generate
```

---

## Platform Comparison

| | **Railway** | **Vercel** | **Render** |
|---|---|---|---|
| **Best For** | First-time Deploy | Team / Scale | Hobby |
| **Cost** | $5/mo | $20+/mo | Free (sleeps) |
| **Setup Time** | 5 min | 3 min | 10 min |
| **Performance** | 🟢 Good | 🟢 Excellent | 🟡 Fair |
| **Database** | MongoDB Atlas | MongoDB Atlas | MongoDB Atlas |

**Recommendation**: Railway ($5/month is worth it for reliability)

---

## OAuth Setup (After Deployment)

### Google OAuth
1. Google Cloud Console → Create OAuth 2.0 credentials
2. Authorized redirect URIs:
   - `https://your-deployed-url.com/api/auth/callback/google`
   - Add to `.env.production.local`:
   ```
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```

### GitHub OAuth
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Authorization callback URL:
   - `https://your-deployed-url.com/api/auth/callback/github`
   - Add to `.env.production.local`:
   ```
   GITHUB_ID="..."
   GITHUB_SECRET="..."
   ```

---

## After Deployment

### 1. Test Critical Features
- [ ] Sign up (with email)
- [ ] Google login
- [ ] GitHub login
- [ ] View roadmaps
- [ ] Create bookmark
- [ ] View profile

### 2. Monitor
- Check error logs
- Monitor response times
- Check database usage

### 3. Custom Domain
- Railway: Add custom domain in Settings
- Update DNS CNAME record
- Wait 5-10 min for SSL

---

## Rollback (If Issues)

```bash
# Revert last commit
git revert HEAD
git push origin main

# Platform auto-redeploys with previous version
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check Node 18+, run `npm install` locally, test `npm run build` |
| DB connection error | Verify DATABASE_URL in deployment platform, check MongoDB Atlas whitelist |
| OAuth not working | Update redirect URIs to match deployment domain |
| App runs locally but fails deployed | Check all environment variables are set in platform |

---

## From Appwrite → MongoDB + Prisma

**Migration done!** Your app now uses:
- ✅ MongoDB (managed, scalable)
- ✅ Prisma ORM (type-safe, fast)
- ✅ NextAuth (proven auth system)
- ✅ Production ready

**No code changes needed** - just environment variables + database setup.

---

## Next Commands

```bash
# Deploy to Railway
vercel deploy  # Or use Railway dashboard

# Monitor logs
railway logs -f

# SSH into prod
railway shell

# Initialize database (one-time)
npm run setup:prisma
npm run db:seed
```

---

**Estimated Time**: 30-45 minutes total  
**Cost**: ~$5/month (Railway + MongoDB free tier)  
**Complexity**: Easy (follow steps 1-3 above)

Need help? Check `DEPLOYMENT_GUIDE.md` for detailed instructions.
