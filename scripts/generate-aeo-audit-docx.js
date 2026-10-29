// generate-aeo-audit-docx.js - regenerate the AEO audit Word deliverables.
//
// Produces juicy-designs-aeo-audit.docx (full audit) and
// juicy-designs-aeo-audit-summary.docx (executive one-pager) from the
// 29 October 2026 AEO audit of juicydesigns.co.za, including the check of the
// GSC Coverage and Performance exports supplied the same day.
//
// USAGE
//   npm install docx
//   node scripts/generate-aeo-audit-docx.js audits
//
// House style: South African / British English, no em or en dashes, sentence
// case headings. Keep it that way when editing the strings below.

const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  BorderStyle,
  TableOfContents,
  PageBreak,
  LevelFormat,
  convertInchesToTwip,
} = require("docx");

const CONTENT_W = 9360; // 12240 page - 2880 margins
const GREY = "EEEEEE";
const DATE = "29 October 2026";

// ---------- helpers ----------
const P = (text, opts = {}) =>
  new Paragraph({
    children: [new TextRun({ text, bold: opts.bold, italics: opts.italics })],
    spacing: { after: opts.after === undefined ? 120 : opts.after },
    ...(opts.style ? { style: opts.style } : {}),
  });

const H = (text, level) => new Paragraph({ text, heading: level, spacing: { before: 260, after: 130 } });

const MONO = (lines) =>
  lines.map(
    (l, i) =>
      new Paragraph({
        children: [new TextRun({ text: l, font: "Consolas", size: 18 })],
        shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
        spacing: { after: i === lines.length - 1 ? 140 : 0 },
      }),
  );

const BULLETS = (items) =>
  items.map(
    (t) =>
      new Paragraph({
        children: [new TextRun(t)],
        numbering: { reference: "jd-bullets", level: 0 },
        spacing: { after: 70 },
      }),
  );

function cell(text, widthDxa, opts = {}) {
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: opts.header ? { type: ShadingType.CLEAR, fill: GREY } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: String(text)
      .split("\n")
      .map(
        (line) =>
          new Paragraph({
            children: [new TextRun({ text: line, bold: !!opts.header, size: 20 })],
            spacing: { after: 0 },
          }),
      ),
  });
}

function table(headers, rows, widths) {
  return new Table({
    columnWidths: widths,
    width: { size: CONTENT_W, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => cell(h, widths[i], { header: true })),
      }),
      ...rows.map((r) => new TableRow({ children: r.map((c, i) => cell(c, widths[i])) })),
    ],
  });
}

// Finding block: Evidence / Impact / Fix / Confidence
function finding(parts) {
  const out = [];
  for (const [label, body] of parts) {
    out.push(
      new Paragraph({
        children: [new TextRun({ text: label + "  ", bold: true }), new TextRun({ text: body })],
        spacing: { after: 110 },
      }),
    );
  }
  return out;
}

const numbering = {
  config: [
    {
      reference: "jd-bullets",
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.18) } } },
        },
      ],
    },
    {
      reference: "jd-numbers",
      levels: [
        {
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.18) } } },
        },
      ],
    },
  ],
};

const styles = {
  default: { document: { run: { font: "Arial", size: 22 } } },
  paragraphStyles: [
    { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", run: { font: "Arial", size: 40, bold: true }, paragraph: { spacing: { after: 90 } } },
    {
      id: "Heading1",
      name: "Heading 1",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { font: "Arial", size: 32, bold: true, color: "000000" },
      paragraph: { outlineLevel: 0, spacing: { before: 320, after: 150 } },
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { font: "Arial", size: 26, bold: true, color: "000000" },
      paragraph: { outlineLevel: 1, spacing: { before: 250, after: 110 } },
    },
    {
      id: "Heading3",
      name: "Heading 3",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: { font: "Arial", size: 22, bold: true, color: "000000" },
      paragraph: { outlineLevel: 2, spacing: { before: 190, after: 90 } },
    },
  ],
};

const pageSetup = {
  properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
};

function titleBlock(title) {
  return [
    new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 40 })], spacing: { after: 90 } }),
    new Paragraph({
      children: [new TextRun({ text: "Prepared by Juicy Designs  ·  " + DATE, size: 22, color: "555555" })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "BBBBBB", space: 8 } },
      spacing: { after: 300 },
    }),
  ];
}


// ============================================================
// FULL AUDIT
// ============================================================
const audit = [];
audit.push(...titleBlock("AEO Audit - juicydesigns.co.za"));

audit.push(H("Contents", HeadingLevel.HEADING_1));
audit.push(new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }));
audit.push(new Paragraph({ children: [new PageBreak()] }));

// --- Summary
audit.push(H("Summary", HeadingLevel.HEADING_1));
audit.push(
  P(
    "This is an answer engine optimisation (AEO) audit: how likely Google AI Overviews, ChatGPT, Perplexity, Gemini and Copilot are to find, trust and cite juicydesigns.co.za. The on-page work is mostly in good shape. Pages are server-rendered, every AI crawler is allowed, Core Web Vitals pass, all 261 sampled pages carry valid JSON-LD, and the blog and pricing pages are written answer-first with bylines and tables. That is why /services/seo/pricing/ is already cited in the Google AI Overview for \"how much does seo cost in south africa\" despite ranking only #27.",
  ),
);
audit.push(
  P(
    "The site is held back by three things. Its trust signals are self-issued: review markup on its own homepage, more than 70 \"best agencies\" lists that rank Juicy Designs first, and anonymised case studies. Its scale looks programmatic: 2,041 indexable URLs, including the 721 glossary and 312 location pages the July recovery pack said to noindex, which are still live and still in the sitemap. And it has almost no presence on the independent sources AI engines cite for agency queries, such as Clutch, DesignRush, GoodFirms, Reddit, Wikidata and the local pack.",
  ),
);
audit.push(
  P(
    "The most urgent fix is new. Cloudflare is caching the origin server's bot-check page (\"One moment, please...\") and serving it, with HTTP 200, to every visitor and crawler on /contact/ and /services/social-media-marketing/. Purge those two URLs today, then stop the challenge page from being cached (see R1).",
  ),
);
audit.push(
  P(
    "Health score: 23/100 (band F) - 1 critical, 5 high, 6 medium, 4 low. Composite GEO score: 54/100 (poor). Both are computed below. The sitewide suppression of 17 July lifted on 26 September, and impressions are back to about 72% of the July peak. But average position has worsened every week since, from 15.7 to 23.3, so the recovery is not yet secure. The fixes in this audit are the ones that protect it.",
    { bold: true },
  ),
);

