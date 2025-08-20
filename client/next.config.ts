import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "alojamientos-lemon.vercel.app"], // añade aquí tu dominio real
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/alojamientos/**",
      },
      {
        protocol: "https",
        hostname: "alojamientos-lemon.vercel.app", // ejemplo de dominio real
        pathname: "/alojamientos/**",
      },
    ],
  },
};

export default nextConfig;
