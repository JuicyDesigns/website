// generate-audit-docx.js - regenerate the SEO audit Word deliverables.
//
// Produces audits/juicy-designs-seo-audit.docx (full audit) and
// audits/juicy-designs-seo-audit-summary.docx (executive one-pager) from the
// 7 August 2026 findings. Content mirrors fixes/AUGUST-ADDENDUM.md.
//
// USAGE
//   npm install docx
//   node scripts/generate-audit-docx.js audits
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
const DATE = "7 August 2026";

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
audit.push(...titleBlock("SEO Audit - juicydesigns.co.za"));

audit.push(H("Contents", HeadingLevel.HEADING_1));
audit.push(new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }));
audit.push(new Paragraph({ children: [new PageBreak()] }));

// --- Summary
audit.push(H("Summary", HeadingLevel.HEADING_1));
audit.push(
  P(
    "The site has been under sitewide suppression since 17 July 2026: Search Console impressions fell 88.5% and average position moved from 27.3 to 70.4 overnight. The recovery pack dated 4 August already diagnoses the likely cause - scaled programmatic content (721 glossary and 262 location pages published in June) plus self-serving review schema - and stages the fix. Nothing in this audit contradicts that diagnosis; work those steps.",
  ),
);
audit.push(
  P(
    'This audit covers what that pack does not, and the single most important finding is that the numbers currently being used to judge recovery are not measuring real traffic. GA4 records 115,318 "google / organic" sessions in a window where Search Console reports 3,483 clicks, at 99.2% engagement and zero key events. Ubersuggest is fed from the same connection and reports 114,803 traffic for a site Semrush independently estimates at 32 organic visits per month.',
  ),
);
audit.push(
  P(
    "Fix the measurement first. Until the bot traffic is blocked and reporting is rebuilt on Search Console impressions and average position, there is no reliable way to tell whether any recovery work is succeeding.",
  ),
);
audit.push(P("Health score: 22/100 (band F) - 2 critical, 4 high, 5 medium, 1 low. Computed as 100 − (Critical×15 + High×8 + Medium×3 + Low×1), excluding items already fixed.", { bold: true }));

// --- Measurement snapshot
audit.push(H("Measurement snapshot", HeadingLevel.HEADING_1));
audit.push(
  P(
    "Every figure below was measured, not estimated. Sources: Search Console (sc-domain:juicydesigns.co.za), GA4 property 328778034, Semrush ZA database and Site Audit snapshot 6a727d4aa8989c61443f6f91, Ubersuggest site audit, and CrUX field data.",
  ),
);
audit.push(
  table(
    ["Metric", "Value", "Source", "Reading"],
    [
      ["Clicks, 17 Jul-6 Aug\nvs 25 Jun-15 Jul", "1,326 vs 5,545\n(−76.1%)", "GSC", "Overstated - baseline was partly bot clicks"],
      ["Impressions, same windows", "8,214 vs 71,623\n(−88.5%)", "GSC", "The honest measure of the suppression"],
      ["Average position", "70.4 vs 27.3", "GSC", "Sitewide suppression, not a single-page loss"],
      ["GA4 organic sessions\n8 Jul-6 Aug", "115,318", "GA4", "Impossible against 3,483 GSC clicks"],
      ["GA4 engagement / bounce", "99.2% / 0.8%", "GA4", "Outside the range human traffic produces"],
      ["GA4 key events", "0 across 120,957 sessions", "GA4", "No conversions of any kind"],
      ["Organic keywords (ZA)", "108 - 2 in pos 1-3,\n11 in pos 4-10", "Semrush", "Real visibility is thin"],
      ["Estimated organic traffic", "32 / month", "Semrush", "Modelled, not Google-connected - the credible figure"],
      ["Reported traffic", "114,803", "Ubersuggest", "Ingesting the contaminated GA/GSC data"],
      ["Authority Score / DA", "10 (Semrush) / 16 (Ubersuggest)", "Both", "Low; 796 ref domains but only 279 follow"],
      ["SA referring domains", "3 of 796", "Semrush", "The real local-authority gap"],
      ["LCP (p75, field)", "2,196 ms - good", "CrUX", "Passing"],
      ["CLS (p75, field)", "0.01 - good", "CrUX", "Passing"],
      ["INP (p75, field)", "not returned", "CrUX", "Insufficient field data; overall CrUX assessment FAILED (2 of 3)"],
      ["TTFB / FCP (p75)", "1,314 ms / 2,129 ms", "CrUX", 'Both "needs improvement" - server response is the weak link'],
      ["Site Audit health", "83 (−8) Semrush,\n98 Ubersuggest", "Both", "1,943 / 1,977 pages crawled"],
    ],
    [2100, 1900, 1300, 4060],
  ),
);
audit.push(P("CrUX is the one dataset here that bot traffic cannot pollute - it samples real opted-in Chrome users only. Treat it as trustworthy while GA4 is not.", { italics: true }));

