import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@bklitui/ui", "@bklitui/studio", "geist"],
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/og/studio/chart": ["./node_modules/@sparticuz/chromium/bin/**"],
    "/api/og/studio": [
      "./node_modules/geist/dist/fonts/geist-sans/**",
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
  },
  experimental: {
    // Keeps dev/prod from pulling the entire charts package per MDX page.
    optimizePackageImports: ["@bklitui/ui", "@bklitui/ui/charts"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default withMDX(nextConfig);
