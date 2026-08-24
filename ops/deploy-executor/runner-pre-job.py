#!/usr/bin/env python3
"""Fail-closed policy executed by GitHub Runner before any job step."""
from __future__ import annotations

import json
import os
import re
from pathlib import Path

EXPECTED_REPOSITORY = "robinswood-io/game-plug"
EXPECTED_REF = "refs/heads/main"
EXPECTED_WORKFLOW_REF = (
    "robinswood-io/game-plug/.github/workflows/deploy-production.yml@refs/heads/main"
)
EXPECTED_JOB = "deploy"
EXPECTED_RUNNER = "gameplug-canonical-deploy-01"
ALLOWED_EVENTS = {"push", "workflow_dispatch"}


def deny(reason: str) -> None:
    print(f"::error::GamePlug deployment executor denied job: {reason}")
    raise SystemExit(78)


def require_equal(name: str, expected: str) -> str:
    actual = os.environ.get(name, "")
    if actual != expected:
        deny(f"unexpected {name}")
    return actual


def main() -> None:
    require_equal("GITHUB_ACTIONS", "true")
    require_equal("GITHUB_REPOSITORY", EXPECTED_REPOSITORY)
    require_equal("GITHUB_REF", EXPECTED_REF)
    require_equal("GITHUB_WORKFLOW_REF", EXPECTED_WORKFLOW_REF)
    require_equal("GITHUB_JOB", EXPECTED_JOB)
    require_equal("RUNNER_NAME", EXPECTED_RUNNER)
    require_equal("RUNNER_ENVIRONMENT", "self-hosted")

    event_name = os.environ.get("GITHUB_EVENT_NAME", "")
    if event_name not in ALLOWED_EVENTS:
        deny("event is not trusted main push/manual")
    if os.environ.get("GITHUB_HEAD_REF") or os.environ.get("GITHUB_BASE_REF"):
        deny("pull-request branch context present")

    sha = os.environ.get("GITHUB_SHA", "")
    if re.fullmatch(r"[0-9a-f]{40}", sha) is None:
        deny("invalid commit SHA")

    event_path = Path(os.environ.get("GITHUB_EVENT_PATH", ""))
    if not event_path.is_file():
        deny("event payload unavailable")
    try:
        payload = json.loads(event_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        deny("event payload unreadable")

    if (payload.get("repository") or {}).get("full_name") != EXPECTED_REPOSITORY:
        deny("payload repository mismatch")
    if payload.get("ref") != EXPECTED_REF:
        deny("payload ref mismatch")
    if "pull_request" in payload:
        deny("pull-request payload present")
    if event_name == "push":
        if payload.get("deleted") is True or payload.get("after") != sha:
            deny("push payload does not bind the assigned SHA")

    print("GamePlug deployment executor policy accepted trusted main job.")


if __name__ == "__main__":
    main()
