'use client'

import { useEffect } from 'react'

/**
 * One observer for every [data-rv] element on the page. Elements reveal once and
 * siblings entering together stagger. After the reveal the attribute is removed, so
 * the element's own hover transitions run with no delay.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('rv-ready')
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, i) => {
            const el = entry.target as HTMLElement
            observer.unobserve(el)
            el.style.setProperty('--i', String(Math.min(i, 7)))
            el.classList.add('in')
            window.setTimeout(() => {
              el.removeAttribute('data-rv')
              el.classList.remove('in')
              el.style.removeProperty('--i')
            }, 1400)
          })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.04 },
    )
    document.querySelectorAll('[data-rv]:not(.cs [data-rv])').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
