/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fix for html2canvas and jsPDF dynamic imports
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // Ignore these modules during server-side rendering
    if (isServer) {
      config.externals = [...config.externals, 'html2canvas', 'jspdf'];
    }

    // Handle dynamic imports properly
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      cacheGroups: {
        ...config.optimization.splitChunks.cacheGroups,
        pdf: {
          name: 'pdf-libs',
          chunks: 'async',
          test: /[\\/]node_modules[\\/](html2canvas|jspdf)[\\/]/,
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    };

    return config;
  },
  // Disable static optimization for pages that use dynamic imports
  experimental: {
    esmExternals: 'loose',
  },
  // Ensure proper handling of dynamic imports
  swcMinify: true,
};

module.exports = nextConfig;