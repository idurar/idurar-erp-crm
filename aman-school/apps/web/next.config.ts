import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@aman-school/types", "@aman-school/api-client"],
};

export default nextConfig;
