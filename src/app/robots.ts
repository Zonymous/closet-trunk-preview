import type { MetadataRoute } from 'next'
import { INDEXABLE, absolute } from '@/lib/seo'

// Search engines and AI search crawlers are all allowed once the public address is set.
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/' }, sitemap: absolute('/sitemap.xml') }
}
