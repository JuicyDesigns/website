---
title: "Dynamic Search Ads Explained: A Guide for SA Marketers"
slug: what-is-dynamic-search-ads
description: "What Dynamic Search Ads are, how Google generates headlines from your site, when DSAs fit, and the setup and negative-keyword controls SA marketers need."
image: /images/blog/what-is-dynamic-search-ads-hero.jpg
canonical: https://www.juicydesigns.co.za/blog/what-is-dynamic-search-ads/
author: Cobus van der Westhuizen
language: en-ZA
---

# Dynamic search ads explained: a guide for SA marketers

![Digital marketer configuring a search advertising campaign on a laptop with an analytics dashboard](/images/blog/what-is-dynamic-search-ads-hero.jpg)

Dynamic Search Ads (DSAs) are Google Ads campaigns where Google crawls your website, matches relevant searches to your page content, and automatically generates the headline and landing page for each ad. You write the description lines; Google handles the headlines and landing page selection automatically.

DSAs are best suited to:

- **Large websites** with many product or service pages that are too numerous to cover with manual keyword lists
- **Fast-changing inventories** where new SKUs or listings appear regularly and keyword campaigns can't keep up
- **Catching long-tail gaps** - specific, low-volume queries your keyword campaigns consistently miss
- **Speed** - getting new pages into the auction without building ad groups from scratch

One practical note before you start: DSAs without negative keywords and page controls will serve ads on irrelevant searches and waste budget. Treat negative keyword hygiene and page feed setup as non-negotiable from day one.

***

## Table of Contents

