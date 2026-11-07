import { SectionHeading } from './Heading'
import { CONTROL_BADGES, CONTROL_TILES } from './generated/controlData'
import { DataBoundaryDesktop, DataBoundaryMobile } from './generated/DataBoundaryDrawings'

export function Control() {
  return (
    <section className="sec fs g" id="control">
      <div className="wrap">
        <SectionHeading>Who signs, and where the data stays</SectionHeading>
        <div className="cgrid">
          <div className="bx" data-rv="">
            <h3>What leaves your environment</h3>
            <span className="d-only">
              <DataBoundaryDesktop />
            </span>
            <span className="m-only">
              <DataBoundaryMobile />
            </span>
            <p className="cnote">
              A data-processing agreement covers every customer, and your records are deleted when you leave. SOC&nbsp;2 and ISO&nbsp;27001 audits are pending. Personal data is handled under India&rsquo;s Digital Personal Data Protection Act.
            </p>
          </div>
          <div className="ctl">
            {CONTROL_TILES.map((tile) => (
              <div className="ctile" key={tile.title} data-rv="">
                <span className="ic">{tile.icon}</span>
                <b>{tile.title}</b>
                <p>{tile.body}</p>
                <div className="mini">
                  <span>{tile.mini[0]}</span>
                  <span className={tile.tone || undefined}>{tile.mini[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="badges">
          {CONTROL_BADGES.map((badge) => (
            <div className="badge" key={badge.title} data-rv="">
              <span className="ic">{badge.icon}</span>
              <span className="bt">
                <b>{badge.title}</b>
                <small>{badge.body}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
