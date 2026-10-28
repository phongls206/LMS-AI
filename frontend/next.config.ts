import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
  reactCompiler: true,
  devIndicators: false,
};

export default nextConfig;
