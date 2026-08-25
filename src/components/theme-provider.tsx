"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      scriptProps={
        typeof window !== "undefined"
          ? ({ type: "application/json" } as const)
          : undefined
      }
    >
      {children}
    </NextThemesProvider>
  );
}