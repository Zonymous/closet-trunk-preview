import { HeroDesk } from './HeroDesk'
import { SITE } from '@/content/site'

const PHOTOS = ['--u1', '--u2', '--u3', '--u4', '--u5']
const LINES = ['Ring spinning', 'Weaving', 'Dyeing and finishing', 'Film line', 'Winding and dispatch']

export function Hero() {
  return (
    <header className="hero" id="top">
      <div className="stage" style={{ backgroundImage: 'var(--u1)' }} aria-hidden="true">
        {PHOTOS.map((photo, i) =>
          i === 0 ? <div key={photo} className="fr" style={{ backgroundImage: `var(${photo})` }} /> : <div key={photo} className="fr" data-bg={photo} />,
        )}
      </div>
      <div className="wash" aria-hidden="true" />
      <div className="wrap">
        <div className="hgrid">
          <div className="hero-words">
            <p className="hpre">Built with Nahar Group, our anchor client</p>
            <h1>
              <span className="l1">The agentic OS</span> for manufacturing<span className="dot">.</span>
            </h1>
            <p className="hsub">
              Manufacturing still runs on people carrying work between documents, decisions and the ERP. {SITE.name} hands that work to teams of AI agents on one deterministic core: the agents bring judgement, the core enforces every check, guardrail and record, and nothing is committed without a person&rsquo;s approval.
            </p>
            <div className="hcta">
              <a className="btn wht" href="#how">
                How it works
              </a>
              <a className="btn ghost" href="#workflows">
                The workflows
              </a>
            </div>
          </div>
          <HeroDesk />
        </div>
        <div className="ticker">
          <div className="tk" aria-hidden="true">
            {LINES.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div className="dots" aria-hidden="true">
            {LINES.map((line) => (
              <i key={line} />
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
