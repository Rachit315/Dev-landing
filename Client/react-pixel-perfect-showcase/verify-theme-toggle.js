#!/usr/bin/env node

/**
 * Theme Toggle Implementation Verification Script
 * 
 * This script verifies that all the theme toggle implementation files
 * are in place and have the expected content.
 */

const fs = require('fs');
const path = require('path');

const files = [
  {
    path: 'src/App.tsx',
    checks: [
      'import { ThemeProvider } from "next-themes"',
      '<ThemeProvider',
      'attribute="class"',
      'defaultTheme="system"',
      'enableSystem'
    ]
  },
  {
    path: 'src/components/theme-toggle.tsx',
    checks: [
      'export function ThemeToggle',
      'useTheme',
      'Sun, Moon',
      'Switch',
      'aria-label',
      'onKeyDown'
    ]
  },
  {
    path: 'src/pages/Index.tsx',
    checks: [
      'import { ThemeToggle }',
      '<ThemeToggle'
    ]
  },
  {
    path: 'src/index.css',
    checks: [
      'transition:',
      'background-color 0.3s ease',
      'color-scheme: light dark',
      '.sr-only',
      'touch-manipulation'
    ]
  }
];

console.log('🔍 Verifying Theme Toggle Implementation...\n');

let allChecksPass = true;

files.forEach(({ path: filePath, checks }) => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File missing: ${filePath}`);
    allChecksPass = false;
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const failedChecks = checks.filter(check => !content.includes(check));

  if (failedChecks.length === 0) {
    console.log(`✅ ${filePath} - All checks passed`);
  } else {
    console.log(`❌ ${filePath} - Missing:`);
    failedChecks.forEach(check => console.log(`   - ${check}`));
    allChecksPass = false;
  }
});

console.log('\n📋 Additional Files Created:');
const additionalFiles = [
  'src/components/__tests__/theme-toggle.test.tsx',
  'src/test-setup.ts',
  'TESTING.md',
  'RESPONSIVE-TESTING.md'
];

additionalFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath}`);
  } else {
    console.log(`❌ ${filePath} - Missing`);
  }
});

console.log('\n🚀 Next Steps:');
console.log('1. Run `npm run dev` to start the development server');
console.log('2. Test the theme toggle in your browser');
console.log('3. Verify responsive behavior on different screen sizes');
console.log('4. Install testing dependencies if you want to run tests:');
console.log('   npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom');

if (allChecksPass) {
  console.log('\n🎉 Theme Toggle implementation is complete!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review the implementation.');
  process.exit(1);
}