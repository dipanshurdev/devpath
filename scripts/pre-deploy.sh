#!/bin/bash
# Pre-deployment verification script
# Run this before deploying to catch issues early

echo "🚀 DevPath Pre-Deployment Checklist"
echo "===================================="
echo ""

# Check Node version
echo "✓ Checking Node version..."
NODE_VERSION=$(node -v)
echo "  Node version: $NODE_VERSION"
if [[ ! "$NODE_VERSION" =~ "v18" ]] && [[ ! "$NODE_VERSION" =~ "v20" ]]; then
  echo "  ⚠️  Warning: Node 18+ recommended"
fi
echo ""

# Check dependencies
echo "✓ Checking dependencies..."
if npm list > /dev/null 2>&1; then
  echo "  ✓ All dependencies installed"
else
  echo "  ⚠️  Missing dependencies - running npm install"
  npm install
fi
echo ""

# Type check
echo "✓ Running type check..."
if npm run type-check; then
  echo "  ✓ TypeScript check passed"
else
  echo "  ⚠️  TypeScript errors found (non-blocking)"
fi
echo ""

# Lint
echo "✓ Running linter..."
if npm run lint 2>/dev/null | head -20; then
  echo "  ✓ Lint passed"
else
  echo "  ℹ️  Lint warnings found (check output above)"
fi
echo ""

# Prisma generate
echo "✓ Generating Prisma client..."
if npm run prisma:generate; then
  echo "  ✓ Prisma client generated"
else
  echo "  ❌ Prisma generation failed"
  exit 1
fi
echo ""

# Build
echo "✓ Building for production..."
if npm run build; then
  echo "  ✓ Build successful"
else
  echo "  ❌ Build failed - fix errors above before deploying"
  exit 1
fi
echo ""

# Environment check
echo "✓ Environment variables check..."
if [ -f ".env.production.local" ]; then
  echo "  ✓ .env.production.local exists"
  REQUIRED_VARS=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
  for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^$var=" .env.production.local; then
      echo "  ✓ $var configured"
    else
      echo "  ⚠️  $var not found"
    fi
  done
else
  echo "  ⚠️  .env.production.local not found - create it before deploying"
fi
echo ""

echo "✅ Pre-deployment checklist complete!"
echo ""
echo "Next steps:"
echo "1. Fix any errors above"
echo "2. Ensure MongoDB Atlas is set up"
echo "3. Configure OAuth apps (Google/GitHub)"
echo "4. Follow DEPLOYMENT_GUIDE.md for platform-specific steps"
echo ""
