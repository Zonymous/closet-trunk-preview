# Weftwerk site

Next.js version of the single-file page in this folder (`Weftwerk · The agentic OS for manufacturing.html`), plus the case study.

## Run

```
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Set `NEXT_PUBLIC_SITE_URL` when deploying. **Until it is set, every page says noindex and robots.txt blocks crawlers**, so a preview can never be indexed by mistake.

## Where things live

| What | Where |
| --- | --- |
| Brand name, logo mark, nav links, case study card | `src/content/site.ts` |
| Page sections | `src/components/` |
| Original stylesheet, unchanged | `src/app/site.css` |
| Motion and the case study band | `src/app/motion.css` |
| Case study source | `case-study/body.html`, `case-study.css`, `thumbnail.svg`, `effects.js` |
| Case study as one file | `case-study/ai-sales-order-automation-sap-case-study.html` |
| Thumbnail, 1200x630 | `case-study/ai-sales-order-automation-sap-thumbnail.png` |
| SEO setup, keywords, launch steps | `case-study/SEO_NOTES.md` |

## Generated files

Do not edit `src/components/generated/`, `src/content/workflows.tsx`, `src/app/site.css`, `src/app/case-studies/case-study.css` or `src/components/case-study-effects.js` by hand.

```
npm run convert                     # after changing the source page
node scripts/build-case-study.mjs   # after changing anything in case-study/
```

## Check against the source page

```
npm run build
npx next start -p 3457
node scripts/verify.mjs <folder-for-screenshots>
```
