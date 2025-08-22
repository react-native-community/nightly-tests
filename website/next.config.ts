import type { NextConfig } from "next";

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
    rules: {
      "*.svg": {
        as: "*.js",
        loaders: ["@svgr/webpack"],
      },
    },
  },
};

export default nextConfig;
