// Converts the single-file source page into project assets and generated JSX.
// Re-run with `npm run convert` if the source HTML changes.
//   public/fonts, public/images   decoded from the page's base64 blobs
//   src/app/site.css              the page's stylesheet, verbatim, with urls swapped
//   src/components/generated/*    SVG drawings, logo rows, control tiles and badges
//   src/content/workflows.tsx     the six workflow cards and their four panels
import { parse } from 'parse5'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceName = readdirSync(root).find((f) => f.endsWith('.html') && f !== 'index.html')
if (!sourceName) throw new Error('Source HTML not found next to package.json')
const html = readFileSync(join(root, sourceName), 'utf8')
const doc = parse(html)

// ---- tree helpers ----
const attr = (n, k) => n.attrs?.find((a) => a.name === k)?.value
const classes = (n) => (attr(n, 'class') || '').split(/\s+/).filter(Boolean)
const kids = (n) => n.childNodes || []
const elems = (n) => kids(n).filter((c) => c.tagName)
function walk(n, fn) {
  for (const c of kids(n)) {
    fn(c)
    walk(c, fn)
  }
}
function findAll(n, test) {
  const out = []
  walk(n, (c) => c.tagName && test(c) && out.push(c))
  return out
}
const byClass = (n, c) => findAll(n, (e) => classes(e).includes(c))
const byId = (id) => findAll(doc, (e) => attr(e, 'id') === id)[0]
const byTag = (n, t) => findAll(n, (e) => e.tagName === t)
const textOf = (n) => {
  let s = ''
  walk(n, (c) => {
    if (c.nodeName === '#text') s += c.value
  })
  return s.replace(/\s+/g, ' ').trim()
}

// ---- assets ----
mkdirSync(join(root, 'public/fonts'), { recursive: true })
mkdirSync(join(root, 'public/images'), { recursive: true })
const style = findAll(doc, (e) => e.tagName === 'style' && textOf(e).includes('@font-face'))[0]
let css = kids(style)[0].value
let fontIndex = 0
let imageIndex = 0
const fontNames = ['Geist.woff2', 'GeistMono.woff2']
css = css.replace(/url\("data:(font\/woff2|image\/jpeg);base64,([A-Za-z0-9+/=]+)"\)/g, (_, type, b64) => {
  const buf = Buffer.from(b64, 'base64')
  if (type === 'font/woff2') {
    const name = fontNames[fontIndex++]
    writeFileSync(join(root, 'public/fonts', name), buf)
    return `url("/fonts/${name}")`
  }
  imageIndex += 1
  const name = `plant-${imageIndex}.jpg`
  writeFileSync(join(root, 'public/images', name), buf)
  return `url("/images/${name}")`
})
const skeleton = `/* Page skeleton the source shipped with */
:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
img{max-width:100%}
[hidden]:not([hidden=until-found i]){display:none!important}
`
mkdirSync(join(root, 'src/app'), { recursive: true })
writeFileSync(join(root, 'src/app/site.css'), skeleton + css)

