/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // add your image CDN or host
    domains: ['images.example.com'],
  },
};

module.exports = nextConfig;
