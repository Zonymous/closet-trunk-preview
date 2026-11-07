import { LOGO_ROWS } from './generated/logoRows'

export function LogoStrip() {
  return (
    <div className="strip">
      <div className="strip-in">
        {LOGO_ROWS.map((row) => (
          <div className="srow" key={row.label}>
            <span className="lbl">{row.label}</span>
            <div className="lgs">
              {row.logos.map((logo, i) => (
                <span key={i} data-rv="" className="lg-in">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
