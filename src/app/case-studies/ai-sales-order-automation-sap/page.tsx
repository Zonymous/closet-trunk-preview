import type { Metadata } from 'next'
import '../case-study.css'
import { CaseStudyEffects } from '@/components/CaseStudyEffects'
import { Footer } from '@/components/Footer'
import { CaseStudyArticle } from '@/components/generated/CaseStudyArticle'
import { JsonLd } from '@/components/JsonLd'
import { Nav } from '@/components/Nav'
import { CASE_STUDY, SITE } from '@/content/site'
import { caseStudySchema } from '@/lib/seo'

export const metadata: Metadata = {
  title: CASE_STUDY.seoTitle,
  description: CASE_STUDY.description,
  keywords: CASE_STUDY.keywords,
  alternates: { canonical: CASE_STUDY.href },
  openGraph: {
    title: CASE_STUDY.seoTitle,
    description: CASE_STUDY.description,
    url: CASE_STUDY.href,
    type: 'article',
    publishedTime: CASE_STUDY.published,
    modifiedTime: CASE_STUDY.modified,
    authors: [SITE.name],
    images: [{ url: CASE_STUDY.thumbnail, width: 1200, height: 630, alt: CASE_STUDY.title }],
  },
  twitter: {
    title: CASE_STUDY.seoTitle,
    description: CASE_STUDY.description,
    images: [CASE_STUDY.thumbnail],
  },
}

export default function CaseStudyPage() {
  return (
    <div className="cs-page">
      <JsonLd data={caseStudySchema} />
      <Nav home={false} />
      <main>
        <CaseStudyArticle />
      </main>
      <Footer home={false} anonymous />
      <CaseStudyEffects />
    </div>
  )
}
