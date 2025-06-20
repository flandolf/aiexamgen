import type { NextConfig } from "next";

const commitSha = process.env.CF_PAGES_COMMIT_SHA
  ? process.env.CF_PAGES_COMMIT_SHA.substring(0, 7)
  : "unknown";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
  },
};

export default nextConfig;
