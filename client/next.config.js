/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['/api/recipes/images', '/api/users/images',]
  }
}

module.exports = nextConfig
