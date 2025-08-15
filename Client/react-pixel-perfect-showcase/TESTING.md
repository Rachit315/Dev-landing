# Testing Setup for ThemeToggle Component

## Overview

This document provides instructions for setting up and running tests for the ThemeToggle component.

## Prerequisites

To run the tests, you'll need to install the following testing dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

## Test Configuration

### 1. Update package.json

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### 2. Create vitest.config.ts

Create a `vitest.config.ts` file in the root directory:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Running Tests

Once the dependencies are installed and configuration is set up:

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The ThemeToggle component tests cover:

### Functionality Tests
- ✅ Renders correctly in light theme
- ✅ Renders correctly in dark theme
- ✅ Calls setTheme when clicked
- ✅ Handles keyboard navigation (Space/Enter keys)
- ✅ Shows loading state during hydration
- ✅ Applies custom className prop

### Accessibility Tests
- ✅ Has proper ARIA attributes
- ✅ Provides screen reader announcements
- ✅ Supports keyboard navigation
- ✅ Has appropriate focus indicators
- ✅ Includes descriptive labels

### Integration Tests
- ✅ Integrates properly with ThemeProvider
- ✅ Theme state changes are reflected in UI
- ✅ Theme persistence works correctly

## Test Files

- `src/components/__tests__/theme-toggle.test.tsx` - Main test file
- `src/test-setup.ts` - Test environment setup
- `TESTING.md` - This documentation file

## Manual Testing Checklist

In addition to automated tests, manually verify:

### Desktop Testing
- [ ] Toggle switches theme correctly
- [ ] Hover states work properly
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works (Tab, Space, Enter)
- [ ] Theme persists after page reload

### Mobile Testing
- [ ] Toggle is easily tappable (44px minimum)
- [ ] No horizontal scrolling issues
- [ ] Touch interactions work smoothly
- [ ] Toggle remains visible on small screens

### Accessibility Testing
- [ ] Screen reader announces theme changes
- [ ] High contrast mode compatibility
- [ ] Keyboard-only navigation works
- [ ] Focus management is proper

### Cross-browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Notes

- Tests use mocked `next-themes` to avoid dependency on actual theme provider
- Loading state tests verify hydration mismatch prevention
- Accessibility tests ensure WCAG compliance
- Integration tests verify proper theme provider integration