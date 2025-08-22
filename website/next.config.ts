import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  basePath: process.env.REPOSITORY_NAME ? `/${process.env.REPOSITORY_NAME}` : undefined,
  assetPrefix: process.env.REPOSITORY_NAME ? `/${process.env.REPOSITORY_NAME}` : undefined,
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
