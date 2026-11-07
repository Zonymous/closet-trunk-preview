import { DrawingFrame, SectionHeading } from './Heading'
import { OsHubDesktop, OsHubMobile } from './generated/OsHubDrawings'

export function OsHub() {
  return (
    <section className="sec fs" id="os">
      <div className="wrap">
        <SectionHeading
          legend={
            <>
              <span>
                <i className="team" />
                Workflow agent team
              </span>
              <span>
                <i className="platform" />
                Platform agent
              </span>
              <span>
                <i className="bus" />
                The OS
              </span>
              <span>
                <i className="person" />
                Your team
              </span>
              <span>
                <i className="erp" />
                Your ERP
              </span>
              <span>
                <i />
                Mail &middot; drives &middot; portals
              </span>
              <span>
                <i className="conn" />
                Connector
              </span>
            </>
          }
        >
          One OS. Many teams of agents
        </SectionHeading>
        <DrawingFrame desktop={<OsHubDesktop />} mobile={<OsHubMobile />} />
      </div>
    </section>
  )
}
