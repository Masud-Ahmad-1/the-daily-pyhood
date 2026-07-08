#!/bin/bash
# =============================================
# THE DAILY PYHOOD — cPanel ডেপ্লয়মেন্ট স্ক্রিপ্ট
# =============================================
# ব্যবহার: chmod +x scripts/deploy.sh && bash scripts/deploy.sh
#
# এই স্ক্রিপ্ট:
# 1. প্রোডাকশন বিল্ড করে
# 2. cPanel-এ আপলোডের জন্য zip প্যাকেজ তৈরি করে
# =============================================

set -e

# কালার
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} The Daily Pyhood - Deploy Script${NC}"
echo -e "${GREEN} cPanel Deployment Package Builder${NC}"
echo -e "${GREEN}========================================${NC}"

# ডিরেক্টরি চেক
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# --- Step 1: Lint ---
echo -e "\n${YELLOW}[1/5] Lint check...${NC}"
npx next lint 2>&1 | tail -3
echo -e "${GREEN}  Lint passed${NC}"

# --- Step 2: Prisma Generate ---
echo -e "\n${YELLOW}[2/5] Prisma Client generate...${NC}"
npx prisma generate
echo -e "${GREEN}  Prisma Client ready${NC}"

# --- Step 3: Next.js Build ---
echo -e "\n${YELLOW}[3/5] Next.js production build...${NC}"
NODE_ENV=production npx next build

# স্ট্যাটিক ফাইল কপি
echo -e "${YELLOW}  Copying static files...${NC}"
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
echo -e "${GREEN}  Build complete${NC}"

# --- Step 4: Prisma Files ---
echo -e "\n${YELLOW}[4/5] Preparing Prisma files...${NC}"
mkdir -p .next/standalone/prisma
cp prisma/schema.prisma .next/standalone/prisma/
# Prisma engine binaries কপি
mkdir -p .next/standalone/node_modules/.prisma/client
cp -r node_modules/.prisma/client/* .next/standalone/node_modules/.prisma/client/ 2>/dev/null || true
mkdir -p .next/standalone/node_modules/@prisma/engines
cp -r node_modules/@prisma/engines/* .next/standalone/node_modules/@prisma/engines/ 2>/dev/null || true
echo -e "${GREEN}  Prisma files ready${NC}"

# --- Step 5: ZIP Package ---
echo -e "\n${YELLOW}[5/5] Creating deployment package...${NC}"

DEPLOY_DIR="/tmp/pyhood-deploy"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# কোর ফাইল কপি (.* hidden dirs সহ)
cp -r .next/standalone/* "$DEPLOY_DIR/"
cp -r .next/standalone/.next "$DEPLOY_DIR/.next"
cp .env.production "$DEPLOY_DIR/.env.example"
cp .htaccess "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"

# ডাটাবেস ডিরেক্টরি তৈরি (খালি)
mkdir -p "$DEPLOY_DIR/db"

# সিড ফাইল (প্রথম ডেপ্লয়ের জন্য)
mkdir -p "$DEPLOY_DIR/prisma"
cp prisma/seed.ts "$DEPLOY_DIR/prisma/" 2>/dev/null || true
cp prisma/schema.prisma "$DEPLOY_DIR/prisma/"

# ZIP
ZIP_NAME="pyhood-cpanel-$(date +%Y%m%d-%H%M%S).zip"
mkdir -p "$PROJECT_DIR/download"
cd "$DEPLOY_DIR"
zip -r "$PROJECT_DIR/download/$ZIP_NAME" . -x "*.map" -x "db/*.db" -x "db/*.db-journal" 2>/dev/null || true
cd "$PROJECT_DIR"

# সাইজ
SIZE=$(du -sh "download/$ZIP_NAME" | cut -f1)

echo -e "${GREEN}  Package ready: download/$ZIP_NAME (${SIZE})${NC}"

# --- Summary ---
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Package Ready!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  File: ${YELLOW}download/$ZIP_NAME${NC} (${SIZE})"
echo ""
echo -e "  ${YELLOW}cPanel Deployment Steps:${NC}"
echo ""
echo "  1. cPanel > Software > Setup Node.js App"
echo "  2. Click 'Create Application'"
echo "  3. Settings:"
echo "     - Node.js version: 20.x or 22.x"
echo "     - Application mode: Production"
echo "     - Application root: pyhood"
echo "     - Application URL: your domain/subdomain"
echo "     - Application startup file: server.js"
echo "  4. Upload & extract the ZIP to ~/pyhood/"
echo "  5. Copy .env.example to .env and edit values"
echo "  6. Set Environment Variables in cPanel"
echo "  7. Click 'Run NPM Install' > 'Start App'"
echo "  8. SSH: cd ~/pyhood && npx prisma db push"
echo "  9. (Optional) SSH: npx prisma db seed"
echo ""
echo -e "  ${GREEN}Done!${NC}"