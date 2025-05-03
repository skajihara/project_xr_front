import type { NextConfig } from "next";
import path from "path";
import dotenvFlow from 'dotenv-flow'

// __dirname === C:\…\project_xr_front\src
dotenvFlow.config({
  path: path.resolve(__dirname, 'env'),  // ← src/env を指す
})

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
    // 他に公開したい NEXT_PUBLIC_* があればここに追加
  },
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
