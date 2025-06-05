/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['localhost', process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '')].filter(Boolean),
  },
  env: {
    IS_LOCALHOST: process.env.NODE_ENV === 'development' ? 'true' : 'false',
  },
}

module.exports = nextConfig 