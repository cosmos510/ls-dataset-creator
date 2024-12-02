/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' www.googletagmanager.com www.google-analytics.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' data:;
  font-src 'self' fonts.googleapis.com fonts.gstatic.com;
  connect-src 'self' www.google-analytics.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
`;

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;