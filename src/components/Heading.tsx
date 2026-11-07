import type { ReactNode } from 'react'

/** Every section heading ends in the cobalt full stop. */
export function SectionHeading({ children, legend, legendClass = '' }: { children: ReactNode; legend?: ReactNode; legendClass?: string }) {
  return (
    <div className="hd">
      <h2 data-rv="">
        {children}
        <span className="dot">.</span>
      </h2>
      {legend ? (
        <div className={`legend ${legendClass}`.trim()} data-rv="">
          {legend}
        </div>
      ) : null}
    </div>
  )
}

/** Desktop and portrait versions of one drawing, swapped by the source's d-only / m-only classes. */
export function DrawingFrame({ desktop, mobile }: { desktop: ReactNode; mobile: ReactNode }) {
  return (
    <>
      <div className="dgwrap d-only" data-rv="wipe">
        {desktop}
      </div>
      <div className="dgwrap m-only m-full" data-rv="">
        {mobile}
      </div>
    </>
  )
}