// --- Measurement snapshot
audit.push(H("Measurement snapshot", HeadingLevel.HEADING_1));
audit.push(
  P(
    "Every figure below was measured on 29 October 2026, not estimated. Sources: Search Console (sc-domain:juicydesigns.co.za, data to 28 October), CrUX field data, live SERP and AI Overview checks for Google South Africa, Ubersuggest (ZA), and a crawl of all 2,041 sitemap URLs. Clicks and CTR from 3 July to 13 September are contaminated by scripted clicks (documented in the August addendum), so impressions and average position are the metrics to trust.",
  ),
);
audit.push(
  table(
    ["Metric", "Value", "Source", "Reading"],
    [
      ["Impressions, last 28 days\n(30 Sep-27 Oct)", "73,751 (+277.5%)", "GSC", "Recovered from the 17 Jul suppression on 26 Sep"],
      ["Average position, last 28 days", "20.1 (was 32.0)", "GSC", "Better, but drifting: weekly 15.7 to 23.3 since 28 Sep"],
      ["Weekly impressions vs peak", "~17-18k vs 24.4k", "GSC", "About 72% of the pre-suppression peak"],
      ["Real organic clicks", "~15-25 / day, CTR ~0.6%", "GSC", "Scripted clicks stopped 14 Sep"],
      ["LCP / CLS (origin, p75)", "1,535 ms / 0", "CrUX", "Good"],
      ["INP (origin, p75)", "80 ms (last reading, 26 Sep)", "CrUX", "Good; current window not returned"],
      ["Indexable URLs in sitemaps", "2,041 (837 blog, 721 glossary,\n312 location, 119 service, 52 page)", "Crawl", "All return 200 and index,follow"],
      ["URL inspection (10 key URLs)", "10/10 submitted and indexed", "GSC", "Self-referencing canonicals"],
      ["Google AI Overview citation", "Cited in 1 of 2 AIOs checked", "SERP", "Cited: SEO cost. Not cited: website cost"],
      ["Pages indexed / not indexed", "1,901 / 348 (23 Oct)", "GSC export", "Indexed count up from 1,670 on 5 Aug"],
      ["AI-feature impressions\n(28 Jul-27 Oct)", "10,433 across 509 pages", "GSC export", "26 a day before 26 Sep, 277 a day since"],
      ["Organic keywords (ZA)", "41 (2 in top 3)", "Ubersuggest", "Core \"web design pretoria\" terms at 104-112"],
      ["Referring domains", "472 (92% to homepage)", "Ubersuggest", "Inner pages have almost no links"],
      ["AI-assistant style queries in GSC", "Present, positions 1.7-8.1", "GSC", "Evidence that AI grounding searches reach the site"],
      ["GA4 AI referrals / key events", "Not measured", "GA4", "Connector lacks Analytics permission"],
      ["ChatGPT / Perplexity / Gemini / Copilot mentions", "Not measured", "Ahrefs, Ubersuggest", "Ahrefs plan has no API access; no Ubersuggest brand project"],
    ],
    [2300, 2200, 1500, 3360],
  ),
);

