import type { NextConfig } from "next";

// Xuất tĩnh để chạy trên Firebase Hosting gói miễn phí (xem rules.md, mục W1).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
