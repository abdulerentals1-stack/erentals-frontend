/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dsc5aznps/image/upload/**', // Allow all paths under your account
      },
      {
        protocol: 'https',
        hostname: 'blr1.vultrobjects.com',
        pathname: '/erental-object/**', // Allow all paths under your account
      },
    ],
  },
};

export default nextConfig;
