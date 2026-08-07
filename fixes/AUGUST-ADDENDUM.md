# August 2026 Addendum - findings the July recovery pack does not cover

Companion to `RECOVERY-ACTIONS.md` (4 August 2026). That pack's diagnosis of the
17 July suppression - scaled programmatic content plus self-serving review schema - 
is well evidenced and nothing here contradicts it. **Work steps 1-6 of that pack first.**

This addendum adds ten findings from a 7 August pass over Semrush, Ubersuggest,
Search Console and GA4 that the July pack does not address. The first three are the
material ones: two of them mean the numbers currently used to judge recovery are
not measuring what they appear to measure.

Format per finding: **Evidence · Impact · Fix · Confidence**.

---

## A1 - GA4 organic traffic is ~97% bot traffic

**Evidence.** GA4 property 328778034, 8 July-6 August 2026:

| Source / Medium | Sessions | Engaged | Bounce | Key events |
|---|---|---|---|---|
| google / organic | 115,318 | 99.2% | 0.8% | 0 |
| msn.com / referral | 4,793 | 99.3% | 0.7% | 0 |

Search Console reports **3,483 clicks** across the same window. Google cannot
deliver 115,318 sessions while itself reporting 3,483 clicks - a 33x gap.
Supporting signals: 99.2% engagement with 0.8% bounce is outside the range human
traffic produces; 97.4% of sessions are geo-stamped South Africa; and there are
**zero key events across 120,957 sessions**. The daily series does not dip on
17 July, so this traffic is independent of the ranking suppression.

**Impact.** Every GA4-derived number is currently meaningless - including
conversion rate, channel mix, and landing-page performance. Ubersuggest is
connected to GA and GSC (`isUsingGoogleData: true`) and is ingesting the same
figures: its dashboard reports **114,803 traffic** for a site Semrush
independently estimates at **32 organic visits/month**. Any recovery judged on
these numbers will read as success regardless of what actually happens.

**Fix.**
1. GA4 → Admin → Data Settings → Data Filters: confirm "Exclude Internal
   Traffic" and bot filtering are active (GA4's automatic bot exclusion does not
   catch referrer-spoofed traffic).
2. Create a segment excluding sessions with `engagementRate = 1` **and**
   `eventCount <= 2`, and rebuild the standard reports on it - this isolates the
   bot pattern without discarding history.
3. Add a server-side or Cloudflare rule blocking the offending traffic at the
   edge. Cloudflare → Security → WAF → a managed challenge on requests carrying a
   `google.com` referrer but no `gclid`/normal navigation pattern is the usual
   shape; confirm against the access logs before enabling.
4. Until this is done, **judge recovery on GSC impressions and average position
   only** - the July pack already uses those two, which is correct.

**Confidence: Confirmed.**

---

## A2 - GSC clicks are also inflated; do not use them as a recovery KPI

**Evidence.** Click-through rates that no position can produce:

| Query | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| advertising pretoria | 194 | 206 | 94.2% | 81.6 |
| marketing agencies pretoria | 153 | 160 | 95.6% | 77.1 |
| web design companies in pretoria (P2) | 312 | 344 | 90.7% | 53.7 |
| website design company pretoria (P2) | 315 | 342 | 92.1% | 55.8 |
| digital marketing agencies near me (P2) | 213 | 227 | 93.8% | 42.5 |
| seo marketing cost (P2) | 105 | 107 | 98.1% | 28.2 |

Nobody clicks the 80th result 94% of the time. The click counts also cluster
tightly across unrelated queries (315, 315, 313, 312, 307, 291), which organic
demand does not do - that is a script running a fixed number of iterations per
term.

**Impact.** The pre-drop baseline of ~350 clicks/day was substantially
artificial, so the "−76% clicks" figure overstates the real loss, while the
**−88.5% impressions** and **27.3 → 70.4 average position** figures are the
honest measure of the suppression. Targeting a click-count recovery would mean
chasing a number that was never real.

**Fix.** Track impressions, average position, and indexed-page count. Treat
clicks as unreliable until A1's edge blocking is in place and the CTR curve
returns to a plausible shape (single-digit CTR at position 20+).

**Confidence: Confirmed.**

---

## A3 - Toxic backlink profile, arriving weeks before the suppression

