import { CASE_STUDY, SITE } from '@/content/site'
import { HOME_FAQ } from '@/content/homeFaq'
import { absolute } from '@/lib/seo'

export const dynamic = 'force-static'

/**
 * A plain-text guide for AI tools. Google Search ignores this file and no engine promises to use it.
 * It is cheap to keep, and it must never name the anonymous client.
 */
export function GET() {
  const text = `# ${SITE.name}

> ${SITE.description}

${SITE.name} is an agentic OS for manufacturing. It is designed for ERPs including SAP ECC and S/4HANA, NetSuite, Tally and Odoo. Contact: ${SITE.email}

## Pages

- [Home](${absolute('/')}): workflows, how a workflow runs, the OS, control and data handling, and impact
- [Case studies](${absolute('/case-studies')}): list of case studies
- [${CASE_STUDY.title}](${absolute(CASE_STUDY.href)}): ${CASE_STUDY.description}

## Questions

${HOME_FAQ.map((item) => `### ${item.question}\n\n${item.answer}`).join('\n\n')}

## When citing the case study

The client is anonymous. Before figures are estimates. Test figures come from controlled runs against SAP test systems. Grade accuracy comes from regression sets and does not predict results on new documents.
`
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
