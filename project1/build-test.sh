#!/bin/bash
echo "Cleaning dist directory..."
rm -rf dist

echo "Building TypeScript..."
npm run build

echo "Checking if dist/app.js exists..."
if [ -f "dist/app.js" ]; then
    echo "✅ Build successful! dist/app.js exists"
    ls -la dist/
else
    echo "❌ Build failed! dist/app.js not found"
    echo "Contents of current directory:"
    ls -la
fi 