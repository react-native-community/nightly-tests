import type { NextConfig } from 'next';
import path from 'node:path';

const basePath = process.env.REPOSITORY_NAME
  ? `/${process.env.REPOSITORY_NAME}`
  : undefined;

const PACKAGES_TO_OPTIMIZE = ['@radix-ui/*', '@tenstack/*'];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  trailingSlash: true,
  poweredByHeader: false,
  output: 'export',
  basePath,
  assetPrefix: basePath,
  transpilePackages: PACKAGES_TO_OPTIMIZE,
  turbopack: {
    root: path.join(import.meta.dirname, '..'),
    rules: {
      '*.svg': {
        as: '*.js',
        loaders: ['@svgr/webpack'],
      },
    },
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: PACKAGES_TO_OPTIMIZE,
  },
};

export default nextConfig;
