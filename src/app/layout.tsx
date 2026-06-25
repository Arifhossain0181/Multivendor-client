
import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from  "../providers/Provider"

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
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}