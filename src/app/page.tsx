import type { Metadata } from 'next'
import { AnchorClient } from '@/components/AnchorClient'
import { CaseStudySection } from '@/components/CaseStudySection'
import { Control } from '@/components/Control'
import { DeferredPhotos } from '@/components/DeferredPhotos'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { HomeFaq } from '@/components/HomeFaq'
import { HowItRuns } from '@/components/HowItRuns'
import { Impact } from '@/components/Impact'
import { JsonLd } from '@/components/JsonLd'
import { LogoStrip } from '@/components/LogoStrip'
import { Nav } from '@/components/Nav'
import { OsHub } from '@/components/OsHub'
import { Reveal } from '@/components/Reveal'
import { Workflows } from '@/components/Workflows'
import { SITE } from '@/content/site'
import { homeSchema } from '@/lib/seo'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    title: SITE.seoTitle,
    description: SITE.seoDescription,
    url: '/',
    images: [{ url: '/og-home.png', width: 1200, height: 630, alt: `${SITE.name}: ${SITE.tagline}` }],
  },
  twitter: { title: SITE.seoTitle, description: SITE.seoDescription, images: ['/og-home.png'] },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeSchema} />
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <Workflows />
        <HowItRuns />
        <OsHub />
        <Control />
        <Impact />
        <CaseStudySection />
        <AnchorClient />
        <HomeFaq />
      </main>
      <Footer />
      <Reveal />
      <DeferredPhotos />
    </>
  )
}
