// Compares the built app with the source page, and checks behaviour and anonymity.
// Usage: start the app (npm run build && npx next start -p 3457), then
//   node scripts/verify.mjs <screenshot-dir>
import { chromium } from 'playwright'
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = process.argv[2] || join(root, '.verify')
mkdirSync(out, { recursive: true })
const APP = process.env.VERIFY_URL || 'http://localhost:3457'
const SLUG = 'ai-sales-order-automation-sap'
const CASE = `${APP}/case-studies/${SLUG}`
const source = pathToFileURL(join(root, readdirSync(root).find((f) => f.endsWith('.html') && f !== 'index.html'))).href
const standalone = pathToFileURL(join(root, 'case-study/ai-sales-order-automation-sap-case-study.html')).href

// Names the article must never contain, one regex alternation in a file kept out of git.
const bannedFile = join(root, '.verify-banned.txt')
if (!existsSync(bannedFile)) console.log('NOTE  .verify-banned.txt is missing, so the anonymity checks only look for the placeholder')
const localBanned = new RegExp(`(${existsSync(bannedFile) ? readFileSync(bannedFile, 'utf8').trim() : 'client-name-placeholder'})`, 'gi')

const browser = await chromium.launch()
const results = []
const check = (name, ok, detail = '') => {
  results.push(ok)
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`)
}
const COUNT = ['svg', 'animateMotion', '.wc', '.wf-p', '.ctile', '.badge', '.gco', '.gfacts > div', '.im-list li', '.lg', '.fr', '.tk span', '.hd-m', 'a[href^="#"]']
const snapshot = (page) =>
  page.evaluate((sel) => {
    const counts = Object.fromEntries(sel.map((s) => [s, document.querySelectorAll(s).length]))
    const text = document.body.innerText + ' ' + [...document.querySelectorAll('svg text, [hidden], .more, .d-only, .m-only')].map((e) => e.textContent).join(' ')
    return { counts, text: text.replace(/\s+/g, ' ') }
  }, COUNT)

async function settle(page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    const h = document.documentElement.scrollHeight
    for (let y = 0; y < h; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1600)
}

// ---- 1. parity with the source ----
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const src = await ctx.newPage()
await src.goto(source)
const a = await snapshot(src)
const app = await ctx.newPage()
const errors = []
app.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
app.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))
app.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`))
await app.goto(APP, { waitUntil: 'networkidle' })
const b = await snapshot(app)
for (const s of COUNT) {
  // two new "Case study" links (nav, footer), and the two logos now point at /#top
  const extra = 0
  const allowed = s === 'svg' ? 1 : 0 // the case study thumbnail
  const same = b.counts[s] === a.counts[s] + extra + allowed
  check(`count ${s}`, same, `source ${a.counts[s]} app ${b.counts[s]}`)
}
const leafTexts = (page) =>
  page.evaluate(() => {
    const out = new Set()
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const n = walker.currentNode
      if (['SCRIPT', 'STYLE'].includes(n.parentElement.tagName)) continue
      const t = n.textContent.replace(/\s+/g, ' ').trim()
      if (t) out.add(t)
    }
    const labels = [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label'))
    return { texts: [...out], labels }
  })
const ta = await leafTexts(src)
const tb = await leafTexts(app)
const appAll = tb.texts.join(' ¦ ').replace(/\s+/g, ' ')
const appWhole = await app.evaluate(() => (document.title + ' ' + document.body.textContent).replace(/\s+/g, ' '))
// the source's page title was rewritten on purpose for search
const missing = ta.texts.filter((t) => !appAll.includes(t) && !appWhole.includes(t) && !t.endsWith('· The agentic OS for manufacturing'))
check('every source text node appears in the app', missing.length === 0, `${ta.texts.length} text nodes; missing: ${missing.join(' | ')}`)
const missingLabels = ta.labels.filter((l) => !tb.labels.includes(l) && !l.includes('The the OS'))
check('every accessibility label carried over', missingLabels.length === 0, missingLabels.join(' | '))

// layout parity: every key element keeps its column and width; vertical spacing was opened up on purpose
const RECTS = '.hd h2, .wc, .dgwrap, .bx, .ctile, .badge, .imp > div, .im-list li, .gco, .gfacts > div, .wclose, .im-tier, .gwhy, .hd-desk, h1, .hsub, .hcta .btn, .ticker, .srow'
const rects = (page) =>
  page.evaluate((sel) => {
    document.documentElement.style.scrollSnapType = 'none'
    return [...document.querySelectorAll(sel)]
      .filter((e) => e.getClientRects().length && !e.closest('#case-study, #faq'))
      .map((e) => {
        const r = e.getBoundingClientRect()
        const sec = e.closest('section,header,.strip').getBoundingClientRect()
        return { k: (e.className.baseVal ?? e.className ?? e.tagName).toString().split(' ').slice(0, 2).join('.') || e.tagName, x: Math.round(r.left), y: Math.round(r.top - sec.top), w: Math.round(r.width), h: Math.round(r.height) }
      })
  }, RECTS)
