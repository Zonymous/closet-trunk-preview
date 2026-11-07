import { SectionHeading } from './Heading'
import { HOME_FAQ } from '@/content/homeFaq'

/** Open by default: an answer hidden behind a click is harder for people and answer engines to find. */
export function HomeFaq() {
  return (
    <section className="sec fq" id="faq">
      <div className="wrap">
        <SectionHeading>Questions about AI agents for manufacturing</SectionHeading>
        <div className="fq-grid">
          {HOME_FAQ.map((item) => (
            <div className="fq-item" key={item.question} data-rv="">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
