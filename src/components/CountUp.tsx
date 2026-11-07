'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

const format = (n: number) => Math.round(n).toLocaleString('en-IN')

/** Renders the final number on the server, then counts up once the first time it scrolls into view. */
export function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(to)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(to * 0.6, to, { duration: 0.9, ease: [0.23, 1, 0.32, 1], onUpdate: setValue })
    return () => controls.stop()
  }, [inView, reduce, to])

  return (
    <span ref={ref} className="num">
      {format(value)}
    </span>
  )
}
