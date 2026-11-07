import { CASE_STUDY, SITE } from '@/content/site'
import { CASE_STUDY_FAQ } from '@/components/generated/caseStudyFaq'
import { HOME_FAQ } from '@/content/homeFaq'

/**
 * The public address. Until NEXT_PUBLIC_SITE_URL is set the site asks search engines
 * to stay away, so a preview can never be indexed with the wrong canonical address.
 */
const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
export const SITE_URL = configured ?? 'http://localhost:3000'
export const INDEXABLE = Boolean(configured)

export const absolute = (path: string) => `${SITE_URL}${path}`

const organization = {
  '@type': 'Organization',
  '@id': absolute('/#organization'),
  name: SITE.name,
  url: absolute('/'),
  logo: absolute('/icon-512.png'),
  email: SITE.email,
  description: SITE.description,
  knowsAbout: ['Agentic AI', 'AI agents for manufacturing', 'SAP automation', 'Sales order automation', 'Order to cash', 'Procure to pay'],
}

const faqPage = (items: { question: string; answer: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
})

export const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    organization,
    {
      '@type': 'WebSite',
      '@id': absolute('/#website'),
      name: SITE.name,
      url: absolute('/'),
      inLanguage: 'en',
      publisher: { '@id': absolute('/#organization') },
    },
    {
      '@type': 'SoftwareApplication',
      name: SITE.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: absolute('/'),
      description: SITE.description,
      publisher: { '@id': absolute('/#organization') },
    },
    faqPage(HOME_FAQ),
  ],
}

const crumbs = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absolute(item.path),
  })),
})

export const caseStudiesSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    organization,
    crumbs([
      { name: 'Home', path: '/' },
      { name: 'Case studies', path: '/case-studies' },
    ]),
  ],
}

export const caseStudySchema = {
  '@context': 'https://schema.org',
  '@graph': [
    organization,
    {
      '@type': 'Article',
      '@id': absolute(`${CASE_STUDY.href}#article`),
      headline: CASE_STUDY.title,
      description: CASE_STUDY.description,
      image: CASE_STUDY.images.map((image) => absolute(image)),
      datePublished: CASE_STUDY.published,
      dateModified: CASE_STUDY.modified,
      inLanguage: 'en',
      articleSection: 'Case studies',
      keywords: CASE_STUDY.keywords.join(', '),
      author: { '@id': absolute('/#organization') },
      publisher: { '@id': absolute('/#organization') },
      mainEntityOfPage: absolute(CASE_STUDY.href),
    },
    crumbs([
      { name: 'Home', path: '/' },
      { name: 'Case studies', path: '/case-studies' },
      { name: 'SAP sales order automation', path: CASE_STUDY.href },
    ]),
    faqPage(CASE_STUDY_FAQ),
  ],
}
