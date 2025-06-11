import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['s3-storage.kaptifi.com', 'picsum.photos'], 
  },
};

export default nextConfig;