// ---- HTML to JSX ----
const KEEP = /^(aria-|data-)/
function jsxAttrName(name) {
  if (name === 'class') return 'className'
  if (name === 'for') return 'htmlFor'
  if (name === 'tabindex') return 'tabIndex'
  if (name === 'xlink:href') return 'xlinkHref'
  if (name === 'xmlns:xlink') return 'xmlnsXlink'
  if (KEEP.test(name)) return name
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}
function styleObject(s) {
  const parts = s
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const i = p.indexOf(':')
      const k = p.slice(0, i).trim()
      const v = p.slice(i + 1).trim()
      const key = k.startsWith('--') ? JSON.stringify(k) : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      return `${key}: ${JSON.stringify(v)}`
    })
  return `{{ ${parts.join(', ')} }}`
}
const quote = (v) => (/["\\\n{}]/.test(v) ? `{${JSON.stringify(v)}}` : `"${v}"`)
function jsxText(value) {
  if (!value.trim()) return /\n/.test(value) ? '' : '{" "}'
  const collapsed = value.replace(/\s+/g, ' ')
  if (/^[\w ,.:;()/+-]*$/.test(collapsed) && collapsed === collapsed.trim()) return collapsed
  return `{${JSON.stringify(collapsed)}}`
}
function toJsx(n, extraAttrs = '') {
  if (n.nodeName === '#text') return jsxText(n.value)
  if (!n.tagName) return ''
  const attrs = (n.attrs || [])
    .map((a) => {
      if (a.name === 'style') return `style=${styleObject(a.value)}`
      return `${jsxAttrName(a.prefix ? `${a.prefix}:${a.name}` : a.name)}=${quote(a.value)}`
    })
    .join(' ')
  const open = `<${n.tagName}${attrs ? ` ${attrs}` : ''}${extraAttrs}`
  const inner = kids(n).map((c) => toJsx(c)).join('')
  return inner ? `${open}>${inner}</${n.tagName}>` : `${open} />`
}
const inner = (n) => kids(n).map((c) => toJsx(c)).join('')

// The source repeats the same ids in several drawings, and a marker defined in a
// hidden drawing (display:none on phones or desktop) stops resolving. Scope per drawing.
function scopeIds(svg, suffix) {
  const ids = []
  walk(svg, (c) => {
    const id = c.attrs && attr(c, 'id')
    if (id) ids.push(id)
  })
  const rewrite = (v) => {
    let out = v
    for (const id of ids) {
      out = out
        .replace(new RegExp(`url\\(#${id}\\)`, 'g'), `url(#${id}-${suffix})`)
        .replace(new RegExp(`(^|[;\\s])#${id}($|[;\\s])`, 'g'), `$1#${id}-${suffix}$2`)
        .replace(new RegExp(`(^|[;\\s])${id}\\.(end|begin)`, 'g'), `$1${id}-${suffix}.$2`)
    }
    return v === out ? v : out
  }
  const visit = (node) => {
    for (const a of node.attrs || []) {
      if (a.name === 'id') a.value = `${a.value}-${suffix}`
      else a.value = rewrite(a.value)
    }
    for (const c of kids(node)) visit(c)
  }
  visit(svg)
  return svg
}
const brandText = (s) =>
  s
    .replaceAll('A radial hub. The the OS', 'A radial hub. The OS')
    .replaceAll('A radial hub, portrait. The the OS', 'A radial hub, portrait. The OS')
    .replaceAll('>Weftwerk OS<', '>{SITE.name} OS<')
const usesBrand = (s) => s.includes('{SITE.name}')

// ---- writers ----
const genDir = join(root, 'src/components/generated')
mkdirSync(genDir, { recursive: true })
mkdirSync(join(root, 'src/content'), { recursive: true })
const banner = '// Generated by scripts/convert-source.mjs from the source page. Do not edit by hand.\n'

function writeDrawings(file, drawings) {
  const body = drawings
    .map(({ name, node, suffix }) => {
      const jsx = brandText(toJsx(scopeIds(node, suffix)))
      return `export function ${name}() {\n  return (\n    ${jsx}\n  )\n}\n`
    })
    .join('\n')
  const head = usesBrand(body) ? `import { SITE } from '@/content/site'\n\n` : ''
  writeFileSync(join(genDir, file), banner + head + body)
}

const svgsIn = (sectionId) => byTag(byId(sectionId), 'svg').filter((s) => classes(s).includes('dg'))
const how = svgsIn('how')
writeDrawings('HowItRunsDrawings.tsx', [
  { name: 'HowItRunsDesktop', node: how[0], suffix: 'hd' },
  { name: 'HowItRunsMobile', node: how[1], suffix: 'hm' },
])
const os = svgsIn('os')
writeDrawings('OsHubDrawings.tsx', [
  { name: 'OsHubDesktop', node: os[0], suffix: 'od' },
  { name: 'OsHubMobile', node: os[1], suffix: 'om' },
])
const control = svgsIn('control')
writeDrawings('DataBoundaryDrawings.tsx', [
  { name: 'DataBoundaryDesktop', node: control[0], suffix: 'cd' },
  { name: 'DataBoundaryMobile', node: control[1], suffix: 'cm' },
])
const impact = svgsIn('impact')
writeDrawings('ImpactCharts.tsx', [
  { name: 'CostPerInvoiceChart', node: impact[0], suffix: 'i1' },
  { name: 'DaysPerInvoiceChart', node: impact[1], suffix: 'i2' },
  { name: 'AutomationSavingChart', node: impact[2], suffix: 'i3' },
])

// logo rows
const rows = byClass(doc, 'srow')
const rowsData = rows
  .map((row) => {
    const label = textOf(byClass(row, 'lbl')[0])
    const logos = elems(byClass(row, 'lgs')[0])
      .map((lg) => `<span className=${quote(attr(lg, 'class'))}>${inner(lg)}</span>`)
      .join(',\n      ')
    return `  { label: ${JSON.stringify(label)}, logos: [\n      ${logos}\n    ] }`
  })
  .join(',\n')
writeFileSync(
  join(genDir, 'logoRows.tsx'),
  `${banner}import type { ReactNode } from 'react'\n\nexport const LOGO_ROWS: { label: string; logos: ReactNode[] }[] = [\n${rowsData}\n]\n`,
)

// control tiles and badges
const tileRows = byClass(doc, 'ctile')
  .map((t) => {
    const icon = inner(byClass(t, 'ic')[0])
    const title = textOf(byTag(t, 'b')[0])
    const body = textOf(byTag(t, 'p')[0])
    const [a, b] = elems(byClass(t, 'mini')[0])
    const tone = attr(b, 'class') || ''
    return `  { icon: ${icon}, title: ${JSON.stringify(title)}, body: ${JSON.stringify(body)}, mini: [${JSON.stringify(textOf(a))}, ${JSON.stringify(textOf(b))}], tone: ${JSON.stringify(tone)} }`
  })
  .join(',\n')
const badgeRows = byClass(doc, 'badge')
  .map((b) => {
    const icon = inner(byClass(b, 'ic')[0])
    const title = textOf(byTag(b, 'b')[0])
    const body = textOf(byTag(b, 'small')[0])
    return `  { icon: ${icon}, title: ${JSON.stringify(title)}, body: ${JSON.stringify(body)} }`
  })
  .join(',\n')
writeFileSync(
  join(genDir, 'controlData.tsx'),
  `${banner}import type { ReactNode } from 'react'\n\nexport const CONTROL_TILES: { icon: ReactNode; title: string; body: string; mini: [string, string]; tone: string }[] = [\n${tileRows}\n]\n\nexport const CONTROL_BADGES: { icon: ReactNode; title: string; body: string }[] = [\n${badgeRows}\n]\n`,
)

// workflows
const cards = byClass(doc, 'wf-card')
const workflowRows = cards
  .map((card) => {
    const id = attr(card, 'aria-controls')
    const panel = findAll(doc, (e) => attr(e, 'id') === id)[0]
    const panels = byClass(panel, 'wf-p')
      .map((p) => {
        const kind = classes(p).find((c) => c.startsWith('wf-') && c !== 'wf-p')
        const label = textOf(byClass(p, 'k')[0])
        return `{ kind: ${JSON.stringify(kind)}, label: ${JSON.stringify(label)}, body: <>${inner(byTag(p, 'p')[0])}</> }`
      })
      .join(',\n      ')
    const subs = elems(byClass(card, 'subs')[0]).map((s) => textOf(s))
    return `  {\n    id: ${JSON.stringify(id)},\n    code: ${JSON.stringify(textOf(byClass(card, 'code')[0]))},\n    title: ${JSON.stringify(textOf(byClass(card, 'h3')[0]))},\n    one: ${JSON.stringify(textOf(byClass(card, 'one')[0]))},\n    subs: ${JSON.stringify(subs)},\n    panels: [\n      ${panels},\n    ],\n  }`
  })
  .join(',\n')
writeFileSync(
  join(root, 'src/content/workflows.tsx'),
  `${banner}import type { ReactNode } from 'react'\n\nexport type WorkflowPanel = { kind: string; label: string; body: ReactNode }\nexport type Workflow = { id: string; code: string; title: string; one: string; subs: string[]; panels: WorkflowPanel[] }\n\nexport const WORKFLOWS: Workflow[] = [\n${workflowRows},\n]\n`,
)

console.log({ fonts: fontIndex, images: imageIndex, how: how.length, os: os.length, control: control.length, impact: impact.length, rows: rows.length, cards: cards.length })
