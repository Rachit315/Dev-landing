/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '../theme-toggle';

// Mock next-themes
const mockSetTheme = jest.fn();
const mockUseTheme = {
  theme: 'light',
  setTheme: mockSetTheme,
  resolvedTheme: 'light',
  systemTheme: 'light'
};

jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => mockUseTheme
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    {children}
  </ThemeProvider>
);

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    // Reset to light theme
    mockUseTheme.theme = 'light';
    mockUseTheme.resolvedTheme = 'light';
  });

  it('renders correctly in light theme', async () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-label', expect.stringContaining('Switch to dark theme'));
    expect(switchElement).not.toBeChecked();
  });

  it('renders correctly in dark theme', async () => {
    mockUseTheme.resolvedTheme = 'dark';
    
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-label', expect.stringContaining('Switch to light theme'));
    expect(switchElement).toBeChecked();
  });

  it('calls setTheme when clicked', async () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('handles keyboard navigation', async () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    const switchElement = screen.getByRole('switch');
    
    // Test Space key
    fireEvent.keyDown(switchElement, { key: ' ' });
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    mockSetTheme.mockClear();

    // Test Enter key
    fireEvent.keyDown(switchElement, { key: 'Enter' });
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('has proper accessibility attributes', async () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    const groupElement = screen.getByRole('group');
    expect(groupElement).toHaveAttribute('aria-label', expect.stringContaining('Theme toggle'));

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-describedby', 'theme-toggle-description');

    const description = document.getElementById('theme-toggle-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('Toggle between light and dark theme');
  });

  it('shows loading state during hydration', () => {
    // Mock useState to return false for mounted state
    const mockUseState = jest.spyOn(React, 'useState');
    mockUseState.mockImplementationOnce(() => [false, jest.fn()]);

    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveAttribute('aria-label', 'Loading theme toggle');

    mockUseState.mockRestore();
  });

  it('announces theme changes to screen readers', async () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    // Check if aria-live region was created
    await waitFor(() => {
      const ariaLiveRegion = document.querySelector('[aria-live="polite"]');
      expect(ariaLiveRegion).toBeInTheDocument();
      expect(ariaLiveRegion).toHaveTextContent('Theme switched to dark mode');
    });
  });

  it('applies custom className', async () => {
    render(
      <TestWrapper>
        <ThemeToggle className="custom-class" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    const groupElement = screen.getByRole('group');
    expect(groupElement).toHaveClass('custom-class');
  });
});

// Integration test for theme persistence
describe('ThemeToggle Integration', () => {
  it('integrates properly with ThemeProvider', async () => {
    const { rerender } = render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    // Simulate theme change
    mockUseTheme.resolvedTheme = 'dark';
    
    rerender(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();
    expect(switchElement).toHaveAttribute('aria-label', expect.stringContaining('Switch to light theme'));
  });
});