for (const [label, w, h] of [['1440x900', 1440, 900], ['1280x720', 1280, 720], ['820x1100', 820, 1100], ['390x844', 390, 844]]) {
  await src.setViewportSize({ width: w, height: h })
  await app.setViewportSize({ width: w, height: h })
  await settle(src)
  await settle(app)
  const ra = await rects(src)
  const rb = await rects(app)
  const bad = ra
    .map((r, i) => ({ r, o: rb[i] }))
    .filter(({ r, o }) => !o || Math.abs(r.x - o.x) > 2 || Math.abs(r.w - o.w) > 2)
  check(`layout matches at ${label}`, ra.length === rb.length && bad.length === 0, `${ra.length}/${rb.length} elements; off: ${bad.slice(0, 5).map(({ r, o }) => `${r.k} ${JSON.stringify(r)} vs ${JSON.stringify(o)}`).join(' ; ')}`)
}
await src.setViewportSize({ width: 1440, height: 900 })
await app.setViewportSize({ width: 1440, height: 900 })

// ---- 2. side by side screenshots ----
const sections = ['top', 'workflows', 'how', 'os', 'control', 'impact', 'group']
for (const [label, page] of [['source', src], ['app', app]]) {
  await settle(page)
  await page.evaluate(() => {
    document.documentElement.style.scrollSnapType = 'none'
    const h = document.querySelector('header.hero')
    if (h) h.id = h.id || 'top'
  })
  for (const id of sections) {
    const el = page.locator(`#${id}`)
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(250)
    await el.screenshot({ path: join(out, `d-${id}-${label}.png`), animations: 'disabled' })
  }
}
const photos = await app.evaluate(() => [...document.querySelectorAll('[data-bg]')].filter((e) => getComputedStyle(e).backgroundImage.includes('plant-')).length)
check('deferred photos loaded after the page', photos === 5, String(photos))
const unrevealed = await app.evaluate(() => [...document.querySelectorAll('[data-rv]')].filter((e) => e.getClientRects().length).map((e) => e.className || e.tagName))
check('every visible element finished its reveal', unrevealed.length === 0, unrevealed.slice(0, 6).join(' | '))
const clipped = await app.evaluate(() => [...document.querySelectorAll('.dgwrap svg')].filter((e) => e.getClientRects().length && !['none', 'inset(0px)'].includes(getComputedStyle(e).clipPath)).length)
check('no drawing left clipped', clipped === 0, String(clipped))
await app.evaluate(() => document.getElementById('control').scrollIntoView())
await app.waitForTimeout(500)
await app.evaluate(() => document.getElementById('case-study').scrollIntoView())
await app.waitForTimeout(1500)
const pill = await app.evaluate(() => {
  const current = document.querySelector('.links a[aria-current="true"]')
  const shape = document.querySelector('.link-pill')
  if (!current || !shape) return null
  const a = current.getBoundingClientRect()
  const b = shape.getBoundingClientRect()
  return { link: current.textContent, off: Math.round(Math.abs(a.left - b.left) + Math.abs(a.width - b.width)) }
})
check('nav pill settles on the current section', pill?.link === 'Case study' && pill.off <= 2, JSON.stringify(pill))
await app.locator('#case-study').screenshot({ path: join(out, 'd-case-study-band.png'), animations: 'disabled' })
await app.locator('footer').screenshot({ path: join(out, 'd-footer-app.png') })
await src.locator('footer').screenshot({ path: join(out, 'd-footer-source.png') })
await src.close()

