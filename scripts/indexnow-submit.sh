#!/usr/bin/env bash
# Submit URLs to IndexNow (Bing, Yandex, Seznam - feeds the index ChatGPT and
# Copilot answer from). Run AFTER uploading f8de394f2aad92206d1d54f590c498a4.txt to the site root and
# verifying https://www.juicydesigns.co.za/f8de394f2aad92206d1d54f590c498a4.txt returns the key.
# Usage: ./scripts/indexnow-submit.sh urls.txt   (one URL per line, max 10000)
set -euo pipefail
KEY="f8de394f2aad92206d1d54f590c498a4"
HOST="www.juicydesigns.co.za"
URLS_FILE="${1:?usage: indexnow-submit.sh urls.txt}"
python3 - "$URLS_FILE" << 'PY'
import json, sys, urllib.request
urls = [u.strip() for u in open(sys.argv[1]) if u.strip()]
body = json.dumps({
    "host": "www.juicydesigns.co.za",
    "key": "f8de394f2aad92206d1d54f590c498a4",
    "keyLocation": "https://www.juicydesigns.co.za/f8de394f2aad92206d1d54f590c498a4.txt",
    "urlList": urls,
}).encode()
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body,
    headers={"Content-Type": "application/json; charset=utf-8"})
resp = urllib.request.urlopen(req)
print("HTTP", resp.status, "- submitted", len(urls), "URLs")
PY
