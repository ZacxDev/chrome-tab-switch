#!/usr/bin/env bash
# Package the extension's runtime files into a versioned zip for the
# Chrome Web Store. Dev-only files (tests, configs, node_modules, the SVG
# source, CI) are deliberately excluded.
set -euo pipefail

cd "$(dirname "$0")/.."

# Files that actually ship inside the extension.
RUNTIME_FILES=(
  manifest.json
  background.js
  tab-switch.js
  icon16.png
  icon32.png
  icon48.png
  icon128.png
)

VERSION="$(jq -r '.version' manifest.json)"
NAME="$(jq -r '.name' manifest.json | tr '[:upper:] ' '[:lower:]-')"
OUT="${NAME}-${VERSION}.zip"

# Verify every runtime file is present before packaging.
for f in "${RUNTIME_FILES[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "error: missing runtime file '$f'" >&2
    exit 1
  fi
done

rm -f "$OUT"
zip -q "$OUT" "${RUNTIME_FILES[@]}"

echo "Built $OUT ($(du -h "$OUT" | cut -f1))"
echo "Contents:"
unzip -l "$OUT" | tail -n +2
