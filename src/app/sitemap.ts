import type { MetadataRoute } from 'next'
import { CASE_STUDY } from '@/content/site'
import { absolute } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const modified = new Date(CASE_STUDY.modified)
  return [
    { url: absolute('/'), lastModified: modified },
    { url: absolute('/case-studies'), lastModified: modified },
    { url: absolute(CASE_STUDY.href), lastModified: modified, images: [absolute(CASE_STUDY.thumbnail)] },
  ]
}
