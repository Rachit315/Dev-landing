# Design Document

## Overview

This design implements a theme toggle switch in the navbar that allows users to seamlessly switch between light and dark themes. The solution leverages the existing next-themes library and shadcn/ui components to provide a consistent, accessible, and responsive theme switching experience.

## Architecture

### Theme Management
- **next-themes**: Utilize the existing next-themes dependency for theme state management and persistence
- **ThemeProvider**: Wrap the application with ThemeProvider to enable theme context throughout the component tree
- **Theme Persistence**: Automatic localStorage persistence and system preference detection via next-themes

### Component Structure
```
App.tsx (ThemeProvider wrapper)
├── Index.tsx (main page)
    └── Header (existing)
        ├── Logo (existing)
        ├── Navigation (existing)
        └── ThemeToggle (new component)
```

## Components and Interfaces

### ThemeToggle Component
**Location**: `src/components/theme-toggle.tsx`

**Props Interface**:
```typescript
interface ThemeToggleProps {
  className?: string;
}
```

**Features**:
- Uses shadcn/ui Switch component for consistent styling
- Integrates with next-themes useTheme hook
- Includes Sun/Moon icons from lucide-react for visual feedback
- Supports keyboard navigation and screen reader accessibility
- Responsive design with appropriate touch targets

### Updated App.tsx
- Wrap existing app with ThemeProvider from next-themes
- Configure theme provider with system preference detection
- Maintain existing routing and provider structure

### Updated Index.tsx Header
- Add ThemeToggle component to the existing navbar
- Position toggle appropriately for both desktop and mobile layouts
- Ensure toggle remains visible across all breakpoints

## Data Models

### Theme State
```typescript
type Theme = "light" | "dark" | "system";

interface ThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  systemTheme: "light" | "dark";
}
```

## Implementation Details

### Theme Provider Configuration
```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
```

### CSS Variables Integration
- Leverage existing CSS custom properties in `index.css`
- Utilize the existing `.dark` class selector for theme switching
- Maintain current color token system (HSL values)

### Responsive Behavior
- **Desktop (md+)**: Toggle appears alongside existing navigation links
- **Mobile (<md)**: Toggle remains visible in collapsed navbar state
- **Touch Targets**: Minimum 44px touch target for mobile accessibility

### Visual Design
- **Switch Component**: Use existing shadcn/ui Switch with custom styling
- **Icons**: Sun icon for light theme, Moon icon for dark theme
- **Transitions**: Smooth theme transitions using existing CSS transition utilities
- **Hover States**: Consistent with existing button hover effects

## Error Handling

### Hydration Mismatch Prevention
- Use `useEffect` and `mounted` state to prevent SSR/client mismatch
- Show loading state or skeleton during hydration
- Graceful fallback to system theme if localStorage is unavailable

### Theme Loading States
- Handle initial theme resolution delay
- Prevent flash of incorrect theme (FOIT)
- Smooth transition between theme states

## Testing Strategy

### Unit Tests
- Theme toggle functionality
- Keyboard navigation
- Screen reader accessibility
- Theme persistence
- Component rendering in different theme states

### Integration Tests
- Theme switching across entire application
- Mobile responsiveness
- Theme persistence across page reloads
- System theme preference detection

### Accessibility Tests
- Keyboard navigation flow
- Screen reader announcements
- Focus management
- Color contrast in both themes
- Touch target sizing on mobile devices

## Performance Considerations

### Bundle Size
- Leverage existing next-themes dependency (no additional bundle impact)
- Use existing lucide-react icons (Sun, Moon)
- Minimal additional CSS for theme toggle styling

### Runtime Performance
- Theme switching should be instantaneous
- No layout shifts during theme transitions
- Efficient CSS custom property updates

## Browser Compatibility

### Modern Browser Support
- CSS custom properties (already in use)
- localStorage API
- System theme preference detection (`prefers-color-scheme`)

### Fallback Strategy
- Graceful degradation for older browsers
- Default to light theme if system preference unavailable
- Manual theme switching still functional without system detection

## Mobile Considerations

### Touch Interaction
- Minimum 44px touch target
- Appropriate spacing from other interactive elements
- Clear visual feedback on touch

### Layout Adaptation
- Toggle remains accessible in mobile navbar
- Consistent positioning across breakpoints
- No horizontal scrolling issues

## Accessibility Features

### Keyboard Navigation
- Tab order integration with existing navbar
- Space/Enter key activation
- Focus indicators matching site design

### Screen Reader Support
- Descriptive aria-labels
- Theme change announcements
- Role and state information

### Visual Accessibility
- High contrast support in both themes
- Clear visual distinction between theme states
- Consistent with existing site accessibility patterns