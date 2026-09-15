/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "",
  assetPrefix: "",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "sentradesa.id" },
      { protocol: "https", hostname: "sentradesa.test" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" }
    ]
  }
};

export default nextConfig;
