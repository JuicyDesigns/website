#!/usr/bin/env bash
#
# check-sitemap.sh - verify sitemap coverage for juicydesigns.co.za
#
# Written after finding A11: /sitemap.xml silently collapsed from 1,763 URLs to
# 38 some time after 31 July 2026, dropping every service, blog, glossary and
# location page. Search Console did not flag it, because the six child sitemaps
# were submitted by hand and kept working - only discovery via robots.txt broke.
#
# A shrinking sitemap is invisible unless something counts it, so run this after
# any deploy that touches routing, and before resubmitting sitemaps in Search
# Console (RECOVERY-ACTIONS.md Step 6).
#
# USAGE
#   ./scripts/check-sitemap.sh                    # check the live site
#   ./scripts/check-sitemap.sh https://staging... # check another origin
#
# Exits non-zero if any check fails, so it can gate a deploy.

set -uo pipefail

ORIGIN="${1:-https://www.juicydesigns.co.za}"
FAIL=0

# Minimum URL counts. Set from the live figures on 8 August 2026, rounded down,
# so ordinary content growth never trips them but a collapse does.
declare -A MIN=(
    [sitemap-pages.xml]=45
    [sitemap-services.xml]=110
    [sitemap-blog.xml]=550
    [sitemap-glossary.xml]=650
    [sitemap-locations.xml]=230
    [sitemap-images.xml]=150
)

say()  { printf '%s\n' "$*"; }
pass() { printf '  PASS  %s\n' "$*"; }
fail() { printf '  FAIL  %s\n' "$*"; FAIL=1; }

fetch() { curl -sS --max-time 45 "$ORIGIN/$1" 2>/dev/null; }
count_loc()     { grep -c '<loc>' <<<"$1" || true; }
count_sitemap() { grep -c '<sitemap>' <<<"$1" || true; }

say "Sitemap check for $ORIGIN"
say ""

# --- 1. robots.txt advertises a sitemap -------------------------------------
say "robots.txt"
ROBOTS=$(fetch robots.txt)
ADVERTISED=$(grep -i '^Sitemap:' <<<"$ROBOTS" | awk '{print $2}' | tr -d '\r')
if [[ -n "$ADVERTISED" ]]; then
    pass "advertises $ADVERTISED"
else
    fail "no Sitemap: directive - crawlers cannot discover any sitemap"
fi
say ""

# --- 2. The advertised sitemap must be an index -----------------------------
# This is the check that would have caught A11. A flat urlset at the root means
# everything not listed in it is undiscoverable by normal crawling.
say "sitemap.xml"
ROOT=$(fetch sitemap.xml)
if [[ -z "$ROOT" ]]; then
    fail "could not fetch /sitemap.xml"
else
    N_CHILD=$(count_sitemap "$ROOT")
    N_URL=$(count_loc "$ROOT")
    if (( N_CHILD > 0 )); then
        pass "is a <sitemapindex> referencing $N_CHILD child sitemaps"
    else
        fail "is a flat <urlset> with $N_URL URLs, not a <sitemapindex>"
        fail "  child sitemaps are unreachable by crawlers following robots.txt"
    fi

    # Non-HTML files do not belong in a sitemap.
    STRAY=$(grep -o '<loc>[^<]*</loc>' <<<"$ROOT" \
            | sed 's|</\?loc>||g' | grep -E '\.(txt|json|xml)$' || true)
    if [[ -n "$STRAY" ]]; then
        fail "lists non-HTML files as pages:"
        while read -r u; do [[ -n "$u" ]] && printf '          %s\n' "$u"; done <<<"$STRAY"
    else
        pass "lists no non-HTML files"
    fi

    # Trailing-slash convention must match the canonical URLs (finding A9).
    NOSLASH=$(grep -o '<loc>[^<]*</loc>' <<<"$ROOT" | sed 's|</\?loc>||g' \
              | grep -vE '(/|\.(txt|json|xml))$' || true)
    if [[ -n "$NOSLASH" ]]; then
        say "  NOTE  $(wc -l <<<"$NOSLASH") URLs without a trailing slash; confirm this matches the canonical form"
    fi
fi
say ""

# --- 3. Each child sitemap is present and has not collapsed -----------------
say "child sitemaps"
for f in "${!MIN[@]}"; do
    BODY=$(fetch "$f")
    if [[ -z "$BODY" ]]; then
        fail "$f unreachable"
        continue
    fi
    N=$(count_loc "$BODY")
    if (( N >= MIN[$f] )); then
        pass "$(printf '%-24s %5s URLs (floor %s)' "$f" "$N" "${MIN[$f]}")"
    else
        fail "$(printf '%-24s %5s URLs - BELOW FLOOR %s' "$f" "$N" "${MIN[$f]}")"
    fi
done
say ""

if (( FAIL )); then
    say "RESULT: failed. See fixes/AUGUST-ADDENDUM.md finding A11."
else
    say "RESULT: all checks passed."
fi
exit $FAIL
