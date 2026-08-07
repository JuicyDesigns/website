#!/usr/bin/env bash
#
# build-disavow.sh - generate a Google disavow file for juicydesigns.co.za
#
# The referring-domain profile contains a large auto-generated directory/PBN
# network that appeared in mid-June 2026 (see fixes/AUGUST-ADDENDUM.md, finding
# A3). This script turns a Semrush referring-domains export into a disavow file
# so the list can be regenerated as new spam domains appear, rather than
# hand-maintained.
#
# USAGE
#   1. Semrush > Backlink Analytics > juicydesigns.co.za > Referring Domains
#      > Export > CSV. Save as refdomains.csv.
#   2. ./scripts/build-disavow.sh refdomains.csv > fixes/disavow-juicydesigns.txt
#   3. REVIEW THE OUTPUT BY HAND before uploading. Never submit unreviewed.
#   4. Upload at https://search.google.com/search-console/disavow-links
#
# The export is expected to contain a "Domain" column and an authority column
# ("Domain Score" / "Authority Score"); separator may be ';' or ','.
#
# SAFETY: disavowing a legitimate link costs you that link's value. The score
# threshold is deliberately low (<= MAX_SCORE) and the pattern list deliberately
# narrow, so the default output is conservative. Widen it only with evidence.

set -euo pipefail

CSV="${1:-}"
MAX_SCORE="${MAX_SCORE:-7}"

if [[ -z "$CSV" || ! -f "$CSV" ]]; then
    echo "usage: $0 <semrush-refdomains-export.csv>" >&2
    exit 2
fi

# Auto-generated directory-spam network. Every observed member is a throwaway
# .com/.net on Cloudflare with authority score 2, built from a fixed vocabulary
# of local-directory words. Matching on the generator's own naming grammar
# catches members that have not been crawled yet.
DIRSPAM_RE='^(best|find|my|near|top|trusted|verified|quick|reliable|search|shop|support|your|zip|urban|region|city|town|local)[a-z0-9]*(biz|business|local|near|service|shop|store|vendor|directory|listing|expert|pro|company|companies|contractor|finder)[a-z0-9]*\.(com|net)$'

# Throwaway gTLDs used almost exclusively by the link networks in this profile.
JUNK_TLD_RE='\.(sbs|cfd|monster|icu|top|xyz|store|homes|website|site|party|cloud)$'

# Explicit list: domains confirmed by inspection as PBN, fake-press-release,
# link-shortener or paid-link networks. Includes the sources of the two
# spam anchor texts documented in fixes/AUGUST-ADDENDUM.md finding A3.
EXPLICIT=$(cat <<'EOF'
4mark.net
africainthenews.com
africamarketingindustrynews.com
africanewsguide.com
agentery.com
americanbusinesstimes.com
analyticshaven.top
anchorurl.cloud
annikabansal.com
atomizelink.icu
awnews.org
aweblist.org
backlinks-checker.com
baltimorenewsjournal.com
blogsphere.top
breakingcrypto.io
brickvest.com
buyersdesire.org
buzzshrink.website
byteshort.xyz
californiaconsumerbanking.com
capetownjournal.com
carboo.st
creativeposts.top
dailymusings.top
digitaladblog.com
directorylinkservice.com
duovoltart.com
filmtelevisionauditions.com
idolslot.xyz
industrystandardsouthafrica.com
itpressreleases.com
lamora.net
lmcordoba.com.ar
lydiaroyrealestate.com
marketminute.com
marketresearchjournals.com
matomyseo.com
mebeing.center
metamagic.top
militaryparenting.org
newsblaze.com
newsblogsports.site
newsnetmedia.com
noah-news.com
oneworlddailybrief.com
optimizeflow.top
pressreleasecc.com
pretoriapressdaily.com
pspl.com
scitechnewsnetwork.com
seodomains.website
southafricareport.com
southsudantechnologywire.com
sportsadvantage.com
technologypressreleases.com
thecloudherald.com
todaysartsnewssouthafrica.com
ukbusinessreporter.com
universalpressrelease.com
urls-shortener.eu
webanditnews.com
worldwidenewsnow.com
EOF
)

# Never disavow these, regardless of score - real editorial or citation links.
ALLOWLIST_RE='^(designrush|bizcommunity|windy|crunchbase|myspace|expatriates|devpost|natlawreview|financialcontent|einpresswire|observer-reporter|instapaper|booklikes|topseos|intensedebate|hulkshare|acompio|tntcode|digitalmarketingdeal|goodtal|shopstar|adios|gov|social9|martechseries|bash|getmonero|matkafasi)\.'