// --- Validation scorecard
audit.push(H("Validation scorecard", HeadingLevel.HEADING_1));
audit.push(
  P(
    "Run against the site as a whole, using audit-tool and Search Console data. Items requiring page-HTML inspection or live AI queries were not verifiable in this pass and are marked N/A with the reason - they are not silent passes.",
  ),
);
audit.push(
  table(
    ["Check", "Status", "Finding", "Fix"],
    [
      ["1. Title tag", "FAIL", "7 duplicate titles incl. homepage; 13 too long, 11 too short", "Unique title per page; 50-60 chars"],
      ["2. Meta description", "FAIL", "7 pages have none", "Write unique descriptions"],
      ["3. Heading hierarchy", "FAIL", "7 pages have no H1, incl. the homepage; 11 pages H1 duplicates title", "One descriptive H1 per page"],
      ["4. Canonical URL", "FAIL", "/contact/?package= variants (6) lack a canonical to /contact/", "Add canonical to the clean URL"],
      ["5. Open Graph tags", "N/A", "Page HTML not fetched this pass", "Verify in a page-level pass"],
      ["6. Twitter Card tags", "N/A", "Page HTML not fetched this pass", "Verify in a page-level pass"],
      ["7. URL structure", "FAIL", "13 non-SEO-friendly URLs; 3 URLs contain a leaked %7D", "Fix the template emitting {…} into hrefs"],
      ["8. Internal links", "FAIL", "87 pages have only one internal link; 34 orphaned sitemap pages", "Apply internal-links-map.md"],
      ["9. Image optimisation", "PARTIAL", "1 broken internal image, 1 broken external image; alt coverage 0 missing", "Replace the two broken images"],
      ["10. Structured data", "FAIL", "61 markup errors across /tools/ and ~40 blog posts", "Fix at template level; re-test"],
      ["11. Crawlability / indexing", "FAIL", "2 service pages noindexed and unknown to Google; 1 wrong sitemap URL", "See red flag R5 and yellow flag Y3"],
      ["12. Core Web Vitals", "FAIL", "LCP and CLS good; INP has no field data; CrUX assessment FAILED", "Reduce TTFB (1,314 ms) to lift FCP"],
      ["13. Mobile-friendliness", "PASS", "Viewport set on all crawled pages; 0 viewport issues", " - "],
      ["14. HTTPS and security", "PASS", "Valid certificate, 0 mixed-content issues, 0 non-secure pages", " - "],
      ["15. E-E-A-T and trust", "PARTIAL", "Named team pages, editorial policy and contact all present; but self-serving review schema on the homepage", "Apply homepage-schema-fix.md"],
      ["16. Content quality", "N/A", "Page copy not assessed this pass", "Assess during the keeper rewrites"],
      ["17. Author and byline", "PASS", "Three named team members with roles and credentials", " - "],
      ["18. Entity / NAP consistency", "PARTIAL", "Organization schema and sameAs present; third-party NAP not verified", "Verify against GBP and DesignRush"],
      ["19. Citability", "N/A", "Requires page-level passage scoring", "Score during the keeper rewrites"],
      ["20. Brand-mention presence", "N/A", "No live AI-platform queries run this pass", "Run the sweep as a separate exercise"],
      ["21. AI-crawler policy", "PASS", "robots.txt has a deliberate, documented allow-all policy with no contradictions", " - "],
      ["22. Accessibility", "N/A", "Not spot-checked this pass", "Refer to the UX auditor skill"],
      ["23. JS-render parity", "N/A", "Rendered HTML not compared this pass", "Check via GSC URL Inspection"],
    ],
    [1750, 900, 3600, 3110],
  ),
);
audit.push(P("Score: 5 passed, 10 failed or partial, 8 not applicable - 5 of 15 applicable checks pass.", { bold: true }));

