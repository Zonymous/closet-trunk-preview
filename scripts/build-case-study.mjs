// One source for the case study (case-study/body.html, case-study.css, thumbnail.svg, effects.js):
//   case-study/<slug>-case-study.html                standalone file, everything inlined
//   case-study/<slug>-thumbnail.png                  1200x630 thumbnail
//   public/case-studies/...-thumbnail.png            the same image for the site and link previews
//   src/components/generated/CaseStudyArticle.tsx    the article as JSX
//   src/components/generated/CaseStudyThumbnail.tsx  the thumbnail as JSX
//   src/app/case-studies/case-study.css              the article stylesheet
import { parseFragment } from 'parse5'
import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'case-study')
const read = (f) => readFileSync(join(src, f), 'utf8')
const brand = readFileSync(join(root, 'src/content/site.ts'), 'utf8').match(/name: '([^']+)'/)[1]
const body = read('body.html').replaceAll('{{BRAND}}', brand)
const css = read('case-study.css')
const thumb = read('thumbnail.svg')
const effects = read('effects.js')
const font = (f) => readFileSync(join(root, 'public/fonts', f)).toString('base64')

const SLUG = 'ai-sales-order-automation-sap'
const TITLE = 'AI Sales Order Automation in SAP: A Case Study'
const HEADLINE = 'How we automated SAP sales order entry with AI'
const DESCRIPTION = 'How we built AI sales order automation in SAP for a packaging film manufacturer: any order format in, a person approves, one clean contract out.'
const faces = `@font-face{font-family:"Geist";font-style:normal;font-weight:100 900;font-display:swap;src:url("data:font/woff2;base64,${font('Geist.woff2')}") format("woff2")}
@font-face{font-family:"Geist Mono";font-style:normal;font-weight:100 900;font-display:swap;src:url("data:font/woff2;base64,${font('GeistMono.woff2')}") format("woff2")}`

// ---- thumbnail PNG ----
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(`<!doctype html><meta charset="utf-8"><style>${faces}html,body{margin:0;background:#0B0B0D}svg{display:block;width:1200px;height:630px}</style>${thumb}`)
await page.evaluate(() => document.fonts.ready)
const png = await page.screenshot({ type: 'png' })
mkdirSync(join(root, 'public/case-studies'), { recursive: true })
writeFileSync(join(src, `${SLUG}-thumbnail.png`), png)
writeFileSync(join(root, `public/case-studies/${SLUG}-thumbnail.png`), png)

// the other shapes Google asks for in article markup, the thumbnail centred on the same black
for (const [name, w, h] of [['16x9', 1200, 675], ['4x3', 1200, 900], ['1x1', 1200, 1200]]) {
  await page.setViewportSize({ width: w, height: h })
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${faces}html,body{margin:0;height:100%;background:#0B0B0D;display:flex;align-items:center}svg{display:block;width:1200px;height:630px}svg .cs-rule{display:none}</style>${thumb}`)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ type: 'png', path: join(root, `public/case-studies/${SLUG}-${name}.png`) })
}

// home page link preview, and icons from the site mark
const ogHome = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" style="display:block;width:1200px;height:630px"><rect width="1200" height="630" fill="#0B0B0D"/><rect y="626" width="1200" height="4" fill="#2240E6"/><g transform="translate(64 66) scale(1.1)" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="32" height="32" rx="8"/><path d="M16 20H32M16 28H26"/><circle cx="32" cy="29" r="3.25" fill="#6B7FFF" stroke="none"/></g><text x="130" y="106" font-family="Geist" font-size="34" font-weight="600" letter-spacing="-.8" fill="#fff">${brand}</text><text font-family="Geist" font-size="84" font-weight="600" letter-spacing="-3.2" fill="#fff"><tspan x="60" y="300">The agentic OS</tspan><tspan x="60" y="396">for manufacturing<tspan fill="#6B7FFF">.</tspan></tspan></text><text x="64" y="500" font-family="Geist" font-size="27" fill="#fff" fill-opacity=".7">AI agents do the work. Rules check it. A person signs it.</text></svg>`
await page.setViewportSize({ width: 1200, height: 630 })
await page.setContent(`<!doctype html><meta charset="utf-8"><style>${faces}html,body{margin:0;background:#0B0B0D}</style>${ogHome}`)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ type: 'png', path: join(root, 'public/og-home.png') })
const iconSvg = readFileSync(join(root, 'src/app/icon.svg'), 'utf8')
for (const size of [180, 192, 512]) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<!doctype html><style>html,body{margin:0;background:#0B0B0D}svg{display:block;width:${size}px;height:${size}px}</style>${iconSvg}`)
  await page.screenshot({ type: 'png', path: size === 180 ? join(root, 'src/app/apple-icon.png') : join(root, `public/icon-${size}.png`) })
}
await browser.close()

