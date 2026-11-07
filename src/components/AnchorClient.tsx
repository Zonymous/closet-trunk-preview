import { SectionHeading } from './Heading'
import { CountUp } from './CountUp'

const COMPANIES = [
  { code: 'Yarn & knitwear', name: 'Nahar Spinning Mills', about: 'Among India’s largest cotton-yarn exporters.' },
  { code: 'BOPP film', name: 'Nahar Poly Films', about: 'Packaging and label film, sold in India and exported.' },
]

export function AnchorClient() {
  return (
    <section className="sec gp" id="group">
      <div className="gp-stage" data-bg="--u2" aria-hidden="true" />
      <div className="gp-wash" aria-hidden="true" />
      <div className="wrap">
        <SectionHeading>Our anchor client</SectionHeading>
        <div className="grp two">
          {COMPANIES.map((company) => (
            <div className="gco" key={company.name} data-rv="">
              <span className="code">{company.code}</span>
              <h3>{company.name}</h3>
              <p>{company.about}</p>
              <div className="lst">
                <b>NSE &middot; BSE</b> listed
              </div>
            </div>
          ))}
        </div>
        <div className="gfacts">
          <div data-rv="">
            <b>1949</b>
            <small>group founded</small>
          </div>
          <div data-rv="">
            <b>
              &#8377;<CountUp to={7000} /> Cr+
            </b>
            <small>group revenue</small>
          </div>
          <div data-rv="">
            <b>Export house</b>
            <small>recognised for cotton-yarn exports</small>
          </div>
          <div data-rv="">
            <b>India</b>
            <small>headquartered, exporting worldwide</small>
          </div>
        </div>
        <p className="gwhy" data-rv="">
          Built inside Nahar Group&rsquo;s plants: on their orders, their ERP and their desks, signed for by the people who run them. What works there is built for any plant that runs an ERP.
        </p>
      </div>
    </section>
  )
}
