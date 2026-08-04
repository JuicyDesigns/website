# Ranking Recovery — Implementation Pack (4 August 2026)

Companion to `juicy-designs-ranking-recovery-plan.docx`. Everything below is staged and
ready to apply; the live site is WordPress on cPanel, so steps marked **[WP]** or
**[cPanel]** are applied there, not from this repo.

**Diagnosis recap:** sitewide suppression on 17 July 2026 (GSC impressions −94% overnight,
avg position 26 → 69). Pages remain indexed; the cause profile is scaled programmatic
content (721 glossary + 262 location pages published in June) plus self-serving review
schema. Recovery = remove the triggers, then let Google recrawl.

## Step 0 — TODAY: check for a manual action (5 min)
GSC → Security & Manual Actions → **Manual actions** and **Security issues**.
- Nothing there → the suppression is algorithmic; proceed with steps 1–6.
- Action listed → still proceed with steps 1–6 (they ARE the cleanup), then file the
  reconsideration request citing them.

## Step 1 — [WP] Noindex the 944 thin programmatic pages
Data-driven triage from 90 days of GSC (2026-05-06 → 2026-08-03):

| List | Pages | Basis |
|---|---|---|
| `noindex-glossary.txt` | 719 of 721 | whole section earned 38 clicks; 24 were on one page |
| `noindex-locations.txt` | 225 of 262 | zero-click templated city variants |
| `keep-and-improve.csv` | 10 keepers | real demand (e.g. web-design-pretoria: 511 clicks) |
| `review-borderline.csv` | 29 borderline | 100–250 impressions; rewrite by end of Aug or noindex |

**Apply:** upload `wp-noindex-mu-plugin.php` to `wp-content/mu-plugins/` (create the folder
if needed). It sets `X-Robots-Tag: noindex, follow` + meta robots for exactly those 944
paths and overrides Yoast/RankMath. **Reversible** — delete the file to undo.

**Verify:** `curl -sI https://www.juicydesigns.co.za/glossary/seo/ | grep -i x-robots`
→ must show `noindex, follow`, and spot-check a keeper (web-design-pretoria) shows nothing.

Then: exclude noindexed pages from the sitemaps (Yoast noindex normally auto-removes them;
otherwise regenerate sitemap-glossary.xml / sitemap-locations.xml) and resubmit in GSC.
After ~4 weeks of clean recrawl, optionally convert the noindexed pages to 410s or delete.

## Step 2 — [WP] Remove self-serving review schema from the homepage
Full instructions + exact JSON in `homepage-schema-fix.md`. Two deletions:
1. `aggregateRating` + `review` out of the Organization/LocalBusiness block.
2. Deprecated `SearchAction` out of the WebSite block (also on /services/ai-readiness-score/).
Verify with the Rich Results Test, then Request indexing on the homepage.

## Step 3 — [cPanel] 301 redirects
Append `htaccess-redirects.txt` to public_html/.htaccess (above the WordPress block),
one line at a time, testing each. Covers: /services/search-engine-optimisation/ → /services/seo/
and the 2021 influencer listicle → /blog/influencer-marketing-south-africa/.

## Step 4 — [WP] De-cannibalise (existing pack)
Apply `internal-links-map.md` (in this folder since 30 July). Rule: one URL per keyword
cluster — homepage keeps only brand + "marketing agency pretoria" head terms; every other
cluster links to and is titled for its dedicated service/guide page. Known duplicates from
Semrush: marketing-companies-pretoria (/ vs /marketing-companies-pretoria/),
digital marketing agency pretoria (/ vs /services/digital-marketing-pretoria/),
seo fees (/services/seo/pricing/ vs /blog/seo-pricing-south-africa/),
influencer agency (blog listicle vs /services/influencer-marketing/).

## Step 5 — [WP] Rewrite the 10 keepers + 29 borderline pages
Each kept location page needs unique local proof: a named client/case study for that city,
city-specific results, real team/service specifics — not a swapped city name. Templates and
tone: use the refresh briefs in this folder as the model.

## Step 6 — After steps 1–3 are live
1. GSC → Request indexing: homepage + the 10 keepers + top blog pages.
2. Run `scripts/indexnow-submit.sh scripts/indexnow-urls.txt` (Bing/IndexNow).
3. Remove the duplicate `http://` sitemap property submission in GSC.
4. Fix the Ubersuggest crawl housekeeping: 9 broken anchor links, 10 over-long titles,
   5 non-friendly URLs.

## Monitoring (weekly, from the recovery plan)
- GSC impressions/day (target: back above 2,000; baseline ~400 at time of writing).
- Sitewide avg position (target: under 30; ~69 at time of writing).
- Alert thresholds: any tracked keyword −5 positions, traffic −15% WoW, indexed pages −5%.
- Re-audit + re-score 4–6 weeks after steps 1–3 ship.

## What NOT to do
No new programmatic pages, no purchased links, no per-keyword chasing of the Semrush CSV,
and don't expect llms.txt/AI-discovery files to move Google rankings (Google: not used).
