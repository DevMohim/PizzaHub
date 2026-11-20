"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";

/* No-op subscription — used only to detect the client (post-hydration) mount. */
const subscribeNoop = () => () => {};

/**
 * Light/dark switch for the navbar. The initial theme follows the OS
 * (`defaultTheme="system"` in the root layout) and the visitor's choice is
 * persisted by next-themes in localStorage. Icons are rendered from the
 * client snapshot only, so the server HTML and the first hydration pass
 * always match.
 */
const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={mounted ? `Switch to ${nextTheme} mode` : "Toggle color theme"}
      title={mounted ? `Switch to ${nextTheme} mode` : "Toggle color theme"}
      onClick={() => setTheme(nextTheme)}
    >
      <Sun
        className={cn(
          "size-5 transition-opacity duration-200",
          mounted && !isDark ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute size-5 transition-opacity duration-200",
          mounted && isDark ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />
    </Button>
  );
};

export default ThemeToggle;