// --- GSC export verification
audit.push(H("GSC export verification", HeadingLevel.HEADING_1));
audit.push(
  P(
    "Ten Search Console exports dated 29 October (Performance, Generative AI features, Coverage and four Coverage drilldowns) were supplied with a draft \"top 100 fixes\" list. Every URL in the drilldowns was requested live on 29 October, following redirects. GSC reports when Google last saw a problem; the live check shows whether it is still there.",
  ),
);
audit.push(H("Coverage issues, checked live", HeadingLevel.HEADING_2));
audit.push(
  table(
    ["GSC reason", "URLs", "Live result on 29 October", "Action"],
    [
      ["Server error (5xx)", "12", "All 12 now resolve. Last crawled 19-20 Jul, the same days as the suppression. 7 redirect, 5 return 200", "Validate fix in GSC. Point /downloads/ and the TikTok PDF somewhere relevant, not /blog/ (Y9)"],
      ["Page with redirect", "118", "All 301 to a 200. 90 take 1 hop, 27 take 2 (non-www, then trailing slash), 1 takes 3", "Healthy outcome. Collapse the 2-hop chains (Y9)"],
      ["Crawled - currently not indexed", "85", "73 are sitemap URLs. 63 are indexable HTML: 26 service (19 of them city pages), 23 glossary, 23 blog. The rest are files such as robots.txt, llms.txt and JS", "Google is already declining the programmatic pages (supports R3). Files need no action"],
      ["Discovered - currently not indexed", "65", "64 are sitemap URLs returning 200, down from 121 on 5 Aug. One /resources/ URL redirects to a 404", "Will shrink as R3 and R5 cut the URL count"],
      ["Not found (404) / noindex / alternate canonical / 403 / redirect error", "45 / 6 / 15 / 1 / 1", "Not exported at URL level, so not checked", "Export the drilldowns and triage the 404s by inbound links"],
    ],
    [2000, 900, 3760, 2700],
  ),
);
audit.push(H("What the click data can and cannot show", HeadingLevel.HEADING_2));
audit.push(
  P(
    "The Performance export reports 3,928 clicks over three months, 87.5% of them to the homepage, with desktop CTR at 4.37% against 1.02% on mobile. Those figures cannot be used as they stand. Of the 3,423 clicks attributed to the top 1,000 queries, 1,820 are branded and 1,344 come from just five Pretoria queries clicked 43-91% of the time at positions 72-81. That is the scripted-click pattern documented in August, and it ended on 14 September. Only 259 clicks came from ordinary non-branded queries. Daily clicks averaged 69 before 14 September and 14 since. The homepage share and the desktop-versus-mobile CTR gap are artefacts of the scripted clicks, not user behaviour, so they should not drive title rewrites or mobile work.",
  ),
);
audit.push(
  P(
    "The Generative AI features export is the most useful AEO baseline available. Pages appeared in AI features 10,433 times in three months, across 509 pages. Daily AI-feature impressions rose from about 26 to about 277 when the suppression lifted on 26 September. The top pages are the homepage (2,059), /blog/facebook-ads-cost-south-africa/ (778) and /services/graphic-design/pricing/ (693). This measures appearances in Google's AI features, not citations by ChatGPT or other assistants.",
  ),
);
audit.push(H("Status of the supplied top 100 list", HeadingLevel.HEADING_2));
audit.push(
  table(
    ["Items in the draft list", "Status", "Note"],
    [
      ["01, 11, 13, 14 (5xx)", "Resolved", "All 12 URLs resolve live. Validate in GSC and fix the /downloads/ redirect target"],
      ["02 (bot challenge)", "Confirmed, critical", "See R1. Ubersuggest's crawler was served the challenge on the homepage itself, so it is not limited to two URLs"],
      ["03-06, 15-16, 31-32 (redirects, 404s, exclusions)", "Partly confirmed", "Folded into Y9, R3 and R5 above"],
      ["09, 59, 61-62 (homepage share, low-CTR titles)", "Based on contaminated data", "Re-assess on post-14 September data only"],
      ["10, 96-98 (GA4 lead tracking)", "Confirmed", "August audit found 0 key events in 120,957 sessions. Roadmap item 11"],
      ["12 (/services/search-engine-optimisation/)", "Resolved", "It 301s to /services/seo/ as planned"],
      ["17-25 (HTTPS, www, canonicals, sitemaps, robots, rendering)", "Pass", "Checked across 2,041 URLs. No action beyond R1 and Y9"],
      ["26-29 (Core Web Vitals)", "Pass", "LCP 1.5 s, CLS 0, INP 80 ms. Low priority"],
      ["40, 95 (glossary, doorway risk)", "Confirmed, high", "See R3"],
      ["46-48, 57 (cannibalisation, SEO/AEO/GEO overlap)", "Confirmed, high", "See R5"],
      ["66-68, 83, 86 (case studies, claims, schema)", "Confirmed", "See R2, Y1 and Y2"],
      ["76-90 (AEO and GEO)", "Confirmed", "See R6, Y3 and Y4"],
      ["82 (BreadcrumbList)", "No fault", "Markup is valid. GSC's \"Unnamed item\" label is cosmetic"],
    ],
    [3300, 1800, 4260],
  ),
);
audit.push(
  P(
    "Items not listed are sound practice but generic. Under audit-rigor rules they are ongoing hygiene, not findings. The roadmap below is ordered by impact.",
  ),
);

// --- AI visibility
audit.push(H("AI visibility", HeadingLevel.HEADING_1));
audit.push(H("Brand-mention sweep", HeadingLevel.HEADING_2));
audit.push(
  P(
    "Google was checked live. The other four platforms could not be checked with the tools connected to this session, so they are marked \"Not measured\" rather than guessed. Getting that data is roadmap item 11.",
  ),
);
audit.push(
  table(
    ["Query (Google South Africa)", "Platform", "Status"],
    [
      ["how much does seo cost in south africa", "Google AI Overview", "Cited - /services/seo/pricing/ (1 of 12 domains)"],
      ["how much does a website cost in south africa", "Google AI Overview", "Absent - 5 other SA sites cited"],
      ["web design company pretoria", "Google organic + local pack", "Absent from top 30 and local pack"],
      ["best web design agencies south africa", "Google organic + local pack", "Absent from top 30 (Clutch, Reddit, listicles win)"],
      ["digital marketing agency pretoria", "Google organic + local pack", "Absent from top 30 and local pack"],
      ["seo agency pretoria", "Google organic + local pack", "Absent from top 30 (Reddit, listicles, revenuebase.ai win)"],
      ["All of the above", "ChatGPT, Perplexity, Gemini, Copilot", "Not measured (no data access)"],
    ],
    [3700, 2400, 3260],
  ),
);
audit.push(
  P(
    "Reading: for queries where AI picks the answer (cost, how-to, definition), Juicy's content is good enough to be cited even from a low organic position. For queries where AI picks a supplier (\"best\", \"agency in Pretoria\"), the engines cite directories, Reddit and third-party lists, and Juicy is in none of them. Google's People Also Ask boxes for both cost queries are now answered by Google's AI, and Juicy answers none of the eight questions sampled.",
  ),
);

