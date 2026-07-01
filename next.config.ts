import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
    ],
    // Permite cualquier fuente HTTPS para imágenes cargadas desde el panel admin.
    // Cambiar a lista blanca explícita cuando el CDN de producción esté definido.
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },
};

export default nextConfig;
