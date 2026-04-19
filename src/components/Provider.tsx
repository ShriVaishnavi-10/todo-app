"use client";

import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Force dark mode on every full page reload/mount.
    // This satisfies "Refresh = Dark Mode" while allowing the 
    // toggle to work during the current session.
    setTheme("dark");
  }, []); // Only runs once on initial mount

  return <>{children}</>;
}

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ThemeInitializer>
        <SessionProvider>{children}</SessionProvider>
      </ThemeInitializer>
    </ThemeProvider>
  );
}
