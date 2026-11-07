import { SectionHeading } from './Heading'
import { AutomationSavingChart, CostPerInvoiceChart, DaysPerInvoiceChart } from './generated/ImpactCharts'

const OUTCOMES = [
  { code: 'O2C', text: 'An emailed order becomes a sales order the same morning, every field traced to the PO.' },
  { code: 'EXIM', text: 'Letter-of-credit discrepancies are caught before the documents reach the bank.' },
  { code: 'P2P', text: 'Only the invoices that fail the three-way match reach a person.' },
  { code: 'R2R', text: 'Month-end starts from books that were reconciled every day.' },
  { code: 'PP', text: 'The plan is redone the same day a frame stops or a material slips.' },
  { code: 'IM · QM', text: 'Every lot is checked against its test certificate at the gate.' },
]

export function Impact() {
  return (
    <section className="sec fs" id="impact">
      <div className="wrap">
        <SectionHeading>What it changes</SectionHeading>
        <h3 className="im-tier" data-rv="">
          Across the industry
        </h3>
        <div className="imp im-three">
          <div data-rv="">
            <CostPerInvoiceChart />
          </div>
          <div data-rv="">
            <DaysPerInvoiceChart />
          </div>
          <div data-rv="">
            <AutomationSavingChart />
          </div>
        </div>
        <h3 className="im-tier" data-rv="">
          For one company
        </h3>
        <ul className="im-list">
          {OUTCOMES.map((item) => (
            <li key={item.code} data-rv="">
              <span className="im-code">{item.code}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