**Evidence.** Semrush Authority Score **10**; 1,118 backlinks from 796 referring
domains, only 279 follow. Ubersuggest agrees: DA 16, 730 of 927 nofollow.

Three distinct networks are present:

- **Auto-generated local-directory network** - several hundred domains, all
  authority score 2, all Cloudflare-fronted, built from a fixed vocabulary
  (`localbizportal.com`, `towndirectoryzone.net`, `nearmelocalfinds.com`,
  `bizsearchnearby.com`, `findtrustedvendors.com`, and so on).
- **Fake press-release network** - SA-themed names on shared AWS IPs
  (`pretoriapressdaily.com`, `capetownjournal.com`, `southafricareport.com`,
  `africanewsguide.com`, `ukbusinessreporter.com`), several on `3.22.21.42` /
  `3.140.133.78`.
- **Link-shortener / PBN cluster** - six domains on the single Moldovan IP
  `195.20.19.178` (`analyticshaven.top`, `atomizelink.icu`, `urls-shortener.eu`,
  `anchorurl.cloud`, `backlinks-checker.com`, `buzzshrink.website`), plus roughly
  twenty on the `5.100.156.x` /24.

Two anchor texts state the nature of the links outright:

```
"high quality dofollow backlinks da 50 pa 40 premium pbn network service
 juicydesigns.co.za rank first page google fast seo link building buy
 backlinks online cheap" - 2 domains
"please type a website title" - 23 backlinks from 4mark.net
```

**Timing.** The directory network's `first_seen` timestamps cluster in
**mid-to-late June 2026** - weeks before the 17 July suppression, and overlapping
the June 2026 spam update (24-26 June).

**Impact.** The July pack lists "no purchased links" under *What NOT to do* but
does not address the links already there. If Step 0 of that pack turns up a
manual action, this profile is the most likely subject, and a reconsideration
request filed without addressing it will fail. Separately, **only 3 of 796
referring domains are South African** - that, not the spam, is the real reason a
Pretoria agency ranks in the 70s for "web design pretoria".

**Fix.**

