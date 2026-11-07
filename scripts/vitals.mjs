// Measures LCP and CLS in a real browser on a slow connection and a slowed CPU.
// Usage: start the app (npx next start -p 3457), then node scripts/vitals.mjs
import { chromium } from 'playwright'

const APP = process.env.VERIFY_URL || 'http://localhost:3457'
const browser = await chromium.launch()
for (const [name, path] of [['home', '/'], ['list', '/case-studies'], ['article', '/case-studies/ai-sales-order-automation-sap']]) {
  const runs = []
  for (let i = 0; i < 3; i++) {
    const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2, hasTouch: true })
    const page = await ctx.newPage()
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await page.addInitScript(() => {
      window.__v = { lcp: 0, cls: 0, el: '' }
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          window.__v.lcp = e.startTime
          window.__v.el = e.element ? e.element.tagName + '.' + (e.element.className?.baseVal ?? e.element.className) : ''
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.goto(`${APP}${path}`, { waitUntil: 'load', timeout: 90000 })
    await page.waitForTimeout(2500)
    runs.push(await page.evaluate(() => window.__v))
    await ctx.close()
  }
  runs.sort((a, b) => a.lcp - b.lcp)
  const mid = runs[1]
  console.log(`${name}: LCP ${(mid.lcp / 1000).toFixed(2)} s (runs ${runs.map((r) => (r.lcp / 1000).toFixed(2)).join(', ')}), CLS ${mid.cls.toFixed(3)}, element ${mid.el}`)
}
await browser.close()
