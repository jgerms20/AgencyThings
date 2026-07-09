import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  turbopack: {
    root: path.resolve(__dirname)
  }
};

export default nextConfig;
