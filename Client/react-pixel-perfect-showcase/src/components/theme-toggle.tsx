"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-2", className)} role="group" aria-label="Theme toggle">
        <Sun className="h-4 w-4" aria-hidden="true" />
        <Switch disabled aria-label="Loading theme toggle" />
        <Moon className="h-4 w-4" aria-hidden="true" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";
  const currentTheme = isDark ? "dark" : "light";
  const nextTheme = isDark ? "light" : "dark";

  const handleToggle = () => {
    setTheme(nextTheme);
    
    // Announce theme change to screen readers
    const announcement = `Theme switched to ${nextTheme} mode`;
    const ariaLiveRegion = document.createElement('div');
    ariaLiveRegion.setAttribute('aria-live', 'polite');
    ariaLiveRegion.setAttribute('aria-atomic', 'true');
    ariaLiveRegion.className = 'sr-only';
    ariaLiveRegion.textContent = announcement;
    document.body.appendChild(ariaLiveRegion);
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(ariaLiveRegion);
    }, 1000);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center",
        "theme-toggle-mobile theme-toggle-contrast",
        className
      )} 
      role="group" 
      aria-label={`Theme toggle. Current theme: ${currentTheme}`}
    >
      <Sun 
        className={cn("h-4 w-4 transition-colors flex-shrink-0", {
          "text-primary": !isDark,
          "text-muted-foreground": isDark
        })} 
        aria-hidden="true"
      />
      <Switch
        checked={isDark}
        onCheckedChange={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label={`Switch to ${nextTheme} theme. Current theme: ${currentTheme}`}
        aria-describedby="theme-toggle-description"
        className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation"
      />
      <Moon 
        className={cn("h-4 w-4 transition-colors flex-shrink-0", {
          "text-primary": isDark,
          "text-muted-foreground": !isDark
        })} 
        aria-hidden="true"
      />
      <span id="theme-toggle-description" className="sr-only">
        Toggle between light and dark theme
      </span>
    </div>
  );
}