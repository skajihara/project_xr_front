import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      // webpack5 のメモリキャッシュに切り替え
      config.cache = {
        type: 'memory',
      };
    }
    return config;
  },
};

export default nextConfig;