// --- AI visibility
audit.push(H("AI visibility", HeadingLevel.HEADING_1));
audit.push(
  P(
    "A brand-mention sweep across AI Overviews, ChatGPT, Perplexity, Gemini and Copilot was not run in this pass, so no citation status is claimed. What was measured is the SERP-feature composition of the keywords the site ranks for, from the Semrush ZA database:",
  ),
);
audit.push(
  table(
    ["Signal", "Count (of 108 keywords)", "Reading"],
    [
      ["SERPs containing an AI Overview", "65", "Most target SERPs have an AI answer layer above organic"],
      ["SERPs containing People Also Ask", "99", "Strong question-led opportunity"],
      ["SERPs containing a local pack", "61", "Local intent dominates the keyword set"],
      ["Featured snippets held", "0", "No extractable passage is currently winning a snippet"],
    ],
    [4200, 1900, 3260],
  ),
);
audit.push(
  P(
    "Two observations follow. First, zero featured snippets against 99 PAA-bearing SERPs is the clearest content-shape gap on the site - the pages are not currently structured so a direct answer can be lifted out. Second, the two pages built for AI-search intent, /services/answer-engine-optimisation-pretoria/ and /services/generative-engine-optimisation-pretoria/, are noindexed and unknown to Google (red flag R5), so the site is not competing for that intent at all.",
  ),
);
audit.push(
  P(
    "On llms.txt and the AI discovery file set: Google has stated it does not use llms.txt, and the 4 August recovery pack correctly says not to expect it to move rankings. The formatting errors in it were fixed in this pass as consistency hygiene, not as a ranking lever. Do not invest further there.",
  ),
);

// --- Green flags
audit.push(H("Green flags", HeadingLevel.HEADING_1));
audit.push(
  ...BULLETS([
    "HTTPS, certificate and mixed-content handling are clean across all 1,943 crawled pages - zero issues in either audit tool.",
    "Mobile configuration is correct: viewport set sitewide, no viewport-width failures.",
    'LCP (2,196 ms) and CLS (0.01) both pass in real-user field data, with 80% and 96% of visits in the "good" band respectively.',
    "robots.txt is a deliberate, documented allow-all policy for search and AI crawlers with no self-contradictions - unusually well maintained.",
    "E-E-A-T scaffolding is genuinely in place: three named team members with credentials, a published editorial policy, and visible contact details.",
    "The 4 August recovery pack is a well-evidenced, correctly sequenced, reversible response to the suppression - including the decision to judge recovery on impressions and position rather than clicks, which this audit independently confirms is the right call.",
    'A handful of pages still rank genuinely well: /services/seo/pricing/ at position 7 for "seo rates", the homepage at 10 for "marketing companies in pretoria" and 12 for "digital marketing agency pretoria", /blog/top-brands-in-south-africa/ at 11.',
  ]),
);

// --- Red flags
audit.push(H("Red flags", HeadingLevel.HEADING_1));

