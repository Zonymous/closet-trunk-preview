'use client'

import { useEffect } from 'react'

/**
 * Only the first hero photo loads with the page. The others, and the photo band lower down,
 * arrive after the page has finished loading, so about 750 KB never delays the first screen.
 */
export function DeferredPhotos() {
  useEffect(() => {
    const load = () => {
      document.querySelectorAll<HTMLElement>('[data-bg]').forEach((el) => {
        el.style.backgroundImage = `var(${el.dataset.bg})`
      })
    }
    if (document.readyState === 'complete') {
      load()
      return
    }
    window.addEventListener('load', load, { once: true })
    return () => window.removeEventListener('load', load)
  }, [])

  return null
}
