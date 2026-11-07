'use client'

import { useEffect, useRef, useState } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { Logo } from './Logo'
import { NAV_LINKS } from '@/content/site'

/**
 * The source's nav, plus three behaviours:
 * - after the hero it returns as a compact bar that follows the reader;
 * - it hides on scroll down and comes back on scroll up;
 * - a pill slides to whichever section is on screen.
 */
export function Nav({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const lastY = useRef(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        const threshold = Math.max(window.innerHeight * 0.7, 420)
        setStuck(y > threshold)
        if (Math.abs(y - lastY.current) > 6) {
          setHidden(y > threshold && y > lastY.current)
          lastY.current = y
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!home) return
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter((s): s is HTMLElement => Boolean(s))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
          else setActive((current) => (current === entry.target.id ? null : current))
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [home])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const classes = ['nav', open && 'open', stuck && 'stuck', stuck && hidden && !open && 'away'].filter(Boolean).join(' ')

  return (
    <nav className={classes}>
      <div className="nav-in">
        <Logo />
        <div className="sp" />
        <button
          className="menu-btn"
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="site-links"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <LayoutGroup>
          <div className="links" id="site-links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={home ? `#${link.id}` : `/#${link.id}`}
                aria-current={active === link.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {active === link.id && (
                  <motion.span
                    className="link-pill"
                    layoutId="nav-pill"
                    transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.12 }}
                  />
                )}
                <span className="link-label">{link.label}</span>
              </a>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </nav>
  )
}
