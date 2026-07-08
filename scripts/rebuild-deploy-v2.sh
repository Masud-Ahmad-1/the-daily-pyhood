#!/bin/bash
set -e

PROJECT_DIR="/home/z/my-project"
DEPLOY_DIR="/tmp/pyhood-deploy-v2"
STANDALONE_DIR="$PROJECT_DIR/.next/standalone"

echo "=== Cleaning ==="
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "=== Copying standalone output (includes standalone server.js) ==="
cp -r "$STANDALONE_DIR/"* "$DEPLOY_DIR/"

echo "=== Copying hidden .next directory ==="
cp -r "$STANDALONE_DIR/.next" "$DEPLOY_DIR/.next"

echo "=== Copying static assets to .next/static ==="
cp -r "$PROJECT_DIR/.next/static" "$DEPLOY_DIR/.next/static"

echo "=== Copying public directory ==="
cp -r "$PROJECT_DIR/public" "$DEPLOY_DIR/public"

echo "=== Copying Prisma schema & seed ==="
mkdir -p "$DEPLOY_DIR/prisma"
cp "$PROJECT_DIR/prisma/schema.prisma" "$DEPLOY_DIR/prisma/"
cp "$PROJECT_DIR/prisma/seed.ts" "$DEPLOY_DIR/prisma/" 2>/dev/null || true

echo "=== Copying Prisma engine binaries ==="
mkdir -p "$DEPLOY_DIR/node_modules/.prisma/client"
cp -r "$PROJECT_DIR/node_modules/.prisma/client/"* "$DEPLOY_DIR/node_modules/.prisma/client/" 2>/dev/null || true
mkdir -p "$DEPLOY_DIR/node_modules/@prisma/engines"
cp -r "$PROJECT_DIR/node_modules/@prisma/engines/"* "$DEPLOY_DIR/node_modules/@prisma/engines/" 2>/dev/null || true

echo "=== Copying config files ==="
cp "$PROJECT_DIR/package.json" "$DEPLOY_DIR/"
cp "$PROJECT_DIR/.env.production" "$DEPLOY_DIR/.env.example"

echo "=== Creating db directory ==="
mkdir -p "$DEPLOY_DIR/db"

echo "=== Verifying standalone server.js exists ==="
ls -la "$DEPLOY_DIR/server.js"

echo "=== Creating tar.gz ==="
cd "$DEPLOY_DIR"
tar -czf "$PROJECT_DIR/download/pyhood-deploy-v2.tar.gz" .
cd "$PROJECT_DIR"

SIZE=$(du -sh "$PROJECT_DIR/download/pyhood-deploy-v2.tar.gz" | cut -f1)
echo ""
echo "=== Done! ==="
echo "File: download/pyhood-deploy-v2.tar.gz ($SIZE)"
echo ""
echo "Root contents:"
tar -tzf "$PROJECT_DIR/download/pyhood-deploy-v2.tar.gz" | grep -v '/.*/' | grep '^\./[^/]*$'