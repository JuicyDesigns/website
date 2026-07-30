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

## Keeping files in sync

`llms.txt` is canonical. When facts change (address, phone, services, team),
update `identity.json` and `llms.txt` first, then mirror the change in `ai.txt` /
`ai.json`, `brand.txt`, `faq-ai.txt`, and `llms.html`. The business name, URL, and
contact details must stay identical across all files.