// ---- 3. behaviour ----
await app.evaluate(() => window.scrollTo(0, 0))
await app.waitForTimeout(300)
const firstCard = app.locator('.wc').first()
await firstCard.click()
await app.waitForTimeout(600)
check('card opens its panel', (await firstCard.getAttribute('aria-expanded')) === 'true' && (await app.locator('#w-o2c').isVisible()))
const secondCard = app.locator('.wc').nth(1)
await secondCard.click()
await app.waitForTimeout(600)
check('opening another closes the first', (await firstCard.getAttribute('aria-expanded')) === 'false' && !(await app.locator('#w-o2c').isVisible()) && (await app.locator('#w-exim').isVisible()))
await app.locator('.wgrid').screenshot({ path: join(out, 'd-workflow-open.png') })
await secondCard.click()
await app.waitForTimeout(600)
check('clicking again closes it', !(await app.locator('#w-exim').isVisible()))
await app.evaluate(() => window.scrollTo(0, 3000))
await app.waitForTimeout(500)
check('nav is fixed after the hero', await app.locator('.nav.stuck').count().then((n) => n === 1))
await app.evaluate(() => window.scrollTo(0, 2700))
await app.waitForTimeout(500)
check('nav returns on scroll up', (await app.locator('.nav.away').count()) === 0)
await app.locator('.nav').screenshot({ path: join(out, 'd-nav-stuck.png') })
await app.evaluate(() => document.getElementById('case-study').scrollIntoView())
await app.waitForTimeout(1500)
const link = app.locator('a.csc')
await link.click()
await app.waitForURL('**/case-studies/**')
check('case study band links to the article', app.url().endsWith(`/case-studies/${SLUG}`))
// arriving by a link inside the site must load the article's styles as well
await app.waitForTimeout(800)
const nav = await app.evaluate(() => ({
  time: getComputedStyle(document.querySelector('.cs-time')).backgroundColor,
  row: getComputedStyle(document.querySelector('.cs-time tbody tr')).display,
}))
check('article is styled after an in-site click', nav.time === 'rgb(11, 11, 13)' && nav.row === 'grid', JSON.stringify(nav))
check('no console errors or failed requests', errors.length === 0, errors.slice(0, 5).join(' | '))
await ctx.close()

// ---- 4. no-script and reduced motion stay readable ----
const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } })
const nj = await noJs.newPage()
await nj.goto(APP)
check('without scripts content is visible', (await nj.locator('.wc').first().evaluate((e) => getComputedStyle(e).opacity)) === '1')
await nj.goto(CASE)
check('case study readable without scripts', (await nj.locator('.cs-ch p').nth(1).evaluate((e) => getComputedStyle(e).opacity)) === '1')
await noJs.close()
const rm = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } })
const rp = await rm.newPage()
await rp.goto(APP, { waitUntil: 'networkidle' })
check('reduced motion shows content at once', (await rp.locator('.ctile').first().evaluate((e) => getComputedStyle(e).opacity)) === '1')
await rm.close()

// ---- 5. phones and tablets: no sideways scroll ----
for (const [label, w, h] of [['phone', 390, 844], ['small', 360, 740], ['tablet', 820, 1100], ['laptop', 1280, 720]]) {
  const c = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: w < 900 })
  for (const [name, url] of [['home', APP], ['case', CASE], ['standalone', standalone]]) {
    const p = await c.newPage()
    await p.goto(url, { waitUntil: 'load' })
    await settle(p)
    const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    check(`${label} ${name} has no sideways scroll`, over <= 0, `overflow ${over}px`)
    if (w === 390) await p.screenshot({ path: join(out, `m-${name}.png`), fullPage: true })
    if (w === 390 && name === 'home') {
      await p.locator('.menu-btn').click()
      await p.waitForTimeout(250)
      check('phone menu opens', await p.locator('.links').isVisible())
      await p.screenshot({ path: join(out, 'm-menu.png') })
    }
    await p.close()
  }
  await c.close()
}

// ---- 6. the article ----
const cc = await browser.newContext({ viewport: { width: 1440, height: 900 } })
for (const [name, url] of [['case', CASE], ['standalone', standalone]]) {
  const p = await cc.newPage()
  const errs = []
  p.on('pageerror', (e) => errs.push(e.message))
  await p.goto(url, { waitUntil: 'load' })
  await settle(p)
  await p.screenshot({ path: join(out, `d-${name}.png`), fullPage: true })
  const text = await p.evaluate(() => document.documentElement.outerHTML.replace(/base64,[A-Za-z0-9+/=]+/g, '').replace(/<script[\s\S]*?<\/script>/g, ''))
  const banned = localBanned
  const hits = [...new Set(text.match(banned) || [])]
  check(`${name} names no client, person or order`, hits.length === 0, hits.join(', '))
  check(`${name} has no script errors`, errs.length === 0, errs.join(' | '))
  const prog = await p.evaluate(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight / 2)
    await new Promise((r) => setTimeout(r, 400))
    return document.querySelector('[data-cs-progress]').style.transform
  })
  check(`${name} progress bar follows scroll`, /scaleX\(0\.[3-7]/.test(prog), prog)
  const on = await p.locator('.cs-toc a.on').count()
  check(`${name} chapter list follows scroll`, on === 1)
  const bar = await p.locator('.cs-bar.on em').evaluate((e) => getComputedStyle(e).transform)
  check(`${name} accuracy bars filled`, bar === 'none' || bar.startsWith('matrix(1,'), bar)
  await p.close()
}
await cc.close()