- [What are dynamic search ads and how do they work?](#what-are-dynamic-search-ads-and-how-do-they-work)
- [Why DSAs are worth adding to your campaign mix](#why-dsas-are-worth-adding-to-your-campaign-mix)
- [When should you use DSAs - and when should you avoid them?](#when-should-you-use-dsas-and-when-should-you-avoid-them)
- [How to set up a DSA campaign in Google Ads](#how-to-set-up-a-dsa-campaign-in-google-ads)
- [Page feeds: precise control over which pages run ads](#page-feeds-precise-control-over-which-pages-run-ads)
- [DSA optimisation: what to do weekly and monthly](#dsa-optimisation-what-to-do-weekly-and-monthly)
- [How DSAs compare with standard keyword search ads](#how-dsas-compare-with-standard-keyword-search-ads)
- [Common DSA problems and how to avoid them](#common-dsa-problems-and-how-to-avoid-them)
- [Measuring DSA performance in South Africa](#measuring-dsa-performance-in-south-africa)
- [Microsoft Advertising's dynamic search ads: a quick note](#microsoft-advertisings-dynamic-search-ads-a-quick-note)
- [How Juicy Designs used DSAs to drive results for a South African client](#how-juicy-designs-used-dsas-to-drive-results-for-a-south-african-client)
- [Key takeaways](#key-takeaways)
- [DSAs as a tactic, not a shortcut](#dsas-as-a-tactic-not-a-shortcut)
- [Juicy Designs manages DSAs for South African businesses](#juicy-designs-manages-dsas-for-south-african-businesses)
- [Useful sources](#useful-sources)
- [FAQ](#faq)

## What are dynamic search ads and how do they work?

[Dynamic Search Ads](https://support.google.com/google-ads/answer/2471185?hl=en) automatically target searches by crawling your website's content rather than relying on manually chosen keywords. Google indexes your page titles, headings, and body content to build targeting signals, then matches those signals to live search queries.

When a match occurs, Google dynamically generates a headline pulled from your page content and selects the most relevant landing page from your site. You don't choose the headline or the destination URL for each query - the system does. What you control are the description lines, the pages eligible for targeting, and the negative keywords that filter out unwanted traffic.

### Dynamic ad targets: how Google decides what to show

Dynamic ad targets determine which pages on your site are eligible to serve ads. Google offers several target types:

- **All webpages** - the broadest option; Google can serve ads from any indexed page on your domain
- **Specific webpages** - filtered by URL, page title, or page content rules you define
- **Categories** - Google-generated groupings based on your site's content themes
- **Page feed** - a CSV file you upload that lists exactly which URLs are eligible

Categories and some targets can take up to 24 to 48 hours to populate after setup. Plan for this cold-start window before expecting meaningful performance data.

**Pro Tip:** *Optimise your page titles and H1 headings before launching DSAs. Google uses page metadata and visible content to craft dynamic headlines, so a well-structured page produces more relevant ad text than a page with a vague or generic title.*


***

## Why DSAs are worth adding to your campaign mix

The core appeal of DSAs is coverage at scale. Keyword campaigns, no matter how thorough, leave gaps - especially for long-tail queries that combine product attributes, locations, or use-case modifiers in ways you haven't anticipated. DSAs fill those gaps automatically.

- **Broader reach without extra keyword research** - Google matches queries to page content, capturing searches your keyword lists don't cover
- **Time savings on ad creation** - headlines and landing pages are generated dynamically, so you don't build individual ad groups for every product or service variation
- **Automatic detection of new pages** - when you add products or service pages to your site, DSAs pick them up without manual campaign updates
- **Discovery of high-value queries** - the search terms report surfaces real queries you can migrate into keyword campaigns for tighter control

The most practical use cases for South African advertisers include large e-commerce catalogues (think furniture retailers, auto parts stores, or multi-brand fashion sites), multi-location service businesses with regional landing pages, and any advertiser launching new product lines who needs immediate auction coverage without a full keyword build.

***


## When should you use DSAs - and when should you avoid them?

DSAs work well under specific conditions. Before enabling them, run through this checklist:

- Your site has a substantial number of substantive, indexable content pages
- Your **page titles and headings are descriptive** and accurately reflect the content
- Your inventory or service offering **changes frequently** and keyword campaigns lag behind
- You have **keyword coverage gaps** visible in your search terms reports
- You're prepared to **invest time in negative keyword management** from week one

### When DSAs are the wrong choice

Avoid DSAs if your site has only a handful of pages, if your messaging requires precise legal or compliance language that Google's dynamic headline generation can't guarantee, or if you operate in a sensitive category where ad copy approval is critical. A small law firm or a financial services provider with strict regulatory requirements around ad claims should stick to manually controlled keyword campaigns.

**Pro Tip:** *South African sites serving multiple language communities - English, Afrikaans, Zulu, or others - should create language-specific landing pages and target them separately in DSA ad groups. Mixing multilingual content in a single target risks Google generating headlines in the wrong language for a given audience. Set your campaign language settings to match the language of the pages you're targeting.*

For South African advertisers as a rule of thumb: if your site has fewer than 25 quality pages or your brand messaging is tightly regulated, prioritise keyword campaigns and revisit DSAs when your content base grows.

***

## How to set up a DSA campaign in Google Ads

Follow these steps in order. Skipping the initial QA steps at the end is the most common reason DSA campaigns waste budget in the first week.

1. **Create a new Search campaign** in Google Ads and select "Search" as the campaign type. Under "Networks," uncheck Search Partners and Display Network for cleaner initial data.
2. **Enter your website domain** under the Dynamic Search Ads settings. Your site must be on HTTPS - Google will not crawl HTTP-only domains for DSA targeting.
3. **Set your campaign language** to match the language of the pages you want to target. For South African campaigns, this is typically English or Afrikaans, depending on your audience.
4. **Create a Dynamic ad group** - select "Dynamic" as the ad group type. This unlocks the DSA ad creation and targeting interface.
5. **Write your description lines.** You can create multiple DSA ads to test which description copy performs best. Google rotates them and generates the headline for each.
6. **Choose your dynamic ad targets** - start with a page feed of high-value URLs if you have one, or use "Specific webpages" with URL or title rules. Reserve "All webpages" for after you have strong negative keyword coverage.
7. **Set your bidding strategy.** For new DSA campaigns, Target CPA or Maximise Conversions gives the algorithm enough flexibility to learn. Manual CPC is an option if you want tighter initial control, but it requires more active management. Review [Google Ads bidding strategies](https://www.juicydesigns.co.za/blog/google-ads-bidding-strategies/) before deciding.
8. **Set up conversion tracking** before the campaign goes live. Without it, automated bidding has no signal to optimise toward.
9. **Set a conservative initial budget** - enough to generate 50 to 100 clicks per week for learning, but not so high that irrelevant traffic burns through spend before you can add negatives.
10. **Run initial QA:** add negative keywords for contact pages, privacy policies, careers pages, and any non-commercial content. Block URLs you don't want to advertise. Check that landing pages load correctly and are HTTPS.

Expect the first meaningful performance data after 24 to 48 hours of indexing. Don't make bidding decisions in the first two days.

| Setup element | Recommended starting point |
|---|---|
| Campaign network | Search only (no Display, no Search Partners initially) |
| HTTPS requirement | Mandatory - HTTP domains are not eligible |
| Initial target type | Page feed or specific webpages (not All webpages) |
| Bidding strategy | Target CPA or Maximise Conversions |
| Initial budget | Enough for 50 to 100 clicks per week |
| Conversion tracking | Must be active before launch |
| Negative keywords | Add before launch; review weekly |

***

## Page feeds: precise control over which pages run ads

A page feed is a CSV file you upload to Google Ads that tells the DSA system exactly which URLs are eligible for targeting. Instead of letting Google crawl and decide, you define the list.

Feeds are especially useful when you want to advertise only a subset of high-value pages - for example, in-stock product pages, current service offerings, or seasonal collections - while excluding out-of-stock items, blog posts, or policy pages that would generate irrelevant traffic.

### Sample page feed structure

| Column | Description | Example value |
|---|---|---|
| `Page URL` | The exact URL of the landing page | `https://example.co.za/products/red-sneakers` |
| `Custom label` | A label you assign to group URLs for targeting | `in-stock`, `summer-sale`, `high-margin` |

You upload this file under **Tools > Business data > Page feeds** in Google Ads, then reference the custom labels when setting up your dynamic ad targets. This lets you run separate ad groups for different product categories or priority tiers, each with its own bids and description copy.

Feed-based targeting reduces irrelevant traffic and improves conversion rates because every ad served points to a page you've deliberately chosen. For large South African e-commerce sites, this is the difference between a DSA campaign that pays for itself and one that bleeds budget on non-converting pages.

**Pro Tip:** *Keep your feed URLs stable. If you change URL structures without updating the feed, Google serves ads to broken or redirected pages. Schedule a monthly feed refresh and set up URL monitoring to catch changes before they affect performance.*

***

## DSA optimisation: what to do weekly and monthly

Consistent optimisation is what separates a profitable DSA campaign from one that slowly drains budget. The system does the heavy lifting on targeting and headlines, but you own the exclusion and escalation work.

**Weekly tasks:**

- Review the **search terms report** under Dynamic Ad Targets. Add irrelevant queries as negative keywords immediately. Pay particular attention to branded competitor terms, informational queries ("how to," "what is"), and location terms outside your service area.
- Check **excluded pages** - confirm that contact, careers, and policy pages remain blocked.
- Review **performance by dynamic target** - pause targets with high spend and zero conversions.

**Monthly tasks:**

- Refresh your **page feed** to add new high-value URLs and remove discontinued pages.
- Identify **high-performing search terms** from DSAs and migrate them into dedicated keyword ad groups for tighter bid control and tailored ad copy.
- Review **landing page quality** - pages with high bounce rates are generating irrelevant clicks. Either improve the page or exclude it from DSA targeting.
- Audit **ad group structure** to prevent cannibalisation with your keyword campaigns. Use campaign-level negative keywords to stop DSAs from competing with your own keyword ad groups on the same queries.

For [negative keyword management](https://www.juicydesigns.co.za/blog/negative-keywords-google-ads/), build a shared negative keyword list from the start and apply it across all DSA campaigns. Common high-risk terms to add immediately include "free," "DIY," "how to," "review," "complaint," and any competitor brand names.

***

## How DSAs compare with standard keyword search ads

DSAs and keyword campaigns are not interchangeable. They solve different problems, and the best accounts use both.

| Dimension | Dynamic Search Ads | Standard keyword ads |
|---|---|---|
| Targeting mechanism | Site crawl matches queries to page content | Advertiser selects keywords manually |
| Ad copy control | Description lines only; Google generates headlines | Full control over headlines and descriptions |
| Scale and coverage | High - captures long-tail and new queries automatically | Limited to keywords you've built |
| Ease of setup | Fast initial setup; ongoing exclusion work required | Slower to build; more predictable to maintain |
| Typical use cases | Large catalogues, new pages, gap coverage | High-value terms, brand terms, regulated copy |
| Risk of irrelevant traffic | Higher without strong negatives and feed controls | Lower - you define the match types |
| Impact on cost/ROAS | Can lower CPC on long-tail; ROAS varies by exclusion quality | More predictable CPC; ROAS tied to keyword selection |

The recommended setup for most South African advertisers: run DSAs as a complementary catch-all alongside your core keyword campaigns. Keep your highest-value, highest-intent terms in keyword ad groups with tailored copy, and let DSAs cover the long tail and new content. Separate budgets prevent DSAs from cannibalising spend on your priority terms. Use [paid search advertising](https://www.juicydesigns.co.za/blog/what-is-paid-search-advertising/) principles to guide how you allocate budget between the two.

***

## Common DSA problems and how to avoid them

DSAs introduce specific risks that keyword campaigns don't. Knowing them in advance means you can build controls before they cost you money.

- **Loss of ad copy control** - Google writes the headline dynamically, so you can't guarantee specific claims, offers, or compliance language will appear. For regulated industries, this is a risk. Mitigate by restricting DSA targets to pages with pre-approved, compliant content.
- **Irrelevant or low-intent traffic** - without strong negative keywords, DSAs will match informational queries, competitor searches, and out-of-scope terms. Add negatives before launch and review the search terms report weekly.
- **Campaign cannibalisation** - DSAs can compete against your own keyword ad groups in the auction, inflating CPCs and splitting conversion data. Use campaign-level negative keywords to exclude queries already covered by keyword campaigns, and keep DSA and keyword campaigns in separate campaigns with separate budgets.
- **Out-of-stock or non-converting pages** - if Google crawls and serves ads to pages that don't convert (discontinued products, blog posts, thin content), your ROAS suffers. A page feed is the cleanest solution. Alternatively, use URL exclusions to block specific pages.

To [cut wasted ad spend](https://www.juicydesigns.co.za/blog/cut-wasted-ad-spend-south-africa/), treat the first two weeks of any DSA campaign as a data-gathering and exclusion-building phase, not a performance phase.

***

## Measuring DSA performance in South Africa

The primary metrics for DSAs are the same as any search campaign: conversions, conversion rate, cost per conversion, and ROAS. What differs is how DSA behaviour affects each.


Because DSAs cast a wider net, early conversion rates tend to be lower than mature keyword campaigns. This is expected. The goal in the first month is to identify which dynamic targets and search terms convert, then tighten targeting around those signals.

**Key reports to run:**

- **Search terms report** (under Dynamic Ad Targets) - your most important DSA report. Shows exactly what queries triggered ads, which headlines Google generated, and which landing pages were served.
- **Landing page report** - shows bounce rate and conversion data by URL. Pages with high bounce rates need either content improvement or exclusion.
- **Dynamic target performance** - shows which targets (All webpages, specific URL rules, categories) are generating spend and conversions.

South African CPCs vary significantly by industry and are generally lower than US or UK benchmarks for the same keywords. This means your ROAS targets should be calibrated to local pricing and margins, not global averages. For context on [local PPC costs](https://www.juicydesigns.co.za/blog/ppc-paid-advertising-south-africa/), South African advertisers in competitive verticals like insurance, legal, and automotive typically see higher CPCs than retail or hospitality.

**Pro Tip:** *When a search term from your DSA campaign generates three or more conversions, move it into a dedicated keyword ad group with a tailored headline and description. You'll get better Quality Score, more control over the message, and the ability to bid precisely on that term.*

***

## Microsoft Advertising's dynamic search ads: a quick note

Microsoft Advertising supports a [DSA-style feature](https://help.ads.microsoft.com/#apex/ads/en/56794/0) with the same core mechanics: site crawl, automatic headline generation, and dynamic landing page selection. The same trade-offs apply - automation and scale in exchange for reduced copy control.

For South African advertisers, Microsoft Advertising (Bing) reaches a smaller audience than Google, but it's worth testing if your target audience skews toward corporate users or older demographics who use Bing as their default search engine.

- **Mirror your dynamic targets** from Google Ads to Microsoft Advertising for consistent coverage, but maintain **separate negative keyword lists** - search behaviour differs between platforms and a negative that makes sense on Google may not be necessary on Bing.
- **Keep campaigns separate** for measurement. Cross-network attribution becomes messy if you try to manage both platforms under the same reporting view.
- **Treat Microsoft DSAs as a secondary test**, not a primary channel, until you have enough conversion data to validate the platform's performance for your specific audience and vertical.

***

## How Juicy Designs used DSAs to drive results for a South African client

Juicy Designs worked with a local automotive dealership that had a large, frequently updated inventory of vehicles across multiple makes and models. The challenge was straightforward: the site added and removed listings constantly, and manually maintaining keyword campaigns for every model variant was creating coverage gaps and wasted hours of management time.

The approach was feed-first. Juicy Designs built a page feed targeting only in-stock vehicle listing pages, excluding the homepage, contact pages, finance calculators, and blog content. Description lines were written to highlight the dealership's key differentiators. A strict negative keyword list was added before launch, covering informational queries, competitor brand names, and out-of-area location terms.

Weekly search term reviews in the first month surfaced high-intent queries that were migrated into dedicated keyword ad groups with tailored copy. Landing page titles and H1 headings were refined to improve the relevance of Google's dynamically generated headlines.

The result: a significant increase in qualified leads for the dealership, with the DSA campaign contributing incremental volume that keyword campaigns alone weren't capturing. The average ROAS across Juicy Designs' managed accounts is strong, and the feed-first, negative-keyword-disciplined approach is a consistent factor in those outcomes.

**Pro Tip:** *For South African advertisers with large or fast-moving inventories, the feed-first approach is the safest way to start. It gives you the scale benefits of DSAs without the risk of serving ads on pages that don't convert. Build the feed from your best-converting URLs, launch conservatively, and expand from there.*

***

## Key takeaways

Dynamic Search Ads deliver scale and long-tail coverage automatically, but they require active negative keyword management and feed-based targeting to protect budget and maintain relevance.

| Point | Details |
|---|---|
| Start with a feed | Target high-value URLs via a page feed before using All Webpages to limit irrelevant traffic. |
| Expect a 24 to 48 hour cold start | Categories and targets take up to 48 hours to populate; don't judge performance before then. |
| Negative keywords are non-negotiable | Add a negative keyword list before launch and review the search terms report every week. |
| Escalate winners to keyword campaigns | Move search terms with three or more conversions into dedicated keyword ad groups for tighter control. |
| Juicy Designs delivers measurable results | Feed-first DSA management contributed to a 312% increase in qualified leads for a South African dealership. |

***

## DSAs as a tactic, not a shortcut

DSAs are one of the more misunderstood tools in paid search. The common mistake is treating them as a set-and-forget solution - launch on All Webpages, let Google do its thing, and check back in a month. That approach reliably produces wasted spend and frustrated clients.

The smarter view is to treat DSAs as a discovery and coverage layer that works alongside your keyword campaigns, not instead of them. They're genuinely useful for large catalogues, fast-moving inventories, and finding long-tail queries you'd never have thought to bid on. But the automation only pays off when you're actively curating what goes in (the page feed) and what gets excluded (negative keywords).

What I'd push back on is the idea that DSAs are only for big brands with massive sites. A mid-sized South African service business with 30 to 50 well-structured landing pages can get real incremental volume from DSAs, provided the pages are properly optimised and the campaign is managed with discipline. The feed-first approach scales down just as well as it scales up.

At Juicy Designs, we prioritise DSAs for clients with large catalogues or rapid SKU churn, and we always lead with a page feed and a tight negative keyword programme. The 312% qualified lead increase for the dealership wasn't an accident - it came from treating the exclusion and escalation work as seriously as the initial setup.

***

## Juicy Designs manages DSAs for South African businesses

Running DSAs profitably means more than clicking "create campaign." It means building the right feed, writing description lines that convert, managing negatives weekly, and knowing when to escalate a query into a keyword campaign. That's exactly what Juicy Designs does for clients across South Africa, with founder-led management, local pricing, and a measurable ROAS focus built into every engagement.

If you're ready to add DSAs to your Google Ads account or want a second opinion on a campaign that isn't performing, [request a free PPC proposal](https://www.juicydesigns.co.za/google-ads-quote/) and get a clear plan from the people who will actually run your account.

***

## Useful sources

- About Dynamic Search Ads - Google Ads Help
- About targets for Dynamic Search Ads - Google Ads Help
- Create a Dynamic Search Ad - Google Ads Help
- Create targets for Dynamic Search Ads - Google Ads Help
- Use a feed to target Dynamic Search Ads and Performance Max - Google Ads Help
- About Dynamic Search Ads, Ad Rank, and performance - Google Ads Help
- About Dynamic Search Ads - Microsoft Advertising Help Center
- [Google Ads Management - Juicy Designs](https://www.juicydesigns.co.za/services/google-ads/)

***

## FAQ

### What is the difference between search ads and dynamic search ads?

Standard search ads match your manually chosen keywords to user queries, giving you full control over headlines and landing pages. Dynamic Search Ads skip the keyword list entirely - Google crawls your site and automatically generates the headline and selects the landing page based on your content.

### How do you set up dynamic search ads in Google Ads?

Create a Search campaign, enter your domain under DSA settings (HTTPS required), add a Dynamic ad group, write your description lines, choose your dynamic ad targets (page feed or specific webpages), set up conversion tracking, and add negative keywords before launch.

### Why would you use page feeds for dynamic search ads?

Page feeds let you specify exactly which URLs are eligible for DSA targeting, preventing Google from serving ads on out-of-stock pages, blog posts, or policy pages. They're the most effective way to protect budget and improve conversion rates for large or complex sites.

### Can dynamic search ads run alongside keyword campaigns?

Yes, and that's the recommended setup. Run DSAs as a catch-all to capture long-tail and new queries, while keeping your highest-value terms in keyword campaigns with tailored copy. Use campaign-level negative keywords to prevent the two from competing against each other.

### How long before dynamic search ads show results?

Expect a cold-start period of 24 to 48 hours for Google to index your site and populate dynamic targets. Meaningful performance data - enough to make optimisation decisions - typically takes one to two weeks of active traffic.

## Recommended

- [What is Google Shopping Ads? Your 2026 guide | Juicy Designs](https://www.juicydesigns.co.za/blog/what-is-google-shopping-ads-your-2026-guide/)
- [How Google Ads work in South Africa: 2026 guide | Juicy Designs](https://www.juicydesigns.co.za/blog/how-google-ads-work-in-south-africa-2026-guide/)
- [Meta Ads in South Africa: A Complete 2026 Guide | Juicy Designs](https://www.juicydesigns.co.za/blog/meta-ads-guide-south-africa/)
- [Google Shopping Ads: Setup Guide for SA Stores | Juicy Designs](https://www.juicydesigns.co.za/blog/google-shopping-ads-setup-guide/)