# Railway Deployment - Step by Step

## 1️⃣ Database Setup (MongoDB Atlas)

```bash
# 1. Visit: https://mongodb.com/cloud/atlas
# 2. Sign up (Google/GitHub works)
# 3. Create Free cluster (M0)
# 4. Network Access → Add 0.0.0.0/0
# 5. Database Access → Create User:
#    Username: devpath_user
#    Password: [strong password]
# 6. Connect → Drivers → Copy connection string
# 7. Replace in DATABASE_URL below
```

## 2️⃣ Create Production Environment

```bash
# Copy example
cp .env.example .env.production.local

# Edit and add these values:
```

**File: `.env.production.local`**
```
# REQUIRED - Change these!
DATABASE_URL="mongodb+srv://devpath_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/devpath?retryWrites=true&w=majority"
NEXTAUTH_SECRET="openssl rand -base64 32"  # Run: openssl rand -base64 32
NEXTAUTH_URL="https://devpath-xxxx.railway.app"  # Get this after deploying

# OPTIONAL - Add later
# GOOGLE_CLIENT_ID="..."
# GOOGLE_CLIENT_SECRET="..."
# GITHUB_ID="..."
# GITHUB_SECRET="..."
```

**Generate NEXTAUTH_SECRET:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))
```

## 3️⃣ Test Locally

```bash
# This regenerates Prisma (just to be sure)
npm run prisma:generate

# Test production build
npm run build
npm run start
# Visit: http://localhost:3000
# If works, Ctrl+C to stop
```

## 4️⃣ Commit Code

```bash
git add .env.example  # Only the example
git add DEPLOYMENT_GUIDE.md QUICK_DEPLOY.md
git commit -m "chore: add deployment documentation"
git push origin main
```

## 5️⃣ Deploy on Railway

**Visit: https://railway.app**

```
1. Sign up with GitHub (easier)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize → Select your devpath repo
5. Wait for build (2-3 minutes)
   - Watch "Build" tab in dashboard
   - Should show: ✓ Build completed
6. Go to "Variables" tab
7. Add each variable from .env.production.local:
   - DATABASE_URL=...
   - NEXTAUTH_SECRET=...
   - NEXTAUTH_URL= (will be shown in Domains tab)
8. Click "Deploy" (redeploy)
9. Wait 1-2 minutes
10. Check Domains tab for your public URL
11. Visit your URL!
```

## 6️⃣ Initialize Database

**In Railway Dashboard:**

```
1. Go to "Deploy" tab
2. Click three dots → "Open shell"
3. Run:
```

```bash
npm run setup:prisma
npm run db:seed
```

**Or via CLI:**
```bash
# Install Railway CLI: npm install -g @railway/cli
railway login
railway run npm run setup:prisma
railway run npm run db:seed
```

## 7️⃣ Test Deployed App

```
1. Visit your Railway URL
2. Test Sign Up
3. Check Dashboard loads
4. Test navigation
5. Try OAuth (if configured)
```

## 8️⃣ Setup Custom Domain (Optional)

**In Railway Dashboard:**

```
1. Settings tab
2. Under "Domains"
3. "Add Domain"
4. Enter: yourdomain.com
5. Follow DNS setup instructions
6. Wait 5-10 minutes
7. Visit yourdomain.com
```

---

## ❌ If Build Fails

```bash
# Local fix:
npm install
npm run prisma:generate
npm run build

# Then commit and push:
git add .
git commit -m "fix: build dependencies"
git push origin main

# Railway will auto-redeploy
```

## ❌ If App Won't Start

```bash
# Check logs in Railway:
1. Deploy tab → Logs section
2. Look for red error messages
3. Common issues:
   - DATABASE_URL missing/wrong → Check Variables tab
   - NEXTAUTH_SECRET missing → Add it
   - Port issues → Railway sets PORT env var automatically
```

## ❌ If Database Connection Fails

```bash
# MongoDB Atlas checklist:
1. Network Access: Is 0.0.0.0/0 whitelisted?
2. Username/password: Correct in DATABASE_URL?
3. Format: mongodb+srv://user:pass@cluster.mongodb.net/devpath...?
4. Test locally: npm run prisma:generate (should succeed)
```

---

## 📊 Verify Deployment Success

✅ **Checklist:**

- [ ] Railway shows "Build Status: Successful"
- [ ] App URL works in browser
- [ ] Sign-up page loads
- [ ] Can create account
- [ ] Dashboard loads without errors
- [ ] Database queries work (see roadmaps, profiles)

---

## 📝 Quick Commands Reference

```bash
# Local testing
npm run build && npm run start

# Database operations
npm run setup:prisma          # Initialize schema
npm run db:seed              # Add sample data
npm run prisma:studio        # GUI database viewer

# Deployment
git push origin main         # Trigger Railway redeploy

# On Railway (via shell)
npm run setup:prisma         # Setup database
npm run db:seed              # Seed data
npm start                    # Start server
```

---

## 🎯 Expected Timeline

| Step | Time | Status |
|------|------|--------|
| 1. MongoDB Setup | 5 min | Manual |
| 2. Environment | 2 min | Copy-paste |
| 3. Local Test | 5 min | npm run |
| 4. Commit | 1 min | git push |
| 5. Railway Deploy | 5 min | Auto |
| 6. DB Init | 2 min | npm run |
| 7. Test | 5 min | Manual |
| **Total** | **~25 min** | ✅ |

---

## 🆘 Support Links

- Railway Docs: https://docs.railway.app/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Next.js Deployment: https://nextjs.org/docs/deployment/vercel
- NextAuth: https://next-auth.js.org/getting-started/example
- Prisma: https://www.prisma.io/docs/getting-started/setup-prisma

---

**Ready? Let's go! 🚀**

Start with "1️⃣ Database Setup" above.
