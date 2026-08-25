#!/usr/bin/env bash
set -euo pipefail

readonly EXPECTED_REPOSITORY="robinswood-io/game-plug"
readonly EXPECTED_REPOSITORY_ID="1048351155"
readonly EXPECTED_REF="refs/heads/main"
readonly EXPECTED_WORKFLOW_REF="robinswood-io/game-plug/.github/workflows/deploy-production.yml@refs/heads/main"
readonly EXPECTED_JOB="deploy"
readonly EXPECTED_RUNNER="gameplug-canonical-deploy-01"
readonly EXPECTED_ACTOR="Aoleon"
readonly EXPECTED_ACTOR_ID="157592993"
readonly EXPECTED_EVENT="workflow_dispatch"

deny() {
  printf '::error::GamePlug deployment executor denied job: %s\n' "$1" >&2
  exit 78
}

verify_hook_installation() {
  local hook_file=${BASH_SOURCE[0]} mode uid gid
  [[ -f "$hook_file" && ! -L "$hook_file" ]] || deny "hook must be a regular non-symlink file"
  mode=$(/usr/bin/stat -c %a -- "$hook_file") || deny "hook metadata unavailable"
  uid=$(/usr/bin/stat -c %u -- "$hook_file") || deny "hook metadata unavailable"
  gid=$(/usr/bin/stat -c %g -- "$hook_file") || deny "hook metadata unavailable"
  [[ "$uid" == 0 && "$gid" == 0 ]] || deny "hook must be owned by root:root"
  [[ "$mode" == 555 ]] || deny "hook must be mode 0555"
}

require_equal() {
  local name=$1 expected=$2 actual=${!1-}
  [[ "$actual" == "$expected" ]] || deny "unexpected ${name}"
}

verify_hook_installation
require_equal GITHUB_ACTIONS true
require_equal GITHUB_REPOSITORY "$EXPECTED_REPOSITORY"
require_equal GITHUB_REPOSITORY_ID "$EXPECTED_REPOSITORY_ID"
require_equal GITHUB_REF "$EXPECTED_REF"
require_equal GITHUB_WORKFLOW_REF "$EXPECTED_WORKFLOW_REF"
require_equal GITHUB_JOB "$EXPECTED_JOB"
require_equal GITHUB_EVENT_NAME "$EXPECTED_EVENT"
require_equal GITHUB_ACTOR "$EXPECTED_ACTOR"
require_equal GITHUB_ACTOR_ID "$EXPECTED_ACTOR_ID"
require_equal GITHUB_TRIGGERING_ACTOR "$EXPECTED_ACTOR"
require_equal RUNNER_NAME "$EXPECTED_RUNNER"
require_equal RUNNER_ENVIRONMENT self-hosted

[[ -z "${GITHUB_HEAD_REF-}" && -z "${GITHUB_BASE_REF-}" ]] || deny "pull-request branch context present"
[[ "${GITHUB_SHA-}" =~ ^[0-9a-f]{40}$ ]] || deny "invalid commit SHA"
require_equal GITHUB_WORKFLOW_SHA "$GITHUB_SHA"
[[ -n "${GITHUB_EVENT_PATH-}" ]] || deny "event payload unavailable"

exec /usr/bin/python3 - "$GITHUB_EVENT_PATH" \
  "$EXPECTED_REPOSITORY" "$EXPECTED_REPOSITORY_ID" "$EXPECTED_REF" \
  "$EXPECTED_ACTOR" "$EXPECTED_ACTOR_ID" <<'PY'
import json
import sys
from pathlib import Path

path = Path(sys.argv[1])
expected_repository, expected_repository_id, expected_ref, expected_actor, expected_actor_id = sys.argv[2:]


def deny(reason: str) -> None:
    print(f"::error::GamePlug deployment executor denied job: {reason}", file=sys.stderr)
    raise SystemExit(78)


if not path.is_file():
    deny("event payload unavailable")
try:
    payload = json.loads(path.read_text(encoding="utf-8"))
except (OSError, UnicodeError, json.JSONDecodeError):
    deny("event payload unreadable")

repository = payload.get("repository") or {}
sender = payload.get("sender") or {}
if repository.get("full_name") != expected_repository:
    deny("payload repository mismatch")
if str(repository.get("id", "")) != expected_repository_id:
    deny("payload repository ID mismatch")
if payload.get("ref") != expected_ref:
    deny("payload ref mismatch")
if "pull_request" in payload:
    deny("pull-request payload present")
if sender.get("login") != expected_actor:
    deny("payload sender login is not allowlisted")
if str(sender.get("id", "")) != expected_actor_id:
    deny("payload sender ID mismatch")

print("GamePlug deployment executor policy accepted manual Aoleon dispatch from main.")
PY
