/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: true,
  },
  reactStrictMode: true,
  skipConvexDeploymentUrlCheck: true,
};

export default nextConfig;
