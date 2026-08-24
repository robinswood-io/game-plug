#!/usr/bin/env python3
"""Static and fixture-based proof for the GamePlug runner trust boundary."""
from __future__ import annotations

import json
import os
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = (ROOT / ".github/workflows/deploy-production.yml").read_text()
BUILDER = (ROOT / ".github/workflows/deploy.yml").read_text()
HOOK = ROOT / "ops/deploy-executor/runner-pre-job.py"

required = [
    "runs-on: [gameplug-canonical-deploy, repo-game-plug, trusted-main-only]",
    "github.event_name == 'push' || github.event_name == 'workflow_dispatch'",
    "github.ref == 'refs/heads/main'",
    "needs.deployment-readiness.outputs.ready == 'true'",
    "needs.build-images.outputs.backend_digest",
    "needs.build-images.outputs.frontend_digest",
]
for needle in required:
    assert needle in WORKFLOW, f"missing trusted deploy constraint: {needle}"

assert WORKFLOW.count("gameplug-canonical-deploy") == 1
assert "secrets.DEPLOY_KEY" not in WORKFLOW
assert "secrets.GHCR_TOKEN" not in WORKFLOW
assert "appleboy/ssh-action" not in WORKFLOW
assert "actions/checkout" not in WORKFLOW.split("  deploy:\n", 1)[1]
assert "runs-on: ubuntu-latest" in BUILDER
assert "org.opencontainers.image.revision=${{ github.sha }}" in BUILDER
assert "backend_digest:" in BUILDER and "frontend_digest:" in BUILDER

BASE_ENV = {
    "GITHUB_ACTIONS": "true",
    "GITHUB_REPOSITORY": "robinswood-io/game-plug",
    "GITHUB_REF": "refs/heads/main",
    "GITHUB_WORKFLOW_REF": "robinswood-io/game-plug/.github/workflows/deploy-production.yml@refs/heads/main",
    "GITHUB_JOB": "deploy",
    "GITHUB_SHA": "a" * 40,
    "RUNNER_NAME": "gameplug-canonical-deploy-01",
    "RUNNER_ENVIRONMENT": "self-hosted",
    "GITHUB_HEAD_REF": "",
    "GITHUB_BASE_REF": "",
}


def run_case(event_name: str, payload: dict, changes: dict[str, str] | None = None) -> int:
    with tempfile.NamedTemporaryFile("w", encoding="utf-8") as handle:
        json.dump(payload, handle)
        handle.flush()
        env = os.environ.copy() | BASE_ENV | {
            "GITHUB_EVENT_NAME": event_name,
            "GITHUB_EVENT_PATH": handle.name,
        }
        env.update(changes or {})
        return subprocess.run([str(HOOK)], env=env, capture_output=True, text=True).returncode


repo = {"full_name": "robinswood-io/game-plug"}
assert run_case("push", {"repository": repo, "ref": "refs/heads/main", "after": "a" * 40}) == 0
assert run_case("pull_request", {"repository": repo, "ref": "refs/pull/7/merge", "pull_request": {}}) != 0
assert run_case("workflow_dispatch", {"repository": repo, "ref": "refs/heads/feature"}) != 0
assert run_case(
    "push",
    {"repository": repo, "ref": "refs/heads/main", "after": "a" * 40},
    {"GITHUB_WORKFLOW_REF": "robinswood-io/game-plug/.github/workflows/evil.yml@refs/heads/main"},
) != 0
assert run_case(
    "push",
    {"repository": repo, "ref": "refs/heads/main", "after": "a" * 40},
    {"GITHUB_HEAD_REF": "feature", "GITHUB_BASE_REF": "main"},
) != 0
print("GamePlug executor contract: trusted main accepted; PR/branch/workflow spoof cases denied.")
