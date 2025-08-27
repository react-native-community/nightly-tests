import type { NextConfig } from "next";
import path from "node:path";

const basePath = process.env.REPOSITORY_NAME
  ? `/${process.env.REPOSITORY_NAME}`
  : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  basePath,
  assetPrefix: basePath,
  turbopack: {
    root: path.join(import.meta.dirname, ".."),
    rules: {
      "*.svg": {
        as: "*.js",
        loaders: ["@svgr/webpack"],
      },
    },
  },
};

export default nextConfig;
