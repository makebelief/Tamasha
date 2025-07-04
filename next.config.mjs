/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/Tamasha' : '',
  images: {
    unoptimized: true,
  },
  devIndicators: {
    position: "bottom-right",
  },
}

export default nextConfig
