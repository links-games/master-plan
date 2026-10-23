#!/usr/bin/env bash
# Install the official, checksum-pinned Linux build, including Sapling and OIDN.
set -euo pipefail
destination="${1:-/tmp/master-plan-blender}"
archive="${destination}.tar.xz"
mkdir -p "$destination"
curl --fail --location --retry 3 \
  https://download.blender.org/release/Blender4.0/blender-4.0.2-linux-x64.tar.xz \
  --output "$archive"
printf '%s  %s\n' 5583a5588736da8858c522ef17fff5d73be59c47a6fe91ad29c6f3263e22086a "$archive" | sha256sum --check
tar -xf "$archive" -C "$destination" --strip-components=1
"$destination/blender" --version