audit.push(H("R1 - GA4 organic traffic is approximately 97% bot traffic (Critical)", HeadingLevel.HEADING_2));
audit.push(
  table(
    ["Source / Medium", "Sessions", "Engaged", "Bounce", "Key events"],
    [
      ["google / organic", "115,318", "99.2%", "0.8%", "0"],
      ["msn.com / referral", "4,793", "99.3%", "0.7%", "0"],
    ],
    [3060, 1600, 1500, 1500, 1700],
  ),
);
audit.push(
  ...finding([
    [
      "Evidence.",
      "GA4 property 328778034, 8 July-6 August 2026, against 3,483 Search Console clicks in the same window - a 33x gap. Google cannot deliver 115,318 sessions while itself reporting 3,483 clicks. Supporting signals: 99.2% engagement with 0.8% bounce is outside the range human traffic produces; 97.4% of sessions are geo-stamped South Africa; and there are zero key events across 120,957 sessions. The daily series does not dip on 17 July, so this is independent of the suppression.",
    ],
    [
      "Impact.",
      "Every GA4-derived number is currently meaningless, including conversion rate, channel mix and landing-page performance. Ubersuggest is connected to the same GA and GSC properties and reports 114,803 traffic for a site Semrush independently models at 32 organic visits per month. Any recovery judged on these numbers will read as success regardless of what actually happens.",
    ],
    [
      "Fix.",
      "Confirm GA4 bot filtering is on (it does not catch referrer-spoofed traffic). Build a reporting segment excluding sessions with engagementRate = 1 and eventCount ≤ 2. Block the traffic at the edge via a Cloudflare WAF rule, confirmed against access logs first. Until then, judge recovery on Search Console impressions and average position only.",
    ],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("R2 - Toxic backlink profile, arriving weeks before the suppression (Critical)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    [
      "Evidence.",
      "Semrush Authority Score 10; 1,118 backlinks from 796 referring domains, only 279 follow. Three distinct networks: several hundred auto-generated local-directory domains at authority score 2 (localbizportal.com, towndirectoryzone.net, nearmelocalfinds.com and similar); a fake press-release network on shared AWS IPs with SA-themed names (pretoriapressdaily.com, capetownjournal.com, southafricareport.com); and a link-shortener PBN cluster, six domains on the single Moldovan IP 195.20.19.178 plus roughly twenty on the 5.100.156.x /24. The directory network first appeared in mid-to-late June 2026, overlapping the June 2026 spam update (24-26 June) and weeks before the 17 July suppression.",
    ],
    ["", "Two anchor texts state the nature of the links outright:"],
  ]),
);
audit.push(
  ...MONO([
    '"high quality dofollow backlinks da 50 pa 40 premium pbn',
    " network service juicydesigns.co.za rank first page google",
    ' fast seo link building buy backlinks online cheap"  - 2 domains',
    '"please type a website title"  - 23 backlinks from 4mark.net',
  ]),
);
audit.push(
  ...finding([
    [
      "Impact.",
      'The recovery pack lists "no purchased links" as future policy but does not address the links already present. If the manual-action check in Step 0 of that pack returns a result, this profile is the most likely subject, and a reconsideration request filed without addressing it will fail. Separately, only 3 of 796 referring domains are South African - that, not the spam, is the underlying reason a Pretoria agency ranks in the 70s for "web design pretoria".',
    ],
    [
      "Fix.",
      "The disavow file is generated and committed at fixes/disavow-juicydesigns.txt: 604 of the 796 referring domains disavowed, 192 kept. Review it before uploading - it opens with two review blocks, one listing the eight domains disavowed despite an authority score of 10 or more, the other listing two kept domains that match the spam naming grammar and were spared only by the score threshold. Then upload to the Search Console disavow tool. Separately, determine the origin: if a vendor was engaged for links or traffic, cancel it, since that single purchase plausibly explains R1, R2 and R3 together. If not, treat it as negative SEO and say so in any reconsideration request. Then earn real South African links.",
    ],
    [
      "Confidence.",
      "Confirmed for the profile and anchor text. Likely for the link-to-suppression connection - the scaled-content explanation in the recovery pack remains better supported as the primary cause; the two are not mutually exclusive.",
    ],
  ]),
);

