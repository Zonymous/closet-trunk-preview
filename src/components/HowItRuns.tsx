import { DrawingFrame, SectionHeading } from './Heading'
import { HowItRunsDesktop, HowItRunsMobile } from './generated/HowItRunsDrawings'

export function HowItRuns() {
  return (
    <section className="sec fs k" id="how">
      <div className="wrap">
        <SectionHeading
          legend={
            <>
              <span>
                <i />
                Outside world
              </span>
              <span>
                <i className="agent" />
                Language model <em>(reads and drafts)</em>
              </span>
              <span>
                <i className="ret" />
                Retrieval <em>(looks up your own records)</em>
              </span>
              <span>
                <i className="rule" />
                Fixed rules
              </span>
              <span>
                <i className="person" />A person signs
              </span>
              <span>
                <i className="erp" />
                Your ERP
              </span>
              <span>
                <i className="conn" />
                Connector <em>(SAP&rsquo;s own interfaces)</em>
              </span>
            </>
          }
        >
          How a workflow runs
        </SectionHeading>
        <DrawingFrame desktop={<HowItRunsDesktop />} mobile={<HowItRunsMobile />} />
      </div>
    </section>
  )
}
