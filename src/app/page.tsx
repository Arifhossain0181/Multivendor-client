import type { Metadata } from "next";
import { AppProviders } from "../providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Marketplace",
  description: "Multi-vendor marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}