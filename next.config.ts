import type { NextConfig } from "next";
import path from "path";

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
   async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      }
    ]
  }
};

export default nextConfig;