audit.push(H("R3 - Search Console clicks are also inflated (High)", HeadingLevel.HEADING_2));
audit.push(
  table(
    ["Query", "Clicks", "Impr.", "CTR", "Avg pos"],
    [
      ["advertising pretoria", "194", "206", "94.2%", "81.6"],
      ["marketing agencies pretoria", "153", "160", "95.6%", "77.1"],
      ["web design companies in pretoria", "312", "344", "90.7%", "53.7"],
      ["website design company pretoria", "315", "342", "92.1%", "55.8"],
      ["digital marketing agencies near me", "213", "227", "93.8%", "42.5"],
      ["seo marketing cost", "105", "107", "98.1%", "28.2"],
    ],
    [3660, 1300, 1300, 1400, 1700],
  ),
);
audit.push(
  ...finding([
    [
      "Evidence.",
      "Nobody clicks the 80th result 94% of the time. The click counts also cluster tightly across unrelated queries (315, 315, 313, 312, 307, 291), which organic demand does not do - that is a script running a fixed number of iterations per term.",
    ],
    [
      "Impact.",
      "The pre-drop baseline of roughly 350 clicks per day was substantially artificial, so the headline −76% clicks figure overstates the real loss. The −88.5% impressions and 27.3 → 70.4 position figures are the honest measure. Targeting a click-count recovery means chasing a number that was never real.",
    ],
    ["Fix.", "Track impressions, average position and indexed-page count. Treat clicks as unreliable until the edge blocking in R1 is live and the CTR curve returns to a plausible shape."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("R4 - Homepage has no H1 and a duplicate title (High)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    [
      "Evidence.",
      "Semrush Site Audit issue 103 (missing H1) and issue 6 (duplicate title tag), both listing the homepage. Also affected by one or both: /services/, /case-studies/, /services/social-media-marketing/pricing/, /glossary/rich-snippet/, /glossary/commission-structure/, /blog/social-media-advertising-cost-south-africa/.",
    ],
    [
      "Impact.",
      "The homepage is the site’s biggest ranking asset and the page that lost most in the suppression - 2,033 clicks and 10,614 impressions, position 34.1 to 73.9. It is missing the most basic on-page signal there is.",
    ],
    [
      "Fix.",
      'Give the homepage one H1 carrying the primary head term, for example "Digital Marketing Agency in Pretoria", and make its title unique against the other six pages. One H1, one intent, one canonical per page.',
    ],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("R5 - Two AEO/GEO service pages are noindexed and unknown to Google (High)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    [
      "Evidence.",
      'Ubersuggest page_allowed issue: /services/answer-engine-optimisation-pretoria/ and /services/generative-engine-optimisation-pretoria/ are blocked by meta robots tag. Search Console URL inspection on the first returns "URL is unknown to Google." Neither is on the wp-noindex-mu-plugin.php list, so the tag is set per-page in the SEO plugin rather than by the recovery triage. (/contact/thanks/ and /quote/thanks/ are also noindexed - that is correct and should stay.)',
    ],
    [
      "Impact.",
      'The Ubersuggest project tracks "aeo south africa", "generative engine optimisation south africa" and "ai search optimisation south africa" as targets, against pages Google cannot see. "aeo agency south africa" held position 9.2 before the drop.',
    ],
    [
      "Fix.",
      "High-risk change - stage and verify, do not bulk-apply. Confirm whether the noindex was deliberate; it may have been set to avoid overlap with /services/ai-search-optimisation/. If deliberate, consolidate properly: 301 both Pretoria variants into /services/ai-search-optimisation/ and drop them from the sitemap. If accidental, remove the tag on those two URLs only and request indexing. Rollback: re-apply the per-page noindex in the SEO plugin.",
    ],
    ["Confidence.", "Confirmed that the pages are noindexed. Hypothesis as to whether it was intended."],
  ]),
);

audit.push(H("R6 - 61 structured-data markup errors (High)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    [
      "Evidence.",
      "Semrush Site Audit snapshot 6a727d4aa8989c61443f6f91, issue 45: 61 items with markup errors. Concentrated in two templates - every /tools/ page (schema-generator, roas-calculator, cpm-calculator, seo-audit, ai-readiness, website-cost-calculator, conversion-rate-calculator, ai-search-audit, plus the /tools/ index ItemList) and the @graph block on roughly forty blog posts.",
    ],
    [
      "Impact.",
      "The /tools/ pages are the strongest link-earning and AI-citation assets on the site and their markup does not validate. The existing homepage-schema-fix.md covers only the homepage review markup, so this is entirely unaddressed.",
    ],
    ["Fix.", "Run each URL through the Rich Results Test and fix at template level - the errors repeat per template, so this is two template fixes rather than 61 page edits. Re-audit afterwards."],
    ["Confidence.", "Confirmed."],
  ]),
);