# Normalise the export: strip quotes/BOM, drop the header, take the domain and
# score columns whichever separator was used.
NORMALISED=$(
    sed -e '1s/^\xEF\xBB\xBF//' -e 's/"//g' "$CSV" \
    | awk 'NR>1' \
    | awk -F'[;,]' '{
        gsub(/^[ \t]+|[ \t]+$/, "", $1)
        gsub(/^[ \t]+|[ \t]+$/, "", $2)
        if ($1 != "") print tolower($1) "\t" ($2 == "" ? 0 : $2)
      }'
)

MATCHED=$(
    {
        printf '%s\n' "$EXPLICIT"
        printf '%s\n' "$NORMALISED" | awk -F'\t' -v max="$MAX_SCORE" \
            -v dir="$DIRSPAM_RE" -v junk="$JUNK_TLD_RE" '
            $2 + 0 <= max && ($1 ~ dir || $1 ~ junk) { print $1 }'
    } | grep -Ev "$ALLOWLIST_RE" | sort -u
)

COUNT=$(printf '%s\n' "$MATCHED" | grep -c . || true)
TOTAL=$(printf '%s\n' "$NORMALISED" | grep -c . || true)

# Two review aids, because a flat list of several hundred domains is not
# actually reviewable.
#
# 1. Disavowed despite a respectable authority score. These come from the
#    explicit list, so each one is a deliberate human call rather than a
#    pattern match. Surfacing them is the difference between a reviewer
#    checking 8 judgement calls and skimming 600 lines.
HIGH_AUTH_DISAVOWED=$(
    printf '%s\n' "$NORMALISED" | awk -F'\t' '$2 + 0 >= 10 { print $1 "\t" $2 }' \
    | while IFS=$'\t' read -r d sc; do
        if printf '%s\n' "$MATCHED" | grep -qx "$d"; then
            printf '#   %-34s (authority %s)\n' "$d" "$sc"
        fi
      done
)

# 2. Kept, but the name matches the directory-network grammar and only the
#    score threshold spared it. These are the most likely false negatives.
BORDERLINE_KEPT=$(
    printf '%s\n' "$NORMALISED" | awk -F'\t' -v dir="$DIRSPAM_RE" \
        '$2 + 0 > 7 && $1 ~ dir { print $1 "\t" $2 }' \
    | while IFS=$'\t' read -r d sc; do
        if ! printf '%s\n' "$MATCHED" | grep -qx "$d"; then
            printf '#   %-34s (authority %s)\n' "$d" "$sc"
        fi
      done
)

cat <<EOF
# Disavow file - juicydesigns.co.za
# Generated by scripts/build-disavow.sh from $(basename "$CSV")
#
# Source profile: $TOTAL referring domains in the export.
# Disavowed here: $COUNT domains - the explicit confirmed list, plus every
# export row with authority score <= $MAX_SCORE matching a known spam network.
# (The explicit list is always included, so this count can exceed the number of
# matches found in a partial export.)
#
# Rationale (see fixes/AUGUST-ADDENDUM.md, finding A3): the profile contains an
# auto-generated local-directory network, a fake-press-release network, and
# link-shortener PBNs, the bulk of which first appeared in mid-June 2026. Two
# anchor texts are overtly commercial link-selling copy. Juicy Designs did not
# earn these links editorially.
#
# Domain-level entries are used deliberately: these networks rotate URLs within
# the same registrations, so per-URL entries would go stale immediately.
#
# REVIEW BEFORE UPLOAD. Disavowing a good link discards its value.
# Upload: https://search.google.com/search-console/disavow-links
#
# ---------------------------------------------------------------------------
# CHECK THESE FIRST: disavowed despite an authority score of 10 or more.
# Each is a deliberate call from the explicit list, not a pattern match, so
# each is worth confirming before upload.
$HIGH_AUTH_DISAVOWED
#
# ---------------------------------------------------------------------------
# ALSO CHECK: kept, but the domain name matches the directory-network naming
# grammar and only the authority threshold spared it. These are the most
# likely misses. Add them to the explicit list in build-disavow.sh if they
# turn out to be network members.
$BORDERLINE_KEPT
# ---------------------------------------------------------------------------

EOF

printf '%s\n' "$MATCHED" | sed 's/^/domain:/'
