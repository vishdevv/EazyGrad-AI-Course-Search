import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the workspace root to this project directory so Next.js
    // doesn't mistake a yarn.lock in a parent directory as the monorepo root.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
