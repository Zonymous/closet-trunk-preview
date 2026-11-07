import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/case-studies/film-order-to-sap',
        destination: '/case-studies/ai-sales-order-automation-sap',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        // fonts and photos change rarely; a month of caching helps repeat visits
        source: '/:dir(fonts|images)/:file*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }],
      },
    ]
  },
}

export default nextConfig