audit.push(H("Citability by page", HeadingLevel.HEADING_2));
audit.push(
  P(
    "Scored out of 10 with the extractability rubric: a direct answer near the top, sections that open with their answer, quotable blocks, question-led headings, coverage of follow-up questions, real text, self-contained sections, original proof, a byline, and schema that matches the page. Below 6 on a page meant to rank is a red flag.",
  ),
);
audit.push(
  table(
    ["Page", "Score", "What holds it back"],
    [
      ["/services/seo/pricing/", "8/10", "H2s are statements, not questions; no one-line price range in the intro"],
      ["/services/web-design/pricing/", "8/10", "Intro opens with the discovery call, not the price range Google's AIO quotes"],
      ["/blog/aeo-vs-seo/", "8/10", "No first-party data; headings are not questions"],
      ["/services/web-design/", "7/10", "No byline; few question headings"],
      ["/ (homepage)", "6/10", "Answer is a tagline; trust figures inconsistent with other pages"],
      ["/guides/web-design-cost/", "5/10", "918-word hub with no number in it; H1 in capitals"],
      ["/case-studies/", "4/10", "Every case is anonymised; no dates, client names or CreativeWork schema"],
      ["/blog/best-seo-agencies-pretoria-2026/", "Capped", "Ranks its own publisher first: a trust violation caps the score (see R4)"],
    ],
    [3400, 900, 5060],
  ),
);

audit.push(H("Per-platform readiness", HeadingLevel.HEADING_2));
audit.push(
  table(
    ["Platform", "Readiness", "The one finding that matters"],
    [
      ["Google AI Overviews / AI Mode", "Partial", "Eligible and already cited once. Cost-query citations depend on one canonical cost page ranking (R5)."],
      ["ChatGPT Search", "Weak", "Leans on off-site authority. Juicy is missing from the directories and lists it cites (R6). Bing Webmaster Tools status unverified."],
      ["Perplexity", "Weak", "Favours Reddit and reference material. No Reddit footprint; the benchmarks report is the right kind of asset but has no links."],
      ["Gemini", "Weak", "Needs entity resolution. No Wikidata item; name collides with UK \"Juicy Designs\" and \"Juice Design\"."],
      ["Bing Copilot", "Partial", "IndexNow key is live and LinkedIn page exists. Confirm Bing Webmaster Tools registration and submit the sitemap index."],
      ["Claude (Brave Search)", "Partial", "ClaudeBot allowed and pages are fact-dense, but the R1 challenge page would be fetched instead of content on affected URLs."],
    ],
    [2300, 1200, 5860],
  ),
);

audit.push(H("Scores", HeadingLevel.HEADING_2));
audit.push(
  P(
    "Health score = 100 - (1 critical x 15 + 5 high x 8 + 6 medium x 3 + 4 low x 1) = 23 (band F).",
  ),
);
audit.push(
  P(
    "Composite GEO score = citability 66 x 0.25 + brand 25 x 0.20 + E-E-A-T 60 x 0.20 + technical 70 x 0.15 + schema 60 x 0.10 + platform 40 x 0.10 = 54 (poor). Citability is the mean of the scored pages above. The other five inputs are auditor judgements from this audit's evidence, not tool outputs. Record both scores and re-run them at the next audit to track movement.",
  ),
);

// --- Validation scorecard
audit.push(H("Validation scorecard", HeadingLevel.HEADING_1));
audit.push(
  P(
    "Sitewide, from the 23-point checklist. Technical checks were run on a 261-URL sample (40 blog, 25 location, 25 glossary, and all 171 core and service pages) and a status sweep of all 2,041 sitemap URLs.",
  ),
);
const sc = [
  ["1 Title tag", "PASS", "Unique, 46-64 chars on pages inspected", "-"],
  ["2 Meta description", "PASS", "120-160 chars", "-"],
  ["3 Heading hierarchy", "PASS", "One H1 on 259/259 rendered pages; 208/261 have question-led H2/H3s", "Capitalised H1s on guides and team pages are cosmetic"],
  ["4 Canonical", "PASS", "Self-referencing on 259/259 rendered pages", "-"],
  ["5 Open Graph", "PASS", "Title, image, type present", "-"],
  ["6 Twitter Card", "PASS", "summary_large_image", "-"],
  ["7 URL structure", "PASS", "Clean, lowercase", "Some listicle URLs carry \"2026\" (see R4)"],
  ["8 Internal links", "PASS", "130-180 links per page; contextual links present", "-"],
  ["9 Images", "PASS", "No missing alt text on pages inspected", "-"],
  ["10 Structured data", "FAIL", "Valid JSON-LD on 261/261, but self-serving Review and AggregateRating", "R2"],
  ["11 Crawl and index", "FAIL", "Two URLs serve a cached bot-check page; 1,033 programmatic pages still indexable", "R1, R3"],
  ["12 Core Web Vitals", "PASS", "LCP 1.5 s, CLS 0, INP 80 ms (last)", "-"],
  ["13 Mobile", "PASS", "Viewport set; crawled mobile-first", "-"],
  ["14 HTTPS", "PASS", "HTTPS via Cloudflare", "-"],
  ["15 E-E-A-T and trust", "FAIL", "Anonymised case studies; self-ranking lists", "R4, Y1"],
  ["16 Content quality", "PASS", "Answer-first openings on blog, guide and service pages", "Y3 for cost pages"],
  ["17 Author and byline", "PASS", "Named bylines, Person schema, team profile pages", "-"],
  ["18 Entity and NAP", "FAIL", "Review and client counts differ across pages; some sameAs profiles unverified", "Y2, R6"],
  ["19 Citability", "PASS", "Mean 6.6/10; case studies 4/10", "Y1"],
  ["20 Brand-mention presence", "FAIL", "Absent for every supplier-choice query checked", "R6"],
  ["21 AI-crawler policy", "PASS", "All AI crawlers allowed; Content-Signal declared", "-"],
  ["22 Accessibility basics", "N/A", "Not spot-checked in this audit", "-"],
  ["23 JS-render parity", "PASS", "Content and schema are in the initial HTML", "-"],
];
audit.push(table(["Check", "Status", "Finding", "Fix"], sc, [2100, 900, 4160, 2200]));
audit.push(P("Score: 17 passed of 22 applicable (77%).", { bold: true }));

