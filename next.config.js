/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/oux',
  assetPrefix: '/oux/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
