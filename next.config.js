/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    webpackBuildWorker: false,
  },
}

module.exports = nextConfig