// --- Green flags
audit.push(H("Green flags", HeadingLevel.HEADING_1));
audit.push(
  ...BULLETS([
    "Search eligibility is solid. All 10 inspected key URLs are indexed with self-referencing canonicals, and every page is server-rendered, so crawlers that do not run JavaScript still see the full content and schema.",
    "Crawler policy is deliberate and consistent. robots.txt allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and the rest, and it declares a Content-Signal line.",
    "Core Web Vitals pass: LCP 1,535 ms and CLS 0 at origin level, and INP 80 ms at its last reading.",
    "Several problems from the August audit are now fixed. /sitemap.xml is a proper sitemap index again (2,041 URLs, previously collapsed to 38), the homepage has an H1, 11 of the 12 AI discovery files return 200 (3 did in August), and the IndexNow key is live.",
    "Pricing pages are citation-grade. /services/seo/pricing/ and /services/web-design/pricing/ have bylines, five comparison tables each, cost-driver sections and FAQs. The SEO pricing page is already cited in Google's AI Overview.",
    "There is an original-data asset: /research/south-african-search-advertising-benchmarks-2026/ publishes first-party CPC, CTR, CVR and CPL benchmarks across 24 industries with Dataset schema. This is the strongest citation magnet on the site.",
    "AI assistants are already searching for answers the site holds. GSC shows long, prompt-style queries (for example \"how do i get my business cited in chatgpt in south africa\", position 3.6) landing on Juicy pages.",
  ]),
);

// --- Red flags
audit.push(H("Red flags", HeadingLevel.HEADING_1));

audit.push(H("R1. Cloudflare is serving a cached bot-check page instead of content (critical)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "/contact/ and /services/social-media-marketing/ return the origin's anti-bot interstitial (\"One moment, please... Please wait while your request is being verified\") with HTTP 200, to every user agent tested: Chrome, Googlebot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, bingbot and curl."],
    ["Evidence.", "Response headers show cf-cache-status: HIT with age climbing from 187 s to over 420 s, which is past the origin's own cache-control: private, max-age=360. So Cloudflare is caching a response the origin marked private, under an edge TTL override. The other 2,039 URLs were served normally in a full sweep at 12:07 UTC on 29 October. /contact/ was still serving the challenge more than 30 minutes later. Ubersuggest's site-audit crawler was separately served the same page on the homepage, which is why its audit scores 43/100 from a single page."],
    ["Impact.", "The contact page is the conversion page. Any crawler that fetches these URLs while the bad copy is cached indexes an 8-word placeholder, and AI assistants fetching live (ChatGPT-User, Claude-User, Perplexity-User) get nothing to cite. Because the server answers 200, not 503, nothing flags the problem. Which URLs are affected will change over time, depending on what the origin challenges next."],
    ["Fix.", "1. Purge both URLs in Cloudflare now. 2. In the Cloudflare cache rule, respect origin cache-control so that private responses are never cached; or bypass the cache when the response title is \"One moment, please...\", or when the origin sends no x-turbo-charged-by header (cached good pages carry it, challenged pages do not). 3. In the origin's bot protection (LiteSpeed or Imunify360), allowlist Cloudflare's verified-bot IP ranges and make the challenge answer 503 with Retry-After instead of 200. 4. Add a monitor that alerts when any key URL's <title> is \"One moment, please...\" or \"Loader\". This changes caching and crawl behaviour, so stage it and confirm. Rollback: disable the new cache rule."],
    ["Confidence.", "Confirmed for the two URLs. The origin-side trigger is likely, not proven."],
  ]),
);

