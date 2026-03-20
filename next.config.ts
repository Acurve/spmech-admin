import type { NextConfig } from "next";
import { isDev } from "./config/apiPrefix";
import { env } from "./config/env";
const nextConfig: NextConfig = {
  /* config options here */
  distDir: "build",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: isDev
          ? "http://127.0.0.1:3000/api/v1/:path*"
          : `${env.API_PREFIX}/:path*`
      }
    ]
  }
};

export default nextConfig;