`fixes/disavow-juicydesigns.txt` is generated and committed: **604 of the 796
referring domains disavowed, 192 kept.** It was produced by
`scripts/build-disavow.sh` from a full Semrush referring-domains export
(796 rows, matching Semrush's reported total exactly).

1. **Review the file before uploading.** It opens with two review blocks rather
   than making you skim 604 lines:
   - Eight domains disavowed despite an authority score of 10 or more
     (`4mark.net` 26, `newsblaze.com` 31, `lmcordoba.com.ar` 24,
     `digitaladblog.com` 15, `newsnetmedia.com` 14, `marketminute.com` 14,
     `aweblist.org` 14, `duovoltart.com` 12). Each is a deliberate call from the
     explicit list, not a pattern match. `4mark.net` is the source of the
     "please type a website title" links; the rest sit on the `5.100.156.x` PBN
     range or the shared press-release IPs.
   - Two kept domains that match the directory-network naming grammar and were
     spared only by the score threshold (`citybiznet.net` and
     `citybizratings.com`, both authority 12). They are probably network
     members, but they are left in rather than auto-disavowed. Confirm and, if
     so, add them to `EXPLICIT` in the script.
2. Spot-check the kept list. It should contain the real editorial links:
   DesignRush, BizCommunity, Crunchbase, Windy, MySpace, Devpost, NatLawReview,
   FinancialContent, Observer-Reporter, Instapaper, plus the `.edu` domains and
   `adios.co.za` (a client).
3. Upload at https://search.google.com/search-console/disavow-links
4. Determine the origin. If a vendor was engaged for links or traffic, cancel it -
   it is the common cause of A1, A2 and A3 together. If not, treat it as negative
   SEO and say so in any reconsideration request.
5. Then earn real SA links: BizCommunity (already linking), Pretoria and Gauteng
   business bodies, SA marketing publications, client case-study co-marketing.

To refresh later, re-export from Semrush and re-run
`./scripts/build-disavow.sh refdomains.csv > fixes/disavow-juicydesigns.txt`.
The script matches on the networks' own naming grammar, so it catches members
that had not been crawled at the time of this export.

**Confidence: Confirmed** for the profile and the anchor text. **Likely** for the
link/suppression connection - the scaled-content explanation in `RECOVERY-ACTIONS.md`
remains the better-supported primary cause; these are not mutually exclusive.

---

## A4 - 61 structured-data markup errors

**Evidence.** Semrush Site Audit snapshot `6a727d4aa8989c61443f6f91`
(1,943 pages, 4 August), issue 45: 61 items with markup errors. Concentrated in
two places - every `/tools/` page (`schema-generator`, `roas-calculator`,
`cpm-calculator`, `seo-audit`, `ai-readiness`, `website-cost-calculator`,
`conversion-rate-calculator`, `ai-search-audit`, plus the `/tools/` index's
`ItemList`), and the `@graph` block on roughly forty blog posts.

**Impact.** The `/tools/` pages are the site's strongest link-earning and
AI-citation assets, and their markup does not validate. `homepage-schema-fix.md`
covers only the homepage review markup, so this is unaddressed.

**Fix.** Run each URL through https://search.google.com/test/rich-results, fix
the reported errors at the template level (the errors repeat per template, so
this is two template fixes, not 61 page edits), then re-audit.

**Confidence: Confirmed.**

---

## A5 - Homepage has no H1 and a duplicate title

**Evidence.** Semrush issue 103 (missing H1) and issue 6 (duplicate title tag),
both listing `https://www.juicydesigns.co.za/`. Also affected by one or both:
`/services/`, `/case-studies/`, `/services/social-media-marketing/pricing/`,
`/glossary/rich-snippet/`, `/glossary/commission-structure/`,
`/blog/social-media-advertising-cost-south-africa/`.

**Impact.** The homepage is the single biggest ranking asset on the site and the
page that lost the most in the suppression (−2,033 clicks, −10,614 impressions,
position 34.1 → 73.9). It is currently missing the most basic on-page signal.

**Fix.** Give the homepage one H1 carrying the primary head term
(e.g. `Digital Marketing Agency in Pretoria`), and make its `<title>` unique
against the other six pages. One H1, one intent, one canonical per page.

**Confidence: Confirmed.**

---

## A6 - Two AEO/GEO service pages are noindexed and unknown to Google

**Evidence.** Ubersuggest site audit, `page_allowed` issue: blocked by meta
robots tag - 

- `/services/answer-engine-optimisation-pretoria/`
- `/services/generative-engine-optimisation-pretoria/`
- `/contact/thanks/` and `/quote/thanks/` (these two are correct - thank-you
  pages should be noindexed)

GSC URL inspection on the first: *"URL is unknown to Google."* Neither page is
on the `wp-noindex-mu-plugin.php` list, so the tag is set per-page in
Yoast/RankMath rather than by the recovery triage.

**Impact.** The Ubersuggest project tracks `aeo south africa`,
`generative engine optimisation south africa` and
`ai search optimisation south africa` as targets - against pages Google cannot
see. `aeo agency south africa` held position 9.2 before the drop.

**Fix. High-risk change - stage and verify, do not bulk-apply.** Confirm the
noindex was not deliberate (it may have been set to avoid overlap with
`/services/ai-search-optimisation/`). If it was deliberate, consolidate properly:
301 the two Pretoria variants into `/services/ai-search-optimisation/` and drop
them from the sitemap. If it was accidental, remove the tag on those two URLs
only and request indexing.
**Rollback:** re-apply the per-page noindex in the SEO plugin.

**Confidence: Confirmed** (the noindex). **Hypothesis** (whether it was intended).

---

## A7 - Template bug emitting `%7D` 404s

**Evidence.** Ubersuggest `response_code_4xx`:
`/case-studies/%7D/`, `/locations/%7D/`, `/pricing/%7D/` - all 404. `%7D` is a
URL-encoded `}`, so an unrendered template variable is leaking into href values.

**Impact.** Small in isolation, but it means a template is emitting broken links
sitewide wherever that partial is used, and it wastes crawl budget on a site
already under suppression.

**Fix.** Find the template emitting `{...}` into an `href` on those three
sections - most likely a link partial with an unclosed or misspelled variable - 
and correct it. The 404s disappear once the source is fixed; no redirects needed.

**Confidence: Confirmed.**

---

## A8 - Ten hreflang conflicts in page source

**Evidence.** Semrush issue 24 (10 pages): four glossary pages
(`return-on-ad-spend`, `pay-per-click`, `cost-per-click`, `cost-per-acquisition`)
and six `/contact/?package=…` query-string variants (`starter`, `growth`,
`foundation`, `custom`, `business`, `authority`).

**Impact.** Conflicting hreflang confuses Google about which URL to serve. The
`/contact/?package=…` variants are also six near-duplicate crawlable URLs of one
page.

**Fix. High-risk change - stage and verify.** For a single-language SA site,
the simplest correct answer is to remove hreflang entirely rather than repair it.
Separately, add `<link rel="canonical" href="https://www.juicydesigns.co.za/contact/">`
to the `?package=` variants so they consolidate to the clean URL.
**Rollback:** restore the previous head output from the theme's version control.

**Confidence: Confirmed.**

---

## A9 - Wrong URL in sitemap.xml

**Evidence.** Semrush issue 18: `https://www.juicydesigns.co.za/google-ads-quote`
appears in `sitemap.xml` without a trailing slash, while the site uses trailing
slashes throughout - so the sitemap advertises a URL that redirects.

**Impact.** Minor, but sitemaps should list final canonical URLs only. Also on
the list in `RECOVERY-ACTIONS.md` Step 6 to resubmit sitemaps, so fix it in the
same pass.

**Fix.** Correct to `/google-ads-quote/` (or remove the entry if the page is
retired), regenerate, resubmit in GSC.

**Confidence: Confirmed.**

---

## A10 - llms.txt formatting, and its conflict with the noindex triage

**Evidence.** Semrush issue 219 flags `/llms.txt` with formatting issues. Against
the llms.txt spec the file had: blockquotes inside `## Licence`, `## Get a quote`
and `## For AI agents` (only one blockquote is allowed, directly after the H1);
plain-text bullets rather than link lists in `## For AI agents`, `## Key Facts`
and `## Contact`; and a bare trailing `Full glossary: …` line.

Separately, **18 of the 20 glossary pages promoted in llms.txt are on the
`wp-noindex-mu-plugin.php` noindex list** - the file was advertising to AI
crawlers exactly the pages the recovery triage is removing from the index.

**Impact.** Low. Google has stated it does not use llms.txt, and
`RECOVERY-ACTIONS.md` correctly says not to expect it to move rankings. This is
consistency hygiene across two workstreams, not a ranking lever.

**Fix. Done in this commit.** `llms.txt` restructured to spec (prose moved into
the free-form details area above the first `##`, all `##` sections now pure link
lists), the glossary section reduced to the hub plus the two non-noindexed terms
(`pay-per-click`, `return-on-ad-spend`), and `llm.txt` re-synced.

Still outstanding: `llm.txt` remains a byte-identical 43 KB duplicate.
`DEPLOYMENT.md` and `htaccess-redirects.txt` both prefer a 301 to `llms.txt` and
deleting the physical copy - that line is still commented out. **High-risk change
(redirect): enable and test one at a time.**

**Confidence: Confirmed.**

---

## Sequencing against the July pack

| Order | Work | Source |
|---|---|---|
| 1 | Step 0 - check for a manual action | `RECOVERY-ACTIONS.md` |
| 2 | **A1** - stop the GA4 bot traffic; switch KPIs to impressions + position | this file |
| 3 | **A3** - disavow, and cancel whatever is generating the links | this file |
| 4 | Steps 1-3 - noindex triage, review schema, redirects | `RECOVERY-ACTIONS.md` |
| 5 | **A5, A6, A7, A9** - homepage H1/title, AEO/GEO pages, `%7D` bug, sitemap | this file |
| 6 | **A4** - schema errors on `/tools/` and blog templates | this file |
| 7 | Steps 4-5 - de-cannibalise, rewrite keepers | `RECOVERY-ACTIONS.md` |
| 8 | **A8** - hreflang and `?package=` canonicals | this file |

A1 comes second because until it is fixed there is no reliable way to tell
whether anything after it worked.

## What not to do

Everything in the July pack's *What NOT to do* still stands. Add: do not buy
"SEO traffic" or ranking-signal services of any kind - A1, A2 and A3 are what
that purchase looks like from the data side, and it is actively obscuring the
recovery.
