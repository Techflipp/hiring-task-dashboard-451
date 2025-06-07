import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  optimizations: {
    images: {
      unoptimized: true,
    },
    minimize: true
  }
};

export default nextConfig;
