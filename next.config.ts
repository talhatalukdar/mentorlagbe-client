import type { NextConfig } from "next";

// All browser requests go to /api/* on THIS origin and are proxied to the Express server.
// This keeps BetterAuth cookies first-party (no cross-site cookie / CORS problems in production).
const API_URL = process.env.API_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
