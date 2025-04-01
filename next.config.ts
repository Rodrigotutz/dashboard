import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },
  images: {
    formats: ["image/avif"],
  },
  experimental: {
    turbo: {},
  },
};

export default nextConfig;
