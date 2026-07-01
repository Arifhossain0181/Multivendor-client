
import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from  "../providers/Provider"
import { Geist } from "next/font/google";
import { cn } from "@/src/libs/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata:Metadata={
  title: 'Multivendor E-commerce',
  description: 'Next-Gen Enterprise E-Commerce Platform',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}