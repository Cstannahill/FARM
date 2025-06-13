#!/bin/bash

# Vercel build script to handle ESM/CJS issues
echo "🔧 Starting Vercel build script..."

# Backup original package.json
cp package.json package.json.backup

# Remove "type": "module" for API functions during build
echo "📝 Temporarily removing ESM type for API compatibility..."
sed -i.bak 's/"type": "module",//g' package.json

# Run the build
echo "🏗️ Running build..."
npm run build

# Restore original package.json
echo "📝 Restoring original package.json..."
mv package.json.backup package.json

echo "✅ Vercel build script completed!"
