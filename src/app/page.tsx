import type { Metadata } from "next";
import { AppProviders } from "../providers/AppProviders";
import "./globals.css";
import { Navbar5 } from "../components/navbar5";

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
           <Navbar5></Navbar5>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}