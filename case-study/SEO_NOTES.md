# SEO, GEO and AEO notes: site and case study

Last updated 7 November 2026.

## Keywords

Source: Google autocomplete for India and the US, plus competitor pages. **Autocomplete shows what people type, not how many. There are no search volumes here.** Check volumes in Google Keyword Planner, Ahrefs or Semrush before spending on this.

| Role | Keyword | Where it is used |
| --- | --- | --- |
| Primary | AI sales order automation | Title tag, description, first lines, FAQ, URL |
| Primary | SAP sales order automation | H1, URL, breadcrumb, thumbnail |
| Secondary | sales order automation; order entry automation; AI order entry | Body and meta keywords |
| Secondary | purchase order to sales order automation | Meta keywords. Add to the body only where it reads naturally |
| Home page | agentic AI for manufacturing; AI agents for manufacturing | Home title and description |
| Later | agentic AI manufacturing use cases; AI agents in manufacturing examples; AI manufacturing case study | Each deserves its own article |

Not chosen: "re-typing" (nobody searches it), "SAP contract automation" (autocomplete turns it into contract *management*, a different product), "BOPP film manufacturers" (people looking to buy film).

## What makes this shareable

Competitors publish vendor numbers: [Corevist on a packaging maker](https://www.corevist.com/emmerson-zenx/) reports days to minutes, and [LeverX](https://leverx.com/case-studies/automating-order-processing-in-manufacturing) reports a 60% cut in processing time. Almost nobody publishes what broke. Google's May 2026 guidance also [stresses non-commodity content](https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing). So lead with the failures.

LinkedIn openers to try (the claims are all in the article):

1. SAP returned a server error. The contract had been created anyway. Here is what that taught us about letting AI near an ERP.
2. A customer writes "22 micron". They mean a film called 22 TPT. Nothing in SAP says so. This is why order automation is harder than reading a PDF.
3. We let our AI say "I don't know". Here is why a blank field is cheaper than a confident wrong grade.

Post the link in the first comment or the post itself and test both. There is no good data on which works better for case studies.

## Done in the code

- Title, description, canonical, Open Graph and Twitter tags on every page, and an `Article`, `BreadcrumbList`, `FAQPage`, `Organization` and `WebSite` schema where each applies.
- `robots.txt`, `sitemap.xml`, web manifest, favicon, Apple icon and link-preview images, including the 16:9, 4:3 and 1:1 images Google asks for in article markup.
- Keyword URL `/case-studies/ai-sales-order-automation-sap`, with a permanent redirect from the old one, and a `/case-studies` list page.
- `main` landmark, one H1 per page, headings that carry keywords and never skip a level, real tables, visible breadcrumb, byline and date.
- FAQs answering searched questions, links between the article and the site, and share buttons.
- First screen paints from CSS alone, only one hero photo loads with the page, a month of caching on fonts and photos, and all content is in the server's HTML.

`FAQPage` markup will probably not produce a rich result in Google, which [limits FAQ results mostly to health and government sites](https://developers.google.com/search/docs/appearance/structured-data/faqpage). It stays because it matches the visible text and other engines can read it.

## GEO and AEO

GEO (being cited by AI search) and AEO (being the direct answer) are not separate from SEO. [Google's guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says optimising for its AI features "is optimizing for the search experience, and thus still SEO", and calls unique, first-hand content the factor most likely to matter in the long run. **Nobody can guarantee a citation.** Microsoft [says the same](http://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a).

| Done in the code | Why | How strong is the evidence |
| --- | --- | --- |
| "The short answer" at the top of the article; FAQs on home and article | [Bing favours](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers) clear headings, tables and FAQ-style content | Vendor guidance |
| "How we got these numbers", dated facts, a named-source quote | The [GEO paper](https://arxiv.org/abs/2311.09735) found up to 40% more visibility from such methods, varying by domain | One study, with a benchmark, not your market |
| The failures and first-hand detail in the article | Google's "non-commodity content" | Strongest, and stated by Google |
| Schema matching the visible page, with clear company details | Bing says it [may help grounding, with no guarantee](http://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a). Google says it is not required | Moderate |
| AI search crawlers allowed: [OAI-SearchBot, ChatGPT-User](https://developers.openai.com/api/docs/bots), [Claude-SearchBot, Claude-User](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), PerplexityBot and others | Blocking them hides the site from those answers | Required, and already covered by `Allow: /` |
| `npm run indexnow` | [Bing recommends it](http://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) for fresher Copilot answers | Vendor guidance |
| `/llms.txt` | Google ignores it and says you don't need it, but allows it for other services. [One test of 10 sites](https://dev.to/searchless_ai/llmstxt-adoption-in-2026-only-586-of-top-sites-use-it-but-early-data-reveals-a-clear-signal-39na) saw 2 gain and 8 not | Weak. It is here because it costs nothing |

Left out because Google calls them myths or they carry risk: chunking pages for AI, writing in a special AI style, many near-duplicate pages per query, and buying mentions.

**AI training is your call.** `Allow: /` also lets training crawlers in (GPTBot, ClaudeBot, Google-Extended). Search visibility does not need them. To block them, add a rule per crawler in `src/app/robots.ts`.

**Track it monthly.** Use Search Console's Generative AI report and [Bing's AI Performance report](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview). Also ask ChatGPT, Perplexity, Gemini and Copilot these questions and note whether you are cited:

- How do you automate SAP sales order entry with AI?
- Can AI read handwritten purchase orders into SAP?
- What are the challenges of automating SAP order entry?
- What are examples of AI agents in manufacturing?

## Your launch steps

1. **Set `NEXT_PUBLIC_SITE_URL`** to the live address, such as `https://example.com`. Until then every page says noindex, on purpose.
2. Verify the site in [Google Search Console](https://search.google.com/search-console) and Bing Webmaster Tools. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_BING_SITE_VERIFICATION` to the codes they give you.
3. Submit `/sitemap.xml` to both.
4. Test the article in the [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/).
5. Check the live pages in [PageSpeed Insights](https://pagespeed.web.dev/). Targets at the 75th percentile: [LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less](https://web.dev/articles/vitals).
6. After each deploy, run `npm run indexnow` with the live address set. The first run creates a key file to deploy.
7. Get links: your company pages, a LinkedIn company post and partner pages. No code can do this, and it matters most for a new domain.
8. Publish a second case study when you can. A list page with one entry says little.
9. Replace the estimates with live numbers. Real results make this article stronger than any on-page change.

## Decide before launch

The home page names the client in the hero, "Our anchor client" section and footer. The article is anonymous, but both will sit on the same indexed site, so anyone can connect them.

## Plagiarism check

Five distinctive sentences were searched as exact phrases on 7 November 2026, and none was found elsewhere. This is a spot check with a web search, not a full scan. Run Copyscape, Grammarly or Turnitin on the final text if you need a formal result. The idea of AI suggesting while rules check and people approve is common in the field; the wording here is our own.
