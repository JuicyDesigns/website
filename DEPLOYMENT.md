# AI Discovery Files — Deployment Guide

This repo holds the AI discovery files for **juicydesigns.co.za**, implementing the
Complete tier of the [AI Discovery Files specification](https://www.ai-visibility.org.uk/specifications/) (v1.11.0).

The live site is hosted on a LiteSpeed server behind Cloudflare (not deployed from
this repo), so these files must be uploaded to the site's document root
(`public_html/`) via cPanel File Manager or FTP/SFTP.

## Files to upload

| File | Purpose | Content-Type to serve |
|---|---|---|
| `robots.txt` | Crawler access (all search + AI crawlers allowed) | `text/plain` |
| `llms.txt` | Canonical AI-readable business identity and site map | `text/plain; charset=utf-8` |
| `llm.txt` | Compatibility variant — prefer a 301 redirect (below) | `text/plain; charset=utf-8` |
| `llms.html` | Human-readable version with Organization JSON-LD | `text/html; charset=utf-8` |
| `ai.txt` | AI usage permissions, restrictions, attribution | `text/plain; charset=utf-8` |
| `ai.json` | Machine-parseable version of ai.txt | `application/json; charset=utf-8` |
| `identity.json` | Structured canonical identity data | `application/json; charset=utf-8` |
| `brand.txt` | Brand naming conventions and voice | `text/plain; charset=utf-8` |
| `faq-ai.txt` | Q&A optimised for AI consumption | `text/plain; charset=utf-8` |
| `developer-ai.txt` | Public API / MCP server context | `text/plain; charset=utf-8` |
| `robots-ai.txt` | AI crawler-specific directives | `text/plain; charset=utf-8` |
| `facts.json` | Full Schema.org JSON-LD graph (org, team, services, pricing) | `application/json; charset=utf-8` |

## Recommended .htaccess additions

The spec prefers `/llm.txt` as a **301 redirect** to `/llms.txt` (single source of
truth). If the redirect is configured, delete the physical `llm.txt` copy. LiteSpeed
honours Apache `.htaccess` syntax:

```apache
# llm.txt -> llms.txt (single source of truth)
Redirect 301 /llm.txt /llms.txt

# Correct content types for AI discovery files
<FilesMatch "^(ai|identity)\.json$">
    ForceType 'application/json; charset=utf-8'
</FilesMatch>
<FilesMatch "^(llms|ai|brand|faq-ai|developer-ai|robots-ai)\.txt$">
    ForceType 'text/plain; charset=utf-8'
</FilesMatch>
```

## After uploading, verify

```bash
for f in robots.txt llms.txt llm.txt llms.html ai.txt ai.json identity.json brand.txt faq-ai.txt developer-ai.txt robots-ai.txt; do
  curl -s -o /dev/null -w "%{http_code} %{content_type} /$f\n" "https://www.juicydesigns.co.za/$f"
done
```

All files should return `200`. Cloudflare caches these paths for ~2 minutes, so
changes appear almost immediately.

## Audit roadmap implementation status (30 July 2026)

Done in this repo (live once uploaded / published):

- [x] AI discovery files + facts.json (root of repo)
- [x] Five optimised blog articles with schema and hero images (`blog/`, `images/blog/`)
- [x] Internal links from the new articles into striking-distance URLs
- [x] Guide-page schema fixes, ready to paste (`fixes/guide-pages-author-schema.json`, `fixes/guide-pages-faqpage-schema-template.json`)
- [x] Facebook-ads-cost refresh pack (`fixes/facebook-ads-cost-refresh.md`)
- [x] Top-brands refresh brief (`fixes/top-brands-refresh-brief.md`)
- [x] Internal-links map + Pretoria intent split + URL consolidation flag (`fixes/internal-links-map.md`)
- [x] IndexNow key file (`f8de394f2aad92206d1d54f590c498a4.txt`), submit script, and 384-URL list (`scripts/`)

Needs an account owner (cannot be done from the repo):

- [ ] Upload everything above to `public_html/` and run the verification script
- [ ] GSC request-indexing schedule, days 1-19 (spreadsheet delivered 30 July)
- [ ] Register site in Bing Webmaster Tools, then run `scripts/indexnow-submit.sh scripts/indexnow-urls.txt`
- [ ] Apply the fixes/ packs to the live WordPress pages
- [ ] 301 `/services/search-engine-optimisation/` → `/services/seo/`
- [ ] Create the Wikidata item for Juicy Designs (Pty) Ltd
- [ ] Benchmarks citation outreach + client partner-page link programme
- [ ] Enable Ubersuggest tracked AI prompts (20 unused slots) and approve the gated connector tools

## Keeping files in sync

`llms.txt` is canonical. When facts change (address, phone, services, team),
update `identity.json` and `llms.txt` first, then mirror the change in `ai.txt` /
`ai.json`, `brand.txt`, `faq-ai.txt`, and `llms.html`. The business name, URL, and
contact details must stay identical across all files.
