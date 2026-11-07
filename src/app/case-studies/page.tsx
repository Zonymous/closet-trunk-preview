import type { Metadata } from 'next'
import { CaseStudyCard } from '@/components/CaseStudySection'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { Nav } from '@/components/Nav'
import { Reveal } from '@/components/Reveal'
import { caseStudiesSchema } from '@/lib/seo'

const title = 'Manufacturing AI Case Studies'
const description = 'How AI agents and SAP automation work on real manufacturing desks: what we built, what went wrong, and what we measured.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/case-studies' },
  openGraph: { title, description, url: '/case-studies', images: [{ url: '/og-home.png', width: 1200, height: 630, alt: title }] },
  twitter: { title, description, images: ['/og-home.png'] },
}

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd data={caseStudiesSchema} />
      <Nav home={false} />
      <main>
        <header className="csi-hero">
          <div className="wrap">
            <h1>
              Manufacturing AI case studies<span className="dot">.</span>
            </h1>
            <p>What we built on real desks, what went wrong along the way, and what we measured.</p>
          </div>
        </header>
        <section className="sec t csi-list" aria-label="All case studies">
          <div className="wrap">
            <CaseStudyCard first />
          </div>
        </section>
      </main>
      <Footer home={false} anonymous />
      <Reveal />
    </>
  )
}
