import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.86.190.19"],
};

initOpenNextCloudflareForDev();

export default nextConfig;