audit.push(H("R2. Self-serving review markup is still live (high)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "The homepage carries three Review objects whose itemReviewed is Juicy Designs' own #organization. The research page's LocalBusiness node carries AggregateRating 4.9 from 214 reviews."],
    ["Evidence.", "Seen in the live JSON-LD. GSC URL Inspection still reports \"Review snippets x3 (Juicy Designs)\" on the homepage, crawled 28 October."],
    ["Impact.", "Google does not show review stars for a business's reviews of itself on its own site, and the 4 August recovery pack named this markup as a likely contributor to the 17 July suppression. AI engines also cross-check claimed ratings against Google Business Profile."],
    ["Fix.", "Delete the three Review nodes from the homepage graph and the aggregateRating block from every Organization or LocalBusiness node, sitewide. Keep the testimonials as visible text. Link to the Google Business Profile reviews instead of marking them up."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("R3. The programmatic glossary and location pages are still indexable (high)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "The 721 /glossary/ pages and 312 location pages (such as /services/web-design-paarl/) return index,follow and remain in sitemap-glossary.xml and sitemap-locations.xml. The noindex step in the July and August packs (fixes/wp-noindex-mu-plugin.php, fixes/noindex-glossary.txt, fixes/noindex-locations.txt) has not been applied."],
    ["Evidence.", "Live robots meta on every sampled page; GSC list_sitemaps shows both sitemaps submitted and downloaded in the last week. The Paarl page promises \"Gauteng-calibre web design... built remote-first for Paarl businesses\", which is a template filled in per town. The GSC Coverage export shows Google has already crawled and declined to index 19 city service pages and 23 glossary pages."],
    ["Impact.", "These 1,033 pages are half the site's indexable URLs, and they match the scaled-content pattern Google's spam policy describes. The 26 September recovery came during the September spam update, so another update could reverse it while they remain."],
    ["Fix.", "Apply the prepared noindex lists, keeping the pages that earn impressions (fixes/keep-and-improve.csv), then remove the two sitemaps from the index file and from GSC. Adding noindex is a high-risk change, so stage and confirm it. Rollback: remove the mu-plugin."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("R4. More than 70 \"best agencies\" lists rank Juicy Designs first (high)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "The blog has 73 URLs starting \"best-\", most of them city or industry templates (for example best-seo-agencies-pretoria-2026, best-paid-media-agencies-cape-town-2026, best-social-media-agency-dental-practices-sa). The one inspected opens: \"Juicy Designs is the strongest overall SEO agency in Pretoria for 2026\"."],
    ["Evidence.", "Sitemap crawl and page text. Five of these lists are among the site's 11 highest-impression pages, at positions 10-19, with almost no real clicks."],
    ["Impact.", "These lists win impressions, but AI engines choosing a supplier cite independent comparisons, and a publisher ranking itself first is the clearest example of a non-independent one. At this volume they also add to the scaled-content footprint in R3, and they undermine the trust that the pricing and research pages earn."],
    ["Fix.", "Keep at most 3-5 lists where Juicy can compare honestly, for example \"how to choose an SEO agency in Pretoria\". In those, state plainly that Juicy wrote the list and is included, score every agency on published criteria, and drop the year from the URL. Consolidate the rest into those pages with 301 redirects. Redirects are high-risk, so stage them."],
    ["Confidence.", "Confirmed for the pattern. Its effect on rankings is likely, not proven."],
  ]),
);

audit.push(H("R5. Overlapping pages compete for the same answers (high)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "13 indexable URLs answer \"what does a website cost in South Africa\": 10 blog posts, /guides/web-design-cost/, /services/web-design/pricing/ and the calculator. 13 service pages target AI search (ai-seo, ai-seo-south-africa, ai-search-optimisation, ai-search-services, answer-engine-optimisation, aeo-optimisation-south-africa, generative-engine-optimisation, geo-optimisation-south-africa and others), and 69 URLs cover AEO, GEO or AI SEO in total. There are exact duplicates too, such as retail-digital-marketing-best-practices-2026 and -for-2026, and utm-tagging-best-practices and utm-tracking-best-practices. Sitemap lastmod dates show 108-174 blog posts published or updated each month from May to August."],
    ["Evidence.", "Sitemap crawl. The AI Overview for \"how much does a website cost in south africa\" cites five other SA sites and none of Juicy's 13 pages; the best of them ranks about #38-40."],
    ["Impact.", "An AI Overview can only cite one of these pages, and Google has to pick it from 13 that look alike. Splitting the signals across them is why none ranks well enough to be cited, while the single SEO pricing page is cited."],
    ["Fix.", "Make /services/web-design/pricing/ the one website-cost answer and fold the 10 blog posts into it, keeping ecommerce and maintenance cost as distinct sections or pages. Merge the AI-search service pages into two: a service page and a pricing page. 301 the merged URLs (high-risk; stage it) and update internal links. Cap new posts at a rate where each one is reviewed and adds something the site does not already have."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("R6. Juicy is missing from the sources AI engines cite for agency choice (high)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "On every supplier-choice query checked, the top results and AI sources are Clutch, DesignRush, GoodFirms, TechBehemoths, ProCompare, Bark, Reddit and third-party \"top 10\" lists. Juicy appears in none of them and not in the local pack. It has a Sortlist profile (1 review), a Manifest profile (1 review), a Bizcommunity listing and a LinkedIn page. There is no Wikidata item and no Reddit mention."],
    ["Evidence.", "Live SERP checks on 29 October, Ubersuggest SERP analysis, and web searches. The Organization sameAs lists Clutch, DesignRush and GoodFirms profile URLs. Those sites block automated checks, and searches did not surface them, so whether they are live is unverified."],
    ["Impact.", "ChatGPT and Perplexity weight off-site authority heavily, and Gemini relies on entity resolution. The site has 472 referring domains, more than any competitor checked, but 92% point at the homepage. Authority is not the gap; independent third-party validation is."],
    ["Fix.", "1. Open each sameAs URL by hand and remove any that 404 or belong to another firm. 2. Claim and complete Clutch, DesignRush and GoodFirms profiles, and ask five real clients a month to review on Clutch and Google. 3. Create the Wikidata item (founding date, founders, address, website, sameAs). 4. Pitch the benchmarks report to Bizcommunity, MarkLives and the SA trade press as a citable source. 5. Check the Google Business Profile category and primary location, since it is absent from the Pretoria local pack."],
    ["Confidence.", "Confirmed for the absences. sameAs validity is a hypothesis."],
  ]),
);

// --- Yellow flags
audit.push(H("Yellow flags", HeadingLevel.HEADING_1));

audit.push(H("Y1. Case studies are anonymised (medium)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "/case-studies/ describes six unnamed clients (\"Automotive dealer group\", \"Insurance brokerage\") with no dates, figures or links. Named proof exists elsewhere but is scattered: Adios Automotive on /services/web-design/, and Steelworx, Lazarus Motor Company and Musiekfabriek in homepage testimonials."],
    ["Impact.", "Case studies are an agency's main first-hand-experience signal and the content AI engines most readily quote. This page scores 4/10 for citability."],
    ["Fix.", "Publish 4-6 named case studies, with permission, at /case-studies/[client]/. Each needs the challenge, the work done, dated before and after figures, a screenshot, a client quote and CreativeWork schema. Start with Adios Automotive, whose rankings data is already public on the web-design page."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("Y2. Trust figures contradict each other (medium)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "Across 12 core pages, the review count is given as \"214 reviews\" (17 times), \"200+ reviews\" (14) and \"200 reviews\" (2), and scale as \"64+ clients\" (36) and \"150+ projects\" (3)."],
    ["Impact.", "Contradictory facts make AI engines less confident about which figure to repeat, and they undercut the site's \"no invented metrics\" message. Under the content-quality cap rules, internally inconsistent data limits a page's score."],
    ["Fix.", "Treat facts.json as the single source of truth, render every figure from it, and match the review count to the live Google Business Profile total."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("Y3. Cost pages do not open with the number (medium)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "/services/web-design/pricing/ opens with \"Every Juicy Designs build starts with a short discovery call\", and /guides/web-design-cost/ (H1 \"WEB DESIGN AND WEBSITE COST IN SA\") contains no figure at all. The AI Overview for this query leads with a rand range and a tier table."],
    ["Fix.", "Open the canonical cost page with a single quotable sentence, then the tier table, for example:"],
  ]),
);
audit.push(
  ...MONO([
    "<h1>How much does a website cost in South Africa?</h1>",
    "<p>A professionally built business website in South Africa costs",
    "R15,000 to R45,000 once-off for 5-15 pages, R45,000 to R120,000+",
    "for ecommerce, plus R350 to R1,500 a month for hosting and care.</p>",
  ]),
);
audit.push(P("Use the real figures from the packages table. The ones above are placeholders, apart from the R15,000 starting price already published. Confidence: Confirmed."));

audit.push(H("Y4. AI visibility is not being measured (medium)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "There is no tracking of ChatGPT, Perplexity, Gemini or Copilot mentions. The Ahrefs key has no API access (\"Insufficient plan\"), there is no Ubersuggest brand project, and the GA4 connector lacks Analytics permission, so AI referral sessions cannot be read."],
    ["Fix.", "Re-authorise GA4 for the Advanced GSC connector and build an \"AI assistants\" channel group (chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai). Create a Ubersuggest brand project with the 20 tracked prompts (around 10 supplier-choice and 10 cost or how-to prompts). Re-run this sweep monthly."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("Y5. Inner pages have no links pointing at them (medium)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "435 of 472 referring domains point to the homepage. The inner pages Ubersuggest reports (guides, blog posts, service pages) have between 0 and 4 linking domains each, and the benchmarks report does not appear among them."],
    ["Fix.", "Earn links to the pages that should be cited: outreach for the benchmarks report, client partner pages linking to named case studies, and directory profiles that link to service pages. This complements the disavow work already prepared in fixes/."],
    ["Confidence.", "Confirmed (Ubersuggest)."],
  ]),
);

audit.push(H("Y6. Absent from the Pretoria local pack (medium)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    ["Finding.", "The local pack for \"web design pretoria\" and \"digital marketing agency pretoria\" shows sawebsitedesigner, symaxx and others, not Juicy, despite the 4.9-star rating claimed on the site."],
    ["Fix.", "Audit the Google Business Profile: primary category (\"Website designer\" or \"Marketing agency\"), services, the Die Wilgers address, photos and posts. Make sure the name, address and phone match the site's schema exactly."],
    ["Confidence.", "Likely. The profile itself was not inspected."],
  ]),
);

audit.push(H("Y7. The AI discovery file set is a maintenance cost with no proven return (low)", HeadingLevel.HEADING_2));
audit.push(
  P(
    "The site maintains 12 discovery files, including a 45 KB llms.txt, ai.txt, identity.json and brand.txt. Google has said llms.txt and similar files do not help its AI features, and no major engine has confirmed any benefit. Their facts have already drifted from the pages (Y2), and the RSL licence in llms.txt (150 quoted words per page) sits awkwardly with the Content-Signal ai-input=yes line. Keep llms.txt and facts.json, generate both from the same source as the pages, and stop expanding the set. /llm.txt returns 404; either redirect it to /llms.txt or remove it from .cpanel.yml.",
  ),
);

audit.push(H("Y8. No video on key pages (low)", HeadingLevel.HEADING_2));
audit.push(
  P(
    "None of the pages inspected embed video. Pages that combine text, images and video are cited more often, and YouTube presence correlates strongly with AI citation. Add a 60-90 second walkthrough to each named case study and to the benchmarks report, each with VideoObject schema and a transcript.",
  ),
);

audit.push(H("Y9. Redirect chains and irrelevant redirect targets (low)", HeadingLevel.HEADING_2));
audit.push(
  P(
    "28 of the 118 redirecting URLs in GSC take more than one hop. For example, juicydesigns.co.za/glossary/kpi goes to www, then adds the trailing slash. Make the non-www rule redirect straight to the final https://www URL with the trailing slash. /downloads/ and /downloads/TikTok Advertising South Africa.pdf redirect to /blog/, which Google treats as a soft 404. Restore the PDF, or point both at /services/tiktok-advertising-south-africa/, or return 410. The URL ?domain={search_term_string} that GSC reported as a 5xx came from an old SearchAction template. This branch removes the remaining SearchAction from facts.json; Google retired sitelinks search box markup in October 2024. Redirect changes are high-risk: stage them.",
  ),
);

audit.push(H("Y10. Sitemap housekeeping in Search Console (low)", HeadingLevel.HEADING_2));
audit.push(
  P(
    "GSC still holds an http:// copy of the sitemap index, submitted on 3 June, and sitemap-resources.xml shows 2 warnings. Remove the http:// entry and resolve the warnings. Note that the GSC \"Unnamed item\" label on breadcrumbs is not a markup fault: every ListItem checked has a name.",
  ),
);

// --- Roadmap
audit.push(H("Prioritised roadmap", HeadingLevel.HEADING_1));
audit.push(P("Sorted by impact (high first), then effort (low first). Items marked * are high-risk changes: stage them and confirm before they go live."));
audit.push(
  table(
    ["Action", "Effort", "Impact", "Owner"],
    [
      ["1. Purge /contact/ and /services/social-media-marketing/ in Cloudflare; stop caching private responses and challenge pages* (R1)", "S", "L", "Dev / hosting"],
      ["2. Remove the Review and AggregateRating markup about Juicy itself, sitewide (R2)", "S", "L", "Dev"],
      ["3. Apply the prepared noindex lists to glossary and location pages; drop the two sitemaps* (R3)", "S", "L", "Dev + Cobus"],
      ["4. Verify every sameAs URL; claim Clutch, DesignRush and GoodFirms; create the Wikidata item (R6)", "M", "L", "Marketing"],
      ["5. Consolidate the 13 website-cost pages and 13 AI-search service pages into canonical pages with 301s* (R5)", "M", "L", "Content + Dev"],
      ["6. Cut the \"best agencies\" lists to 3-5 honest, disclosed comparisons; redirect the rest* (R4)", "M", "L", "Content"],
      ["7. Publish 4-6 named case studies with dated results and CreativeWork schema (Y1)", "L", "L", "Founders"],
      ["8. Rewrite the canonical cost page to open with a quotable rand range and tier table (Y3)", "S", "M", "Content"],
      ["9. Make facts.json the single source for review, client and project counts (Y2)", "S", "M", "Dev"],
      ["10. Audit the Google Business Profile category, address and services (Y6)", "S", "M", "Marketing"],
      ["11. Re-authorise GA4; set up AI-referral channel group and a 20-prompt AI visibility tracker (Y4)", "S", "M", "Marketing"],
      ["12. Promote the benchmarks report to SA trade press for links and citations (Y5, R6)", "M", "M", "Marketing"],
      ["13. Add a monitor that alerts on the \"One moment, please...\" title (R1)", "S", "M", "Dev"],
      ["14. Add short walkthrough videos to case studies and the benchmarks report (Y8)", "M", "S", "Founders"],
      ["15. Stop expanding the discovery file set; generate llms.txt from facts.json; fix /llm.txt (Y7)", "S", "S", "Dev"],
      ["16. Remove the http:// sitemap from GSC; fix the sitemap-resources warnings (Y10)", "S", "S", "Dev"],
      ["17. Collapse 2-hop redirects to one hop; repoint /downloads/ and the TikTok PDF* (Y9)", "S", "S", "Dev"],
      ["18. Validate fix for the 12 5xx URLs in GSC; export and triage the 45 404s by inbound links", "S", "S", "Dev"],
    ],
    [5960, 900, 900, 1600],
  ),
);
audit.push(
  P(
    "How to tell it is working: track GSC impressions and average position weekly (not clicks), AI Overview citations for the six queries above, and the 20-prompt tracker from item 11. Re-score health and GEO 30 days after items 1-6 ship.",
  ),
);

const auditDoc = new Document({ styles, numbering, sections: [{ ...pageSetup, children: audit }] });

// ============================================================
// EXECUTIVE SUMMARY
// ============================================================
const ex = [];
ex.push(...titleBlock("AEO Audit - Executive Summary"));

ex.push(H("Headline", HeadingLevel.HEADING_1));
ex.push(
  P(
    "AI engines can already read and quote juicydesigns.co.za, and the SEO pricing page is cited in Google's AI Overview. The site loses AI recommendations because its trust signals are self-issued and its scale looks programmatic, and a Cloudflare caching fault is currently serving a bot-check page in place of the contact page.",
  ),
);

ex.push(H("Top 3 findings", HeadingLevel.HEADING_1));
ex.push(
  ...[
    "/contact/ and /services/social-media-marketing/ serve a cached \"One moment, please...\" bot-check page with HTTP 200 to every visitor and crawler, including Googlebot, GPTBot and ClaudeBot.",
    "Self-serving review markup is still live on the homepage (Google still detects 3 review snippets), and the 721 glossary and 312 location pages the July pack said to noindex are still indexable and in the sitemap.",
    "For supplier-choice queries (\"best web design agency\", \"agency Pretoria\"), Google and AI engines cite Clutch, DesignRush, Reddit and independent lists. Juicy appears in none of them, while publishing 73 lists of its own that rank itself first.",
  ].map(
    (t) =>
      new Paragraph({
        children: [new TextRun(t)],
        numbering: { reference: "jd-numbers", level: 0 },
        spacing: { after: 130 },
      }),
  ),
);

ex.push(H("Top 3 actions", HeadingLevel.HEADING_1));
ex.push(
  table(
    ["Action", "Effort", "Impact"],
    [
      ["Purge the two cached URLs and stop Cloudflare caching private and challenge responses", "S", "L"],
      ["Remove the self-serving review markup and apply the prepared noindex lists to glossary and location pages", "S", "L"],
      ["Get listed and reviewed on Clutch, DesignRush and GoodFirms, create the Wikidata item, and replace the self-ranking lists with named case studies", "M-L", "L"],
    ],
    [6560, 1400, 1400],
  ),
);
ex.push(P("Health score 23/100 (F). GEO score 54/100 (poor). Impressions have recovered to about 72% of the July peak, but average position has slipped every week since 28 September (15.7 to 23.3)."));

ex.push(H("Read the full audit", HeadingLevel.HEADING_1));
ex.push(P("juicy-designs-aeo-audit.docx - measurement snapshot, AI visibility sweep and citability scores, 23-point scorecard (17 of 22 passed), 6 red flags, 10 yellow flags, a check of the supplied GSC exports and draft top 100 list, and an 18-item roadmap."));

const exDoc = new Document({ styles, numbering, sections: [{ ...pageSetup, children: ex }] });

// ---------- write ----------
(async () => {
  const out = process.argv[2] || ".";
  fs.writeFileSync(`${out}/juicy-designs-aeo-audit.docx`, await Packer.toBuffer(auditDoc));
  fs.writeFileSync(`${out}/juicy-designs-aeo-audit-summary.docx`, await Packer.toBuffer(exDoc));
  console.log("written to", out);
})();
