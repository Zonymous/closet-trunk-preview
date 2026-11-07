// Scroll behaviour for the case study. Inlined in the standalone file and imported by the Next.js route.
export function startCaseStudyEffects(root = document) {
  const cleanups = []
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // reveal once, with a short stagger between siblings that enter together
  const items = [...root.querySelectorAll('.cs [data-rv]')]
  const reveal = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          e.target.style.setProperty('--i', String(Math.min(i, 6)))
          e.target.classList.add('in')
          reveal.unobserve(e.target)
          // drop the delay afterwards so hover transitions on the element stay immediate
          setTimeout(() => {
            e.target.style.removeProperty('--i')
            e.target.removeAttribute('data-rv')
            e.target.classList.add('done')
          }, 1300)
        })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  )
  items.forEach((el) => reveal.observe(el))
  cleanups.push(() => reveal.disconnect())

  // reading progress: transform only, written once per frame
  const bar = root.querySelector('[data-cs-progress]')
  if (bar) {
    let queued = false
    const paint = () => {
      queued = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`
    }
    const onScroll = () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(paint)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    paint()
    cleanups.push(() => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    })
  }

  // chapter list follows the reader
  const links = [...root.querySelectorAll('[data-cs-toc]')]
  const chapters = links.map((l) => root.getElementById?.(l.dataset.csToc) ?? document.getElementById(l.dataset.csToc)).filter(Boolean)
  if (chapters.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e) => links.forEach((l) => l.classList.toggle('on', l.dataset.csToc === e.target.id)))
      },
      { rootMargin: '-30% 0px -65% 0px' },
    )
    chapters.forEach((c) => spy.observe(c))
    cleanups.push(() => spy.disconnect())
  }

  void reduced

  // share links need the page's real address, so they appear only on a hosted page
  const share = root.querySelector('[data-cs-share]')
  if (share && /^https?:$/.test(location.protocol)) {
    const url = location.origin + location.pathname
    const text = encodeURIComponent(document.title)
    share.querySelector('[data-share="linkedin"]').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    share.querySelector('[data-share="x"]').href = `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${text}`
    const copy = share.querySelector('[data-share="copy"]')
    let timer
    const onCopy = async () => {
      try {
        await navigator.clipboard.writeText(url)
        copy.textContent = 'Copied'
      } catch {
        copy.textContent = url
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        copy.textContent = 'Copy link'
      }, 1800)
    }
    copy.addEventListener('click', onCopy)
    share.hidden = false
    cleanups.push(() => {
      clearTimeout(timer)
      copy.removeEventListener('click', onCopy)
    })
  }

  return () => cleanups.forEach((fn) => fn())
}
