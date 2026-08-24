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
    "github.event_name == 'workflow_dispatch'",
    "github.ref == 'refs/heads/main'",
    "github.actor == 'Aoleon'",
    "github.triggering_actor == 'Aoleon'",
    "needs.deployment-readiness.outputs.ready == 'true'",
    "needs.build-images.outputs.backend_digest",
    "needs.build-images.outputs.frontend_digest",
]
for needle in required:
    assert needle in WORKFLOW, f"missing trusted deploy constraint: {needle}"

assert "\n  push:\n" not in WORKFLOW
assert "github.event_name == 'push'" not in WORKFLOW
assert WORKFLOW.count("gameplug-canonical-deploy") == 1
assert "secrets.DEPLOY_KEY" not in WORKFLOW
assert "secrets.GHCR_TOKEN" not in WORKFLOW
assert "appleboy/ssh-action" not in WORKFLOW
assert "actions/checkout" not in WORKFLOW.split("  deploy:\n", 1)[1]
for protected_name in (
    "GITHUB_ACTOR",
    "GITHUB_ACTOR_ID",
    "GITHUB_TRIGGERING_ACTOR",
    "GITHUB_REPOSITORY_ID",
    "GITHUB_WORKFLOW_REF",
    "GITHUB_WORKFLOW_SHA",
):
    assert f"{protected_name}:" not in WORKFLOW
assert "runs-on: ubuntu-latest" in BUILDER
assert "org.opencontainers.image.revision=${{ github.sha }}" in BUILDER
assert "backend_digest:" in BUILDER and "frontend_digest:" in BUILDER

BASE_ENV = {
    "GITHUB_ACTIONS": "true",
    "GITHUB_REPOSITORY": "robinswood-io/game-plug",
    "GITHUB_REPOSITORY_ID": "1048351155",
    "GITHUB_REF": "refs/heads/main",
    "GITHUB_WORKFLOW_REF": "robinswood-io/game-plug/.github/workflows/deploy-production.yml@refs/heads/main",
    "GITHUB_WORKFLOW_SHA": "a" * 40,
    "GITHUB_JOB": "deploy",
    "GITHUB_EVENT_NAME": "workflow_dispatch",
    "GITHUB_ACTOR": "Aoleon",
    "GITHUB_ACTOR_ID": "157592993",
    "GITHUB_TRIGGERING_ACTOR": "Aoleon",
    "GITHUB_SHA": "a" * 40,
    "RUNNER_NAME": "gameplug-canonical-deploy-01",
    "RUNNER_ENVIRONMENT": "self-hosted",
    "GITHUB_HEAD_REF": "",
    "GITHUB_BASE_REF": "",
}


def run_case(payload: dict, changes: dict[str, str | None] | None = None) -> int:
    with tempfile.NamedTemporaryFile("w", encoding="utf-8") as handle:
        json.dump(payload, handle)
        handle.flush()
        env = os.environ.copy() | BASE_ENV | {"GITHUB_EVENT_PATH": handle.name}
        for name, value in (changes or {}).items():
            if value is None:
                env.pop(name, None)
            else:
                env[name] = value
        return subprocess.run([str(HOOK)], env=env, capture_output=True, text=True).returncode


payload = {
    "repository": {"full_name": "robinswood-io/game-plug", "id": 1048351155},
    "ref": "refs/heads/main",
    "sender": {"login": "Aoleon", "id": 157592993},
}
assert run_case(payload) == 0
assert run_case(payload, {"GITHUB_ACTOR": None}) == 78
assert run_case(payload, {"GITHUB_ACTOR": "mallory"}) == 78
assert run_case(payload, {"GITHUB_TRIGGERING_ACTOR": "mallory"}) == 78
assert run_case(payload, {"GITHUB_ACTOR_ID": "1"}) == 78
assert run_case(payload | {"sender": {"login": "mallory", "id": 157592993}}) == 78
assert run_case(payload | {"sender": {"login": "Aoleon", "id": 1}}) == 78
assert run_case(payload | {"pull_request": {}}) == 78
assert run_case(payload | {"ref": "refs/heads/feature"}, {"GITHUB_REF": "refs/heads/feature"}) == 78
assert run_case(payload, {"GITHUB_EVENT_NAME": "push"}) == 78
assert run_case(
    payload,
    {"GITHUB_WORKFLOW_REF": "robinswood-io/game-plug/.github/workflows/evil.yml@refs/heads/main"},
) == 78
assert run_case(payload, {"GITHUB_WORKFLOW_SHA": "b" * 40}) == 78
assert run_case(payload, {"GITHUB_HEAD_REF": "feature", "GITHUB_BASE_REF": "main"}) == 78
print("GamePlug executor contract: manual Aoleon/main accepted; actor, PR, branch, event, workflow and SHA spoof cases denied with rc=78.")
