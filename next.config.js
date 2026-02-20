/** @type {import('next').NextConfig} */
const withVideos = require("next-videos");
const { config } = require("dotenv");
const path = require("path");

config(); // Load environment variables from .env file

// Enable bundle analyzer if ANALYZE env variable is set
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  output: "standalone",
  // Compress output
  compress: true,

  // Enable SWC minification (faster and better)
  swcMinify: true,

  // Optimize images
  images: {
    domains: ["img.youtube.com", "i.ytimg.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "eu.ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "870e0e55f75d0d9434531d7518f57e92.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "pub-734ce1bac5434727ba9692dacb3d7441.r2.dev",
      },
      {
        protocol: "https",
        hostname: "customer-*.cloudflarestream.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudflarestream.com",
      },
      {
        protocol: "https",
        hostname: "videodelivery.net",
      },
      {
        protocol: "https",
        hostname: "*.videodelivery.net",
      },
    ],
    // Enable image optimization
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: false,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "react-icons",
      "framer-motion",
    ],
    // Speed up dev builds

  },

  // Development optimizations
  ...(process.env.NODE_ENV === "development" && {
    // Faster refresh in dev
    reactStrictMode: false, // Can disable in dev for faster builds
    // Reduce dev server overhead
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),

  // Compiler options (removeConsole omitted: not supported by Turbopack in dev)

  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    // Development optimizations
    if (dev) {
      // Faster builds in development
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false, // Disable code splitting in dev for faster builds
      };

      // Reduce cache overhead - use absolute path
      config.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: path.resolve(__dirname, ".next/cache/webpack"),
      };
    }

    // Optimize bundle size (production only)
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for large libraries
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // React and React-DOM
            react: {
              name: "react",
              chunks: "all",
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 30,
            },
            // Framer Motion
            framer: {
              name: "framer",
              chunks: "all",
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 25,
            },
          },
        },
      };
    }

    // Handlebars loader
    config.module.rules.push({
      test: /\.hbs$/,
      loader: "handlebars-loader",
    });

    // Optimize for Netlify
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  env: {},

  // Performance optimizations
  poweredByHeader: false,

  // Generate ETags for caching
  generateEtags: true,
};

module.exports = withBundleAnalyzer(withVideos(nextConfig));
