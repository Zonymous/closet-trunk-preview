import { Logo } from './Logo'
import { NAV_LINKS, SITE } from '@/content/site'

/** `anonymous` drops the line that names the client, for pages that must not identify them. */
export function Footer({ home = true, anonymous = false }: { home?: boolean; anonymous?: boolean }) {
  return (
    <footer>
      <div className="wrap">
        <div className="ft-top">
          <div className="ft-brand">
            <Logo />
            <p className="ft-line">The agentic OS for manufacturing.</p>
          </div>
          <nav className="ft-links" aria-label="Sections">
            {NAV_LINKS.map((link) => (
              <a key={link.id} href={home ? `#${link.id}` : `/#${link.id}`}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="ft-cos">
            <span className="ft-k">Company</span>
            <span>Aconomy Labs &middot; Canada</span>
            <span>Zonymous Labs &middot; India</span>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>
        <div className="ft-bot">
          <p className="src">
            {anonymous
              ? 'Client details are withheld. Product names and logos belong to their owners and indicate compatibility, not endorsement.'
              : 'Product views show a run on our anchor client’s ERP; names and amounts are illustrative. Photographs via Unsplash; they show comparable plant, not Nahar Group facilities. Product names and logos belong to their owners and indicate compatibility, not endorsement.'}
          </p>
          <span className="ft-copy">
            &copy; {SITE.year} {SITE.name}
          </span>
        </div>
      </div>
    </footer>
  )
}