// ---- 7. SEO ----
const expectIndexable = process.env.EXPECT_INDEXABLE === '1'
const seoCtx = await browser.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false })
const seo = await seoCtx.newPage()
for (const [name, path] of [['home', '/'], ['list', '/case-studies'], ['article', `/case-studies/${SLUG}`]]) {
  const res = await seo.goto(`${APP}${path}`)
  const d = await seo.evaluate(() => {
    const meta = (q) => document.querySelector(q)?.getAttribute('content') ?? null
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      robots: meta('meta[name="robots"]'),
      ogTitle: meta('meta[property="og:title"]'),
      ogImage: meta('meta[property="og:image"]'),
      twitter: meta('meta[name="twitter:card"]'),
      h1: document.querySelectorAll('h1').length,
      main: document.querySelectorAll('main').length,
      lang: document.documentElement.lang,
      schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map((e) => e.textContent),
      words: document.querySelector('main').innerText.split(/\s+/).length,
    }
  })
  check(`${name} returns 200 in plain HTML`, res.status() === 200 && d.words > 40, `${d.words} words`)
  check(`${name} title under 60 characters`, d.title.length <= 60, `${d.title.length}: ${d.title}`)
  check(`${name} description 70-160 characters`, !!d.description && d.description.length >= 70 && d.description.length <= 160, String(d.description?.length))
  check(`${name} has canonical, Open Graph and Twitter tags`, !!d.canonical && !!d.ogTitle && !!d.ogImage && !!d.twitter)
  check(`${name} has one h1, a main landmark and a language`, d.h1 === 1 && d.main === 1 && d.lang === 'en')
  check(`${name} structured data parses`, d.schema.length >= 1 && d.schema.every((t) => { try { JSON.parse(t); return true } catch { return false } }))
  check(`${name} index setting matches the environment`, expectIndexable ? d.robots?.startsWith('index') : d.robots?.startsWith('noindex'), String(d.robots))
  const img = await seo.request.get(new URL(d.ogImage, APP).pathname === d.ogImage ? `${APP}${d.ogImage}` : `${APP}${new URL(d.ogImage).pathname}`)
  check(`${name} preview image loads`, img.ok())
  if (name !== 'home') {
    const named = localBanned.test(JSON.stringify(d))
    localBanned.lastIndex = 0
    check(`${name} metadata names no client`, !named)
  }
}
const articleText = await (async () => {
  await seo.goto(CASE)
  return seo.evaluate(() => ({ heads: [...document.querySelectorAll('main h1, main h2, main h3')].map((h) => h.tagName + ':' + h.textContent), tables: document.querySelectorAll('main table').length, body: document.querySelector('main').innerText.toLowerCase() }))
})()
const levels = articleText.heads.map((h) => Number(h[1]))
check('article heading levels never skip', levels.every((l, i) => i === 0 || l <= levels[i - 1] + 1), levels.join(''))
check('article has real tables', articleText.tables === 3)
for (const kw of ['ai sales order automation', 'sales order automation', 'sap']) check(`article uses "${kw}"`, articleText.body.includes(kw))
for (const f of ['/robots.txt', '/llms.txt', '/sitemap.xml', '/manifest.webmanifest', '/icon.svg', '/apple-icon.png', '/icon-512.png']) {
  const r = await seo.request.get(`${APP}${f}`)
  check(`${f} is served`, r.ok(), String(r.status()))
}
const robotsText = await (await seo.request.get(`${APP}/robots.txt`)).text()
check('robots.txt matches the environment', expectIndexable ? /Allow: \//.test(robotsText) && /Sitemap:/.test(robotsText) : /Disallow: \//.test(robotsText), robotsText.replace(/\s+/g, ' '))
const sitemapText = await (await seo.request.get(`${APP}/sitemap.xml`)).text()
check('sitemap lists all three pages', (sitemapText.match(/<url>/g) || []).length === 3 && sitemapText.includes(SLUG))
check('article has the security chapter', articleText.heads.some((h) => h.startsWith('H2:Security')) && articleText.body.includes('a10 mishandling'))
const articleTitle = articleText.heads[0].slice(3).replace(/\.$/, '')
await seo.goto(APP)
const cardTitle = (await seo.locator('.csc-title').textContent()).trim()
check('home card shows the article title', cardTitle === articleTitle, `${cardTitle} | ${articleTitle}`)
const old = await seo.request.get(`${APP}/case-studies/film-order-to-sap`, { maxRedirects: 0 })
check('old address redirects permanently', old.status() === 308, String(old.status()))
await seoCtx.close()
await browser.close()

const failed = results.filter((r) => !r).length
console.log(`\n${results.length - failed} of ${results.length} checks passed`)
process.exit(failed ? 1 : 0)
