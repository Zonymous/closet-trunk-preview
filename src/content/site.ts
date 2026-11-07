// Brand and navigation in one place. To use the other brand, change `name` and `mark` here.
export const SITE = {
  name: 'Weftwerk',
  mark: 'weftwerk' as 'weftwerk' | 'closet-trunk',
  tagline: 'The agentic OS for manufacturing',
  seoTitle: 'Agentic AI for Manufacturing and SAP | Weftwerk',
  seoDescription:
    'Weftwerk runs teams of AI agents on manufacturing workflows in SAP, from order to cash to procure to pay. Rules check every step and a person signs every write.',
  description:
    'Teams of AI agents on one deterministic core: the agents bring judgement, the core enforces every check, guardrail and record, and nothing is committed without a person’s approval.',
  email: 'hello@zonymouslabs.com',
  year: 2026,
}

export const NAV_LINKS = [
  { id: 'workflows', label: 'Workflows' },
  { id: 'how', label: 'How it works' },
  { id: 'os', label: 'The OS' },
  { id: 'control', label: 'Control' },
  { id: 'impact', label: 'Impact' },
  { id: 'case-study', label: 'Case study' },
  { id: 'group', label: 'Anchor client' },
]

export const CASE_STUDY = {
  href: '/case-studies/ai-sales-order-automation-sap',
  thumbnail: '/case-studies/ai-sales-order-automation-sap-thumbnail.png',
  images: [
    '/case-studies/ai-sales-order-automation-sap-16x9.png',
    '/case-studies/ai-sales-order-automation-sap-4x3.png',
    '/case-studies/ai-sales-order-automation-sap-1x1.png',
  ],
  title: 'How we automated SAP sales order entry with AI',
  seoTitle: 'AI Sales Order Automation in SAP: A Case Study',
  description:
    'How we built AI sales order automation in SAP for a packaging film manufacturer: any order format in, a person approves, one clean contract out.',
  published: '2026-11-07T12:00:00+05:30',
  modified: '2026-11-07T12:00:00+05:30',
  keywords: ['AI sales order automation', 'SAP sales order automation', 'order entry automation', 'AI order entry', 'purchase order to sales order automation', 'agentic AI in manufacturing'],
  summary:
    'A case study in AI sales order automation at a leading packaging film manufacturer: orders arrive in any format, a person approves them, and SAP gets one clean sales contract.',
  tags: ['BOPP film', 'SAP', '15 min read'],
  points: [
    { title: 'Any format', text: 'Phone photos, PDFs, spreadsheets and emails fill the order form.' },
    { title: 'Learns each customer', text: 'Their shorthand is remembered, so film grades get easier to match.' },
    { title: 'A person approves', text: 'Nothing reaches SAP until someone has checked and signed it.' },
  ],
}
