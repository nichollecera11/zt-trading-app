/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This wildcard allows images from ANY secure website (Great for your MVP!)
      },
    ],
  },
};

export default nextConfig;