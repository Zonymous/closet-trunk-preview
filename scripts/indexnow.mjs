// Tells Bing and other IndexNow engines that pages changed. Run after each deploy:
//   NEXT_PUBLIC_SITE_URL=https://your-domain node scripts/indexnow.mjs
// First run creates public/<key>.txt. Deploy that file, then run this again.
import { randomBytes } from 'node:crypto'
import { existsSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
if (!site) throw new Error('Set NEXT_PUBLIC_SITE_URL to the live address first')

const pub = join(dirname(fileURLToPath(import.meta.url)), '../public')
const existing = readdirSync(pub).find((f) => /^[a-f0-9]{32}\.txt$/.test(f))
const key = existing ? existing.slice(0, -4) : randomBytes(16).toString('hex')
if (!existsSync(join(pub, `${key}.txt`))) {
  writeFileSync(join(pub, `${key}.txt`), key)
  console.log(`Created public/${key}.txt. Deploy it, then run this script again.`)
  process.exit(0)
}

const paths = ['/', '/case-studies', '/case-studies/ai-sales-order-automation-sap']
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList: paths.map((p) => `${site}${p}`) }),
})
console.log(`IndexNow answered ${res.status}`)
