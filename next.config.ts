import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'img.clerk.com' }, {protocol: 'https', hostname: 'app.thebcms.com'}]
  }
};

export default nextConfig;