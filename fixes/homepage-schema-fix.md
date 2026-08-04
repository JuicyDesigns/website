# Homepage schema fix — remove self-serving review markup (Red flag R3)

**Why:** GSC URL inspection (26 Jul 2026 crawl) shows Google surfacing three "Juicy Designs"
review snippets from the homepage's own Organization/LocalBusiness JSON-LD. Google's review
snippet guidelines prohibit reviews "about your own business, marked up on your own site" —
this is a spam-adjacent signal on the page that lost the most in the 17 July suppression,
and it would be an exhibit in any reconsideration request. The reviews also carry
`"publisher": {"name": "Google"}`, which misattributes them as Google-published data.

## Change 1 — Organization block (`@id: …#organization`)

**Delete these two properties entirely** from the LocalBusiness/ProfessionalService/Organization
JSON-LD block on the homepage (and any other page that outputs them, e.g. via the theme or
schema plugin — search the theme/plugin settings for "aggregateRating"):

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "bestRating": "5",
  "worstRating": "1",
  "ratingCount": "214",
  "reviewCount": "214"
},
"review": [ … all three Review objects … ]
```

Everything else in that block is good — keep name, legalName, address, geo, founders,
credentials, areaServed, openingHours, sameAs, contactPoint exactly as they are.

**Keep the social proof visibly on the page** — the 4.9★ / 214 reviews stat and the three
testimonials stay as normal page content, ideally with a link to the Google Business Profile
review page ("Read our 214 reviews on Google"). Only the *markup claim* goes.

## Change 2 — WebSite block (`@id: …#website`)

Delete the `potentialAction` (SearchAction) property:

```json
"potentialAction": {
  "@type": "SearchAction",
  "target": { "@type": "EntryPoint", "urlTemplate": "https://www.juicydesigns.co.za/blog/?q={search_term_string}" },
  "query-input": "required name=search_term_string"
}
```

Google deprecated the Sitelinks Search Box in October 2024 — this markup produces no rich
result, and a literal `?domain={search_term_string}` URL is already collecting impressions
in GSC because of a copy of this pattern on /services/ai-readiness-score/. Remove it there too.

## Verify after deploying

1. https://search.google.com/test/rich-results on the homepage → no Review snippets detected.
2. GSC → URL inspection → Request indexing for the homepage.
