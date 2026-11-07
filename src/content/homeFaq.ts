import { SITE } from './site'

// Every answer repeats what the page already says. The FAQ markup reads from this list too.
export const HOME_FAQ = [
  {
    question: 'What is an agentic OS for manufacturing?',
    answer: `Software that hands the work people carry between documents, decisions and the ERP to teams of AI agents on one deterministic core. In ${SITE.name}, the agents bring judgement, the core enforces every check, guardrail and record, and nothing is committed without a person’s approval.`,
  },
  {
    question: 'Which ERP does it work with?',
    answer: 'It is designed for ERPs including SAP ECC and S/4HANA, NetSuite, Tally and Odoo, and connects to SAP through SAP’s own interfaces. It also reads from and writes to tools such as Outlook, SharePoint and Excel. Your ERP stays the system of record.',
  },
  {
    question: 'Which manufacturing workflows can AI agents handle?',
    answer: 'The six covered here are Order to Cash, Export and Trade Documentation, Procure to Pay, Record to Report, Production Planning, and Inventory and Quality. We take them one desk at a time, each measured before the next.',
  },
  {
    question: 'Can the AI change our ERP without approval?',
    answer: 'No. Text inside a PO or an email cannot make anything happen in SAP, and a person confirms every write. An agent can do only what the signed-in person may do, and the audit trail shows who confirmed.',
  },
  {
    question: 'Does the AI model provider keep our data?',
    answer: 'It receives what one step needs and stores none of it, and nothing is trained on your data. Your records are held separately from every other customer’s, under their own keys.',
  },
  {
    question: 'Is it SOC 2 or ISO 27001 certified?',
    answer: 'Not yet. SOC 2 and ISO 27001 audits are pending. A data-processing agreement covers every customer, and personal data is handled under India’s Digital Personal Data Protection Act.',
  },
]
