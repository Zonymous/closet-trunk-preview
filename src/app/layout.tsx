import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './site.css'
import './motion.css'
import { SITE } from '@/content/site'
import { INDEXABLE, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.seoTitle,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.seoDescription,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  robots: INDEXABLE
    ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } }
    : { index: false, follow: false },
  openGraph: { siteName: SITE.name, locale: 'en_IN', type: 'website' },
  twitter: { card: 'summary_large_image' },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
  appleWebApp: { title: SITE.name },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: '#0B0B0D',
}

// Reveal states are hidden only once this runs, so a page without scripts shows everything.
// If hydration never happens, the same script gives up and shows the page after 4 seconds.
const bootScript = `(function(){var r=document.documentElement;r.classList.add('js');setTimeout(function(){if(!r.classList.contains('rv-ready'))r.classList.remove('js')},4000)})()`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <link rel="preload" href="/fonts/Geist.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
