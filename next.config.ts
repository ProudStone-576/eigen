import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory would otherwise be picked as the workspace root.
  turbopack: { root: __dirname },
  // Local QA runs on 127.0.0.1 too (a separate cookie jar from localhost). Dev server only.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