// --- Yellow flags
audit.push(H("Yellow flags", HeadingLevel.HEADING_1));

audit.push(H("Y1 - Keyword cannibalisation across seven query clusters (Medium)", HeadingLevel.HEADING_2));
audit.push(P("Semrush shows the same keyword ranking twice with two different Juicy Designs URLs:"));
audit.push(
  table(
    ["Keyword", "URL A (position)", "URL B (position)"],
    [
      ["marketing companies in pretoria", "/ (10)", "/marketing-companies-pretoria/ (59)"],
      ["digital marketing agency pretoria", "/ (12)", "/services/digital-marketing-pretoria/ (65)"],
      ["seo fees", "/services/seo/pricing/ (46)", "/blog/seo-pricing-south-africa/ (82)"],
      ["influencer agency", "/blog/influencer-marketing-agencies-south-africa/ (41)", "/services/influencer-marketing/ (76)"],
      ["digital marketing pricing packages sa", "/pricing/ (26)", "/services/social-media-marketing/pricing/ (82)"],
      ["digital agency south africa", "/ (55)", "/ (61)"],
      ["marketing companies in johannesburg", "/ (47)", "/ (56)"],
    ],
    [2900, 3230, 3230],
  ),
);
audit.push(
  P(
    "Web design is the worst case: /services/web-design/, /services/website-development/, /services/web-design-pretoria/, /services/web-design/pricing/ and /guides/web-design-cost/ all chase overlapping cost and Pretoria terms. This is already Step 4 of the recovery pack - internal-links-map.md is staged and should be applied.",
  ),
);

