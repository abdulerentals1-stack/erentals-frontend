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
        hostname: 'res.cloudinary.com',
        pathname: '/danhxbweb/image/upload/**', // Allow all paths under your account
      },
      {
        protocol: 'https',
        hostname: 'blr1.vultrobjects.com',
        pathname: '/erental-object/**', // Allow all paths under your account
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/qoutation',
        destination: '/quotation',
        permanent: true,
      },
      {
        source: '/qoutation/:id',
        destination: '/quotation/:id',
        permanent: true,
      },
      {
        source: '/blogs/:slug',
        destination: '/services/:slug',
        permanent: true,
      },
      {
        source: '/product/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/about-us',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/quotation',
        destination: '/qoutation',
      },
      {
        source: '/quotation/:id',
        destination: '/qoutation/:id',
      },
    ];
  },
};

export default nextConfig;
