#!/usr/bin/env bash
# Simulates a Windows checkout (core.autocrlf=true): copies the tracked files
# with CRLF line endings and runs the given tests there.
# Usage: bash experiments/crlf-checkout.sh tests/site.test.js ...
set -euo pipefail
repo=$(pwd)
dir=$(mktemp -d)
git ls-files -z | while IFS= read -r -d '' f; do
  mkdir -p "$dir/$(dirname "$f")"
  if grep -Iq . "$f" 2>/dev/null; then
    sed 's/\r*$/\r/' "$f" > "$dir/$f"
  else
    cp "$f" "$dir/$f"
  fi
done
ln -s "$repo/node_modules" "$dir/node_modules"
cd "$dir"
node --test --test-timeout=60000 "$@"
