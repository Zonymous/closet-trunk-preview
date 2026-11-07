import Link from 'next/link'
import { SectionHeading } from './Heading'
import { CaseStudyThumbnail } from './generated/CaseStudyThumbnail'
import { CASE_STUDY } from '@/content/site'

/** `first` is for a card on the first screen, which must paint without waiting for scripts. */
export function CaseStudyCard({ first = false }: { first?: boolean }) {
  const Title = first ? 'h2' : 'h3'
  return (
    <Link className="csc" href={CASE_STUDY.href} {...(first ? {} : { 'data-rv': '' })}>
      <span className="csc-art">
        <CaseStudyThumbnail />
      </span>
      <span className="csc-text">
        <span className="csc-tags">
          {CASE_STUDY.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </span>
        <Title className="csc-title">{CASE_STUDY.title}</Title>
        <span className="csc-sum">{CASE_STUDY.summary}</span>
        <span className="csc-points">
          {CASE_STUDY.points.map((point) => (
            <span key={point.title}>
              <b>{point.title}</b>
              <small>{point.text}</small>
            </span>
          ))}
        </span>
        <span className="csc-go">
          Read the case study <span aria-hidden="true">&rarr;</span>
        </span>
      </span>
    </Link>
  )
}

export function CaseStudySection() {
  return (
    <section className="sec fs t" id="case-study">
      <div className="wrap">
        <SectionHeading>Case study</SectionHeading>
        <CaseStudyCard />
      </div>
    </section>
  )
}
