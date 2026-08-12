/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config) => {
    return config
  },
}

module.exports = nextConfig
