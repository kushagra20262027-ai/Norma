import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - buildActivity and appIsrStatus are valid in some Next.js environments
  devIndicators: false,
};

export default nextConfig;