/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Clickjacking: el sitio no debe poder embeberse en iframes ajenos.
  { key: 'X-Frame-Options', value: 'DENY' },
  // Evita que el browser adivine tipos MIME (defensa contra MIME confusion).
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // No filtrar URL completa al navegar a un dominio externo.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Apagar APIs sensibles que no usamos. Si en el futuro hace falta una,
  // se quita de aquí.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
