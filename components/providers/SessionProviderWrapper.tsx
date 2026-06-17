"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/lib/theme-context";

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
