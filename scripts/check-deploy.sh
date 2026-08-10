#!/usr/bin/env bash
#
# check-deploy.sh - verify that what .cpanel.yml claims to publish is actually live.
#
# Written 10 August 2026 after finding that 9 of the 12 AI discovery files
# return 404 on production, despite cPanel reporting a successful deployment on
# 4 August. A cPanel deploy that copies nothing looks identical, in the cPanel
# UI, to one that copied everything: same green tick, same "Last Deployed SHA".
# The only way to know is to ask the live site.
#
# Run this after every deploy. It exits non-zero if anything is missing or is
# being served with the wrong content type.
#
# USAGE
#   ./scripts/check-deploy.sh                     # check production
#   ./scripts/check-deploy.sh https://staging...  # check another origin
#
# The file list and expected content types are taken from .cpanel.yml and
# DEPLOYMENT.md. Keep them in step if either changes.

set -uo pipefail

ORIGIN="${1:-https://www.juicydesigns.co.za}"
FAIL=0

# file                             expected content-type fragment
FILES="
robots.txt                         text/plain
llms.txt                           text/plain
llm.txt                            text/plain
llms.html                          text/html
ai.txt                             text/plain
ai.json                            application/json
identity.json                      application/json
brand.txt                          text/plain
faq-ai.txt                         text/plain
developer-ai.txt                   text/plain
robots-ai.txt                      text/plain
facts.json                         application/json
f8de394f2aad92206d1d54f590c498a4.txt text/plain
"

printf 'Deploy check for %s\n\n' "$ORIGIN"
printf '  %-38s %-5s %-26s %s\n' "FILE" "CODE" "CONTENT-TYPE" "RESULT"
printf '  %-38s %-5s %-26s %s\n' "----" "----" "------------" "------"

while read -r f expected; do
    [[ -z "${f:-}" ]] && continue

    read -r code ctype <<<"$(curl -sS -o /dev/null \
        -w '%{http_code} %{content_type}' --max-time 30 "$ORIGIN/$f" 2>/dev/null)"
    ctype="${ctype%%;*}"

    if [[ "$code" != "200" ]]; then
        # A 301 on llm.txt is the documented preference: DEPLOYMENT.md wants it
        # redirecting to llms.txt rather than existing as a duplicate copy.
        if [[ "$f" == "llm.txt" && "$code" == "301" ]]; then
            printf '  %-38s %-5s %-26s OK (redirect, as documented)\n' "$f" "$code" "$ctype"
            continue
        fi
        printf '  %-38s %-5s %-26s NOT PUBLISHED\n' "$f" "$code" "$ctype"
        FAIL=1
        continue
    fi

    # A 200 that serves HTML for a .txt or .json file is a soft 404: the SPA
    # shell answering instead of the real file. That is worse than a hard 404,
    # because crawlers index the shell.
    if [[ "$ctype" != *"$expected"* ]]; then
        printf '  %-38s %-5s %-26s WRONG TYPE (expected %s)\n' "$f" "$code" "$ctype" "$expected"
        FAIL=1
        continue
    fi

    printf '  %-38s %-5s %-26s OK\n' "$f" "$code" "$ctype"
done <<<"$FILES"

printf '\n'
if (( FAIL )); then
    cat <<'EOF'
RESULT: failed.

A cPanel deploy reporting success does not mean these files reached
public_html. Check, in order:

  1. Is cPanel pointed at the repository that actually contains them?
     Git Version Control shows the Remote URL it pulls from.
  2. Does that repository have a .cpanel.yml at its root? Without one,
     cPanel clones the repo and copies nothing.
  3. Is the checked-out branch the one holding the files?
  4. Re-run this after the next deploy rather than trusting the green tick.
EOF
else
    printf 'RESULT: all files published and served with the expected content type.\n'
fi

exit $FAIL
