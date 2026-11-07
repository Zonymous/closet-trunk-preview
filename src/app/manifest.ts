import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name}: ${SITE.tagline}`,
    short_name: SITE.name,
    start_url: '/',
    display: 'browser',
    background_color: '#0B0B0D',
    theme_color: '#0B0B0D',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
