
import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "../providers/AppProviders";
import { cn } from "@/src/libs/utils";
import { LayoutWrapper } from "@/src/components/LayoutWrapper";
import type { CSSProperties } from "react";

const rootFontVars: CSSProperties = {
  ["--font-sans" as string]: '"Inter", "Segoe UI", Arial, sans-serif',
  ["--font-geist-mono" as string]: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
};

export const metadata: Metadata = {
  title: "Multivendor E-commerce",
  description: "Next-Gen Enterprise E-Commerce Platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans")} style={rootFontVars}>
      <body>
        <AppProviders>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
