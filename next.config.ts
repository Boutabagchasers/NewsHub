import type { NextConfig } from "next";

// Bundle analyzer for performance monitoring
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* Next.js configuration */

  // Image optimization for logos and external sources
  images: {
    remotePatterns: [
      // Unsplash (placeholder images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      // CNN
      {
        protocol: 'https',
        hostname: 'cdn.cnn.com',
      },
      {
        protocol: 'https',
        hostname: 'media.cnn.com',
      },
      // BBC
      {
        protocol: 'https',
        hostname: 'ichef.bbci.co.uk',
      },
      // New York Times
      {
        protocol: 'https',
        hostname: 'static01.nyt.com',
      },
      {
        protocol: 'https',
        hostname: 'static.nyt.com',
      },
      // The Verge / Vox Media
      {
        protocol: 'https',
        hostname: 'platform.theverge.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.vox-cdn.com',
      },
      // TechCrunch
      {
        protocol: 'https',
        hostname: 'techcrunch.com',
      },
      {
        protocol: 'https',
        hostname: '**.techcrunch.com',
      },
      // Ars Technica
      {
        protocol: 'https',
        hostname: 'cdn.arstechnica.net',
      },
      // ESPN
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
      },
      {
        protocol: 'https',
        hostname: 'espncdn.com',
      },
      // Wall Street Journal
      {
        protocol: 'https',
        hostname: 'images.wsj.net',
      },
      {
        protocol: 'https',
        hostname: 's.wsj.net',
      },
      // The Guardian
      {
        protocol: 'https',
        hostname: 'i.guim.co.uk',
      },
      // NPR
      {
        protocol: 'https',
        hostname: 'media.npr.org',
      },
      // Bloomberg
      {
        protocol: 'https',
        hostname: 'assets.bwbx.io',
      },
      // Reuters
      {
        protocol: 'https',
        hostname: '**.reuters.com',
      },
      // CBS Sports
      {
        protocol: 'https',
        hostname: 'sportsfly.cbsistatic.com',
      },
      {
        protocol: 'https',
        hostname: 'sportshub.cbsistatic.com',
      },
      // Variety
      {
        protocol: 'https',
        hostname: 'variety.com',
      },
      {
        protocol: 'https',
        hostname: '**.variety.com',
      },
      // Hollywood Reporter
      {
        protocol: 'https',
        hostname: 'hollywoodreporter.com',
      },
      {
        protocol: 'https',
        hostname: '**.hollywoodreporter.com',
      },
      // Science Daily
      {
        protocol: 'https',
        hostname: 'sciencedaily.com',
      },
      {
        protocol: 'https',
        hostname: '**.sciencedaily.com',
      },
      // Nature
      {
        protocol: 'https',
        hostname: 'nature.com',
      },
      {
        protocol: 'https',
        hostname: '**.nature.com',
      },
      // Generic wildcard for common CDNs (use cautiously)
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '**.wp.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Optimize builds
  reactStrictMode: true,

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
};

export default withBundleAnalyzer(nextConfig);