audit.push(H("Y2 - Template bug emitting %7D 404s (Medium)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    [
      "Evidence.",
      "Ubersuggest response_code_4xx: /case-studies/%7D/, /locations/%7D/ and /pricing/%7D/ all return 404. %7D is a URL-encoded closing brace, so an unrendered template variable is leaking into href values.",
    ],
    ["Impact.", "Small in isolation, but it means a shared template partial emits broken links wherever it is used, and it wastes crawl budget on a site already under suppression."],
    ["Fix.", "Find the link partial emitting {…} into an href on those three sections and correct it. The 404s disappear at source; no redirects needed."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("Y3 - Ten hreflang conflicts, and six uncanonicalised query-string URLs (Medium)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    [
      "Evidence.",
      "Semrush issue 24: four glossary pages (return-on-ad-spend, pay-per-click, cost-per-click, cost-per-acquisition) and six /contact/?package= variants (starter, growth, foundation, custom, business, authority).",
    ],
    ["Impact.", "Conflicting hreflang confuses Google about which URL to serve, and the ?package= variants are six near-duplicate crawlable URLs of a single page."],
    [
      "Fix.",
      "High-risk change - stage and verify. For a single-language South African site the simplest correct answer is to remove hreflang entirely rather than repair it. Separately, add a canonical to /contact/ on the ?package= variants. Rollback: restore the previous head output from the theme’s version control.",
    ],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("Y4 - Thin internal linking and orphaned pages (Medium)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    [
      "Evidence.",
      "Semrush notices: 87 pages have only one internal link, 34 sitemap pages are orphaned, 3 pages are orphaned in Google Analytics, and 461 pages are flagged as requiring content optimisation.",
    ],
    [
      "Impact.",
      "Pages reachable by a single link receive minimal internal authority and are slow to recrawl - which matters directly during a recovery that depends on Google recrawling cleaned pages.",
    ],
    ["Fix.", "Apply internal-links-map.md (already staged). Prioritise the ten keeper pages and the top blog posts so they are recrawled first."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("Y5 - On-page metadata gaps (Medium)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    [
      "Evidence.",
      "Semrush: 7 pages with no meta description, 11 where the H1 merely duplicates the title, 3 titles too short. Ubersuggest: 13 titles too long, 11 too short, 13 non-SEO-friendly URLs.",
    ],
    ["Impact.", "Degrades click-through and wastes the two elements with the most direct influence on how a result is presented. Not blocking, but compounding."],
    ["Fix.", "Write unique descriptions of 150-160 characters; make each H1 say something the title does not."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("Y6 - Wrong URL in sitemap.xml (Low)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    [
      "Evidence.",
      "Semrush issue 18: https://www.juicydesigns.co.za/google-ads-quote appears in sitemap.xml without a trailing slash, while the site uses trailing slashes throughout - so the sitemap advertises a URL that redirects.",
    ],
    ["Impact.", "Minor; sitemaps should list final canonical URLs only."],
    ["Fix.", "Correct to /google-ads-quote/ or remove the entry, regenerate and resubmit - fold into Step 6 of the recovery pack, which already resubmits sitemaps."],
    ["Confidence.", "Confirmed."],
  ]),
);

audit.push(H("Y7 - llms.txt formatting and its conflict with the noindex triage (Low - fixed)", HeadingLevel.HEADING_2));
audit.push(
  ...finding([
    [
      "Evidence.",
      "Semrush issue 219 flagged /llms.txt. Against the llms.txt spec the file had blockquotes inside three H2 sections (only one is allowed, directly after the H1), plain-text bullets rather than link lists in three sections, and a bare trailing line. Separately, 18 of the 20 glossary pages it promoted are on the wp-noindex-mu-plugin.php noindex list - the file was advertising to AI crawlers exactly the pages the triage removes from the index.",
    ],
    ["Impact.", "Low. Google has stated it does not use llms.txt. This is consistency hygiene across two workstreams, not a ranking lever."],
    [
      "Fix.",
      "Fixed in this pass: restructured to spec, glossary reduced to the hub plus the two non-noindexed terms, llm.txt re-synced. Still outstanding - llm.txt remains a byte-identical 43 KB duplicate; DEPLOYMENT.md and htaccess-redirects.txt both prefer a 301 to llms.txt and deleting the physical copy, and that line is still commented out.",
    ],
    ["Confidence.", "Confirmed."],
  ]),
);

// --- Roadmap
audit.push(H("Prioritised roadmap", HeadingLevel.HEADING_1));
audit.push(P("Sorted by impact, then by effort. Items marked [RP] are existing steps in the 4 August recovery pack and are listed here only to show correct sequencing against the new findings."));
audit.push(
  table(
    ["Action", "Effort", "Impact", "Owner"],
    [
      ["[RP] Step 0 - check Search Console for a manual action", "S", "L", "Cobus"],
      ["R1 - block the GA4 bot traffic; switch reporting to impressions + position", "M", "L", "Cobus"],
      ["R2 - review and upload the generated disavow file (604 domains)", "S", "L", "Cobus"],
      ["R2 - identify and cancel whatever is generating the links and clicks", "S", "L", "Cobus"],
      ["R4 - add an H1 and a unique title to the homepage", "S", "L", "Web team"],
      ["[RP] Step 1 - deploy the noindex mu-plugin for the 944 thin pages", "S", "L", "Web team"],
      ["[RP] Step 2 - remove self-serving review schema from the homepage", "S", "L", "Web team"],
      ["R5 - resolve the two noindexed AEO/GEO service pages", "S", "M", "Web team"],
      ["Y6 - fix the /google-ads-quote sitemap entry and resubmit", "S", "M", "Web team"],
      ["Y2 - fix the template emitting %7D into hrefs", "S", "M", "Web team"],
      ["[RP] Step 3 - deploy the two 301 redirects, one at a time", "S", "M", "Web team"],
      ["R6 - fix schema markup on the /tools/ and blog templates", "M", "M", "Web team"],
      ["[RP] Step 4 - apply internal-links-map.md to de-cannibalise (Y1, Y4)", "M", "M", "Content"],
      ["Y5 - rewrite missing and duplicate titles, descriptions and H1s", "M", "M", "Content"],
      ["[RP] Step 5 - rewrite the 10 keepers and 29 borderline pages", "L", "M", "Content"],
      ["R2 - earn genuine South African referring domains", "L", "L", "Cobus"],
      ["Y3 - remove hreflang; canonicalise the ?package= variants", "S", "S", "Web team"],
      ["Reduce TTFB (1,314 ms) to lift FCP and protect LCP", "M", "S", "Web team"],
      ["Y7 - enable the llm.txt → llms.txt 301 and delete the duplicate", "S", "S", "Web team"],
    ],
    [5560, 1100, 1100, 1600],
  ),
);
audit.push(P("R1 sits immediately after the manual-action check for a reason: until the measurement is trustworthy, there is no way to tell whether anything below it worked.", { italics: true }));

const auditDoc = new Document({ styles, numbering, sections: [{ ...pageSetup, children: audit }] });

// ============================================================
// EXECUTIVE SUMMARY
// ============================================================
const ex = [];
ex.push(...titleBlock("SEO Audit - Executive Summary"));

ex.push(H("Headline", HeadingLevel.HEADING_1));
ex.push(
  P(
    "The site has been under sitewide Google suppression since 17 July (impressions −88.5%, average position 27.3 → 70.4), and the analytics being used to track the recovery are measuring bot traffic rather than customers - so the single biggest lever right now is restoring trustworthy measurement before judging any of the recovery work.",
  ),
);

ex.push(H("Top 3 findings", HeadingLevel.HEADING_1));
ex.push(
  ...[
    'GA4 records 115,318 "google / organic" sessions in a window where Search Console reports 3,483 clicks - a 33x gap, at 99.2% engagement and zero conversions. Ubersuggest is fed from the same connection and reports 114,803 traffic for a site Semrush models at 32 visits per month.',
    "The backlink profile contains three spam networks - several hundred auto-generated directory domains, a fake press-release network, and a Moldovan link-shortener PBN - most of which appeared in mid-June, weeks before the suppression. One anchor text is literally an advert for buying PBN links.",
    "The homepage, which lost more than any other page (position 34.1 → 73.9), has no H1 and a duplicate title tag.",
  ].map(
    (t, i) =>
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
      ["Block the bot traffic and switch reporting to Search Console impressions and average position", "M", "L"],
      ["Review and upload the generated disavow file (604 domains) - and cancel whatever is generating the links", "S", "L"],
      ["Add an H1 and a unique title tag to the homepage", "S", "L"],
    ],
    [6560, 1400, 1400],
  ),
);
ex.push(P("These sit alongside, not instead of, the 4 August recovery pack - whose diagnosis of the suppression stands and whose steps should be worked as written."));

ex.push(H("Read the full audit", HeadingLevel.HEADING_1));
ex.push(P("juicy-designs-seo-audit.docx - measurement snapshot, 23-point validation scorecard, six red flags, seven yellow flags and a 19-item prioritised roadmap."));
ex.push(P("Technical detail and fix instructions: fixes/AUGUST-ADDENDUM.md. Disavow file ready to review: fixes/disavow-juicydesigns.txt."));

const exDoc = new Document({ styles, numbering, sections: [{ ...pageSetup, children: ex }] });

// ---------- write ----------
(async () => {
  const out = process.argv[2] || ".";
  fs.writeFileSync(`${out}/juicy-designs-seo-audit.docx`, await Packer.toBuffer(auditDoc));
  fs.writeFileSync(`${out}/juicy-designs-seo-audit-summary.docx`, await Packer.toBuffer(exDoc));
  console.log("written to", out);
})();