// ---- standalone HTML ----
const script = effects.replace('export function', 'function')
// links into the site do not exist in the stand-alone file, so they become plain words
const standaloneBody = body.replace(/<a(?: class="[^"]*")? href="\/[^"]*">(.*?)<\/a>/g, '$1')
const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light">
<title>${TITLE}</title>
<meta name="description" content="${DESCRIPTION}">
<meta property="og:type" content="article">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${DESCRIPTION}">
<meta property="og:image" content="${SLUG}-thumbnail.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#2240E6"/><path d="M14 20H34M14 28H27" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>')}">
<script>document.documentElement.classList.add('js')</script>
<style>
${faces}
html{scroll-behavior:smooth}
body{margin:0;background:#fff}
${css}
</style>
</head>
<body>
${standaloneBody}
<script>
${script}
startCaseStudyEffects()
</script>
</body>
</html>
`
writeFileSync(join(src, `${SLUG}-case-study.html`), standalone)

// ---- JSX for the site ----
const KEEP = /^(aria-|data-)/
const attrName = (n) => {
  if (n === 'class') return 'className'
  if (n === 'datetime') return 'dateTime'
  if (KEEP.test(n)) return n
  return n.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}
const style = (s) => {
  const parts = s.split(';').map((p) => p.trim()).filter(Boolean).map((p) => {
    const i = p.indexOf(':')
    const k = p.slice(0, i).trim()
    const key = k.startsWith('--') ? JSON.stringify(k) : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    return `${key}: ${JSON.stringify(p.slice(i + 1).trim())}`
  })
  return `{{ ${parts.join(', ')} } as CSSProperties}`
}
function jsx(n) {
  if (n.nodeName === '#text') {
    if (!n.value.trim()) return /\n/.test(n.value) ? '' : '{" "}'
    return `{${JSON.stringify(n.value.replace(/\s+/g, ' '))}}`
  }
  if (!n.tagName) return ''
  const attrs = (n.attrs || []).map((a) => {
    if (a.name === 'style') return `style=${style(a.value)}`
    if (a.name === 'hidden') return 'hidden'
    return `${attrName(a.name)}=${JSON.stringify(a.value)}`
  }).join(' ')
  const inner = (n.childNodes || []).map(jsx).join('')
  const open = `<${n.tagName}${attrs ? ` ${attrs}` : ''}`
  return inner ? `${open}>${inner}</${n.tagName}>` : `${open} />`
}
const toJsx = (html) => parseFragment(html).childNodes.map(jsx).join('')
const banner = '// Generated by scripts/build-case-study.mjs from case-study/. Do not edit by hand.\n'
const gen = join(root, 'src/components/generated')
mkdirSync(gen, { recursive: true })
writeFileSync(join(gen, 'CaseStudyArticle.tsx'), `${banner}import type { CSSProperties } from 'react'\n\nexport function CaseStudyArticle() {\n  return (\n    ${toJsx(body)}\n  )\n}\n`)

// the visible FAQ is the single source for the FAQ markup
const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&rsquo;/g, '’').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&ndash;/g, '–').replace(/&amp;/g, '&').trim()
const faq = [...body.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p><\/div>/g)]
  .filter((m) => m[1].endsWith('?'))
  .map((m) => ({ question: plain(m[1]), answer: plain(m[2]) }))
writeFileSync(join(gen, 'caseStudyFaq.ts'), `${banner}export const CASE_STUDY_FAQ = ${JSON.stringify(faq, null, 2)}\n`)
writeFileSync(join(gen, 'CaseStudyThumbnail.tsx'), `${banner}export function CaseStudyThumbnail() {\n  return (\n    ${toJsx(thumb)}\n  )\n}\n`)
mkdirSync(join(root, 'src/app/case-studies'), { recursive: true })
writeFileSync(join(root, 'src/app/case-studies/case-study.css'), css)
writeFileSync(join(root, 'src/components/case-study-effects.js'), effects)

console.log('standalone KB', Math.round(standalone.length / 1024), 'thumbnail KB', Math.round(png.length / 1024))
