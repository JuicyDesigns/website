# Publishing the "Best web design and branding agencies" page

Companion to `blog/best-web-design-branding-agencies-south-africa.md` and its two
schema files. Written 8 August 2026.

**Read this first.** A git deploy will not publish this page. `.cpanel.yml`
copies only the AI discovery files, `robots.txt`, `facts.json`, the IndexNow key
and `images/blog/*.jpg` to `public_html`. It deliberately excludes `blog/*.md`
and `blog/*-schema.json`, because those are paste-into-WordPress source, not web
files. Pressing "Deploy HEAD Commit" in cPanel does nothing for this page no
matter which repository or branch it runs against.

There is also a repository split to be aware of (see the end of this file).

---

## Step 1 - [WP] Create the post

New post in WordPress. Use these exactly:

| Field | Value |
|---|---|
| Title | Best Web Design & Branding Agencies in South Africa for SMBs |
| Slug | `best-web-design-branding-agencies-south-africa` |
| Permalink | `https://www.juicydesigns.co.za/blog/best-web-design-branding-agencies-south-africa/` |
| Meta title | Best Web Design & Branding Agencies in South Africa for SMBs |
| Meta description | Founder-led web design and branding for South African SMBs. Juicy Designs builds brands, websites and marketing systems. Rated 4.9 since 2015. |
| Canonical | self-referencing, with `www` and a trailing slash |
| Author | Cobus van der Westhuizen |

Paste the body from `blog/best-web-design-branding-agencies-south-africa.md`,
everything below the closing `---` of the front matter. The front matter itself
is metadata for this repo, not page content - do not paste it.

Keep the H2 structure as written. Each H2 is a question a real person types, and
the paragraph directly under it is the extractable answer. Rewriting the
headings into statements removes most of the AI-citation value.

## Step 2 - [WP] Add the two schema blocks

Paste both into the page's custom head / JSON-LD field, as two separate
`application/ld+json` script tags:

- `blog/best-web-design-branding-agencies-south-africa-article-schema.json`
- `blog/best-web-design-branding-agencies-south-africa-faq-schema.json`

**Neither block contains `aggregateRating` or `Review`, and neither should.**
`RECOVERY-ACTIONS.md` Step 2 removes exactly that markup from the homepage
because Google prohibits self-serving review markup on your own site. The
4.9 / 214 figure stays as visible page copy only. If a plugin offers to inject
rating markup automatically, decline it on this page.

The Article block references an image at
`/images/blog/best-web-design-branding-agencies-south-africa-hero.jpg`. That
file does not exist yet. Either add a hero image at that exact path before
publishing, or delete the `image` property from the Article block - a schema
block pointing at a 404 is worse than one without an image.

## Step 3 - [WP] Verify before you hit publish

1. Rich Results Test on the draft URL: Article and FAQPage both detected, no
   Review snippets, no errors.
2. Confirm the canonical is self-referencing with `www` and a trailing slash.
   The site's canonical form is `https://www.juicydesigns.co.za/path/`.
3. Check all five internal links resolve. They were verified HTTP 200 on
   8 August: `/pricing/`, `/quote/`, `/guides/web-design-cost/`,
   `/services/ai-search-visibility-audit/`, `/services/ai-readiness-score/`.
4. Confirm the `tel:` links read `tel:+27793953300` with no spaces. Spaces make
   the URI invalid and it will not dial on mobile.

## Step 4 - After publishing

1. The page will not be in `sitemap-blog.xml` until that sitemap regenerates.
   Confirm it appears, then resubmit in Search Console.
2. Do **not** rely on `/sitemap.xml` for discovery. It currently serves 38 URLs
   and is not a sitemapindex (finding A11 in `AUGUST-ADDENDUM.md`), so nothing
   published to the blog is discoverable through it.
3. Link to the new page from `/services/web-design/` and `/blog/` so it is not
   an orphan on a site where 87 pages already have only one internal link.

---

## Two things to decide before publishing

**The missing client example.** The draft carried a placeholder for an
anonymised recent client result. It was removed rather than filled, because
inventing a case study would be a fabrication. The natural slot is directly
after the three bullets in "Why hire Juicy Designs over another agency?". One
real example with a real number is the strongest thing that could go on this
page, and its absence is the page's weakest point. Worth adding before publish
rather than after.

**This is the 63rd "best ... agencies" page.** The site already carries 62 in
`/blog/`, forming a `{service} x {city|industry}` matrix. That templated shape
is what `RECOVERY-ACTIONS.md` diagnoses as the cause of the 17 July suppression.
This page is different in kind - hand-written, substantive, no exact duplicate -
so it is not the same problem. But publishing another entry in that pattern
while the suppression is live carries real risk. The lower-risk sequence is to
publish it as the anchor that several weaker siblings later consolidate into,
once the recovery steps have shipped.

## Repository note

cPanel Git Version Control deploys from
`https://github.com/cobusvdwest/juicydesigns-website.git`, branch `main`,
last deployed `c70a5204` on 4 August 2026.

That commit does not exist in `JuicyDesigns/website`, which is where this file,
the page, the recovery pack and the August addendum all live. The two
repositories do not share the deployed commit and may share no history at all.

Consequences worth checking:

- Nothing committed to `JuicyDesigns/website` reaches the live site through
  cPanel, including the `llms.txt` and `llm.txt` spec fixes, which *are* on the
  `.cpanel.yml` copy list and would otherwise deploy.
- The 4 August recovery pack is committed to `JuicyDesigns/website` too. Its
  steps are manual ([WP] and [cPanel]), so nothing is broken by this, but do not
  assume a deploy applies any of it.
- Work out which repository is authoritative before pushing anything to the
  production `main`. If the histories are unrelated, a push there would need a
  force, and force-pushing the branch the live site deploys from is how you lose
  a deploy source.
