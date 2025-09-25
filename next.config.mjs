/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["aceternity.com", "images.unsplash.com", "assets.aceternity.com"],
  },
};

export default nextConfig;
