#!/usr/bin/env node

/**
 * Deployment script for dev-landing project
 * Ensures proper build and deployment to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process...');

try {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    throw new Error('Please run this script from the project root directory');
  }

  // Clean previous build
  const distPath = 'Client/react-pixel-perfect-showcase/dist';
  if (fs.existsSync(distPath)) {
    console.log('🧹 Cleaning previous build...');
    execSync(`rmdir /s /q "${distPath}"`, { stdio: 'inherit' });
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('pnpm install --frozen-lockfile', { stdio: 'inherit' });

  // Build the project
  console.log('🔨 Building project...');
  execSync('pnpm run build', { stdio: 'inherit' });

  // Verify build output
  if (!fs.existsSync(path.join(distPath, 'index.html'))) {
    throw new Error('Build failed: index.html not found in dist directory');
  }

  console.log('✅ Build completed successfully!');
  console.log('📁 Build output location:', distPath);
  console.log('🌐 Ready for Vercel deployment');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}