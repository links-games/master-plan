#!/usr/bin/env bash
# Report whether the repository's Dependency graph is enabled, which
# actions/dependency-review-action requires. Pull requests only get a warning
# so they are not blocked by a repository setting; other events (push to main,
# schedule) fail with the steps an admin has to take.
set -euo pipefail

: "${REPOSITORY:?REPOSITORY is required (owner/name)}"
event_name="${EVENT_NAME:-pull_request}"
output="${GITHUB_OUTPUT:-/dev/null}"
verbose="${DEPENDENCY_GRAPH_VERBOSE:-0}"

trace() { [ "${verbose}" = "1" ] && echo "[dependency-graph] $*" >&2 || true; }

settings_url="https://github.com/${REPOSITORY}/settings/security_analysis"

# The SBOM endpoint answers 404 when the Dependency graph is disabled.
if status="$(gh api "repos/${REPOSITORY}/dependency-graph/sbom" --silent 2>&1)"; then
  trace "SBOM request succeeded"
  echo "enabled=true" >>"${output}"
  echo "Dependency graph is enabled for ${REPOSITORY}."
  exit 0
fi
trace "SBOM request failed: ${status}"

if ! grep -q "HTTP 404" <<<"${status}"; then
  echo "::error::Could not check the Dependency graph of ${REPOSITORY}: ${status}"
  exit 1
fi

echo "enabled=false" >>"${output}"
message="Dependency graph is disabled for ${REPOSITORY}, so dependency review cannot run. A repository admin must enable it: ${settings_url} -> Dependency graph -> Enable."
if [ "${event_name}" = "pull_request" ]; then
  echo "::warning::${message} Skipping dependency review for this pull request; npm audit still runs."
  exit 0
fi
echo "::error::${message}"
exit 1
