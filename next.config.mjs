/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel handles SSG/ISR natively — no static export needed
  images: {
    formats: ["image/avif", "image/webp"],
    // Optimize images automatically on Vercel
  },
  // Skip ESLint during production build (run separately in CI if needed)
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;
