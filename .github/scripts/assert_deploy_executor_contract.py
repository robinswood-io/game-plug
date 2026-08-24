#!/usr/bin/env python3
"""Static and fixture-based proof for the GamePlug runner trust boundary."""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = (ROOT / ".github/workflows/deploy-production.yml").read_text()
BUILDER = (ROOT / ".github/workflows/deploy.yml").read_text()
SERVICE = (ROOT / "ops/deploy-executor/gameplug-runner.service").read_text()
README = (ROOT / "ops/deploy-executor/README.md").read_text()
WRAPPER = ROOT / "ops/deploy-executor/gameplug-canonical-deploy"
WRAPPER_TEXT = WRAPPER.read_text()
HOOK = ROOT / "ops/deploy-executor/runner-pre-job.sh"

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

assert HOOK.suffix == ".sh"
assert HOOK.exists() and os.access(HOOK, os.X_OK)
assert not (ROOT / "ops/deploy-executor/runner-pre-job.py").exists()
hook_text = HOOK.read_text()
assert 'verify_hook_installation' in hook_text
assert '/usr/bin/stat -c %a' in hook_text
assert '[[ "$uid" == 0 && "$gid" == 0 ]]' in hook_text
assert '[[ "$mode" == 555 ]]' in hook_text
assert (
    "Environment=ACTIONS_RUNNER_HOOK_JOB_STARTED=/usr/local/libexec/gameplug-runner-pre-job.sh"
    in SERVICE
)
assert "install -o root -g root -m 0555" in README
assert "mode exactly `0644`" in README
assert "bytes exactly `enabled=true\\n`" in README

for needle in (
    "verify_enable_gate \"$ENABLE_FILE\"",
    "stat -c %a",
    "stat -c %u",
    "stat -c %g",
    "cmp -s -- \"$gate\" <(printf 'enabled=true\\n')",
    "--connect-timeout 5 --max-time 10",
    "public homepage after deploy",
    "public health after deploy",
    "public homepage after rollback",
    "public health after rollback",
    "rollback_once \"$ROLLBACK_SCRIPT\"",
):
    assert needle in WRAPPER_TEXT, f"missing deploy safety contract: {needle}"
assert 'if ! sockets=$(ss -ltn)' in WRAPPER_TEXT
assert "! ss -ltn" not in WRAPPER_TEXT
assert "trap rollback ERR" not in WRAPPER_TEXT
assert WRAPPER_TEXT.count('rollback_once "$ROLLBACK_SCRIPT"') == 1
assert WRAPPER_TEXT.index('docker compose -f "$REPO_DIR/compose.production.yml" up -d') < WRAPPER_TEXT.index(
    'wait_http "public homepage after deploy"'
)
assert WRAPPER_TEXT.index('if ! "$rollback_script"') < WRAPPER_TEXT.index(
    'wait_http "public homepage after rollback"'
)

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


HOOK_FIXTURE_DIR = tempfile.TemporaryDirectory(prefix="gameplug-hook-contract-")
HOOK_RUNTIME = Path(HOOK_FIXTURE_DIR.name) / "runner-pre-job.sh"
subprocess.run(
    ["sudo", "-n", "install", "-o", "root", "-g", "root", "-m", "0555", str(HOOK), str(HOOK_RUNTIME)],
    check=True,
    capture_output=True,
    text=True,
)
hook_stat = HOOK_RUNTIME.stat()
assert hook_stat.st_uid == 0 and hook_stat.st_gid == 0 and (hook_stat.st_mode & 0o777) == 0o555


def run_case(
    payload: object,
    changes: dict[str, str | None] | None = None,
    hook: Path | None = None,
) -> subprocess.CompletedProcess[str]:
    with tempfile.NamedTemporaryFile("w", encoding="utf-8") as handle:
        if isinstance(payload, str):
            handle.write(payload)
        else:
            json.dump(payload, handle)
        handle.flush()
        env = os.environ.copy() | BASE_ENV | {"GITHUB_EVENT_PATH": handle.name}
        for name, value in (changes or {}).items():
            if value is None:
                env.pop(name, None)
            else:
                env[name] = value
        return subprocess.run([str(hook or HOOK_RUNTIME)], env=env, capture_output=True, text=True, timeout=5)


payload = {
    "repository": {"full_name": "robinswood-io/game-plug", "id": 1048351155},
    "ref": "refs/heads/main",
    "sender": {"login": "Aoleon", "id": 157592993},
}
assert run_case(payload).returncode == 0

bad_mode_hook = Path(HOOK_FIXTURE_DIR.name) / "runner-pre-job-bad-mode.sh"
subprocess.run(
    ["sudo", "-n", "install", "-o", "root", "-g", "root", "-m", "0755", str(HOOK), str(bad_mode_hook)],
    check=True,
    capture_output=True,
    text=True,
)
assert run_case(payload, hook=bad_mode_hook).returncode == 78

user_owned_hook = Path(HOOK_FIXTURE_DIR.name) / "runner-pre-job-user-owned.sh"
shutil.copy2(HOOK, user_owned_hook)
user_owned_hook.chmod(0o555)
assert run_case(payload, hook=user_owned_hook).returncode == 78

symlink_hook = Path(HOOK_FIXTURE_DIR.name) / "runner-pre-job-symlink.sh"
symlink_hook.symlink_to(HOOK_RUNTIME)
assert run_case(payload, hook=symlink_hook).returncode == 78

negative_env = {
    "GITHUB_ACTIONS": "false",
    "GITHUB_REPOSITORY": "robinswood-io/other",
    "GITHUB_REPOSITORY_ID": "1",
    "GITHUB_REF": "refs/heads/feature",
    "GITHUB_WORKFLOW_REF": "robinswood-io/game-plug/.github/workflows/evil.yml@refs/heads/main",
    "GITHUB_WORKFLOW_SHA": "b" * 40,
    "GITHUB_JOB": "build",
    "GITHUB_EVENT_NAME": "push",
    "GITHUB_ACTOR": "mallory",
    "GITHUB_ACTOR_ID": "1",
    "GITHUB_TRIGGERING_ACTOR": "mallory",
    "GITHUB_SHA": "not-a-sha",
    "RUNNER_NAME": "general-runner",
    "RUNNER_ENVIRONMENT": "github-hosted",
    "GITHUB_HEAD_REF": "feature",
    "GITHUB_BASE_REF": "main",
}
for name, value in negative_env.items():
    result = run_case(payload, {name: value})
    assert result.returncode == 78, (name, result.stdout, result.stderr)
for name in ("GITHUB_ACTOR", "GITHUB_ACTOR_ID", "GITHUB_REPOSITORY", "GITHUB_EVENT_PATH"):
    result = run_case(payload, {name: None})
    assert result.returncode == 78, (name, result.stdout, result.stderr)

payload_denials = [
    payload | {"repository": {"full_name": "robinswood-io/other", "id": 1048351155}},
    payload | {"repository": {"full_name": "robinswood-io/game-plug", "id": 1}},
    payload | {"ref": "refs/heads/feature"},
    payload | {"pull_request": {}},
    payload | {"sender": {"login": "mallory", "id": 157592993}},
    payload | {"sender": {"login": "Aoleon", "id": 1}},
    {},
    "{not-json",
]
for denied_payload in payload_denials:
    result = run_case(denied_payload)
    assert result.returncode == 78, (denied_payload, result.stdout, result.stderr)


def run_bash(script: str, *, env: dict[str, str] | None = None, args: list[str] | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["bash", "-c", script, "contract", *(args or [])],
        cwd=ROOT,
        env=os.environ.copy() | (env or {}),
        capture_output=True,
        text=True,
        timeout=5,
    )


with tempfile.TemporaryDirectory() as directory:
    tmp = Path(directory)
    exact = tmp / "enabled"
    exact.write_bytes(b"enabled=true\n")
    missing_newline = tmp / "missing-newline"
    missing_newline.write_bytes(b"enabled=true")
    extra = tmp / "extra"
    extra.write_bytes(b"enabled=true\nextra\n")
    symlink = tmp / "symlink"
    symlink.symlink_to(exact)

    gate_script = 'source "$1"; verify_enable_gate_metadata "$2" "$3" "$4" "$5"'
    assert run_bash(gate_script, args=[str(WRAPPER), str(exact), "644", "0", "0"]).returncode == 0
    for gate, mode, uid, gid in (
        (exact, "600", "0", "0"),
        (exact, "664", "0", "0"),
        (exact, "644", "1000", "0"),
        (exact, "644", "0", "1000"),
        (missing_newline, "644", "0", "0"),
        (extra, "644", "0", "0"),
        (symlink, "644", "0", "0"),
    ):
        result = run_bash(gate_script, args=[str(WRAPPER), str(gate), mode, uid, gid])
        assert result.returncode != 0, (gate, mode, uid, gid, result.stdout, result.stderr)

with tempfile.TemporaryDirectory() as directory:
    tmp = Path(directory)
    bindir = tmp / "bin"
    bindir.mkdir()
    ss = bindir / "ss"
    ss.write_text(
        "#!/usr/bin/env bash\n"
        "case \"$FAKE_SS_MODE\" in\n"
        "  clear) printf 'State Recv-Q Send-Q Local Address:Port Peer Address:Port\\n'; exit 0 ;;\n"
        "  open) printf 'LISTEN 0 128 127.0.0.1:55230 0.0.0.0:*\\n'; exit 0 ;;\n"
        "  fail) exit 1 ;;\n"
        "  *) exit 99 ;;\n"
        "esac\n"
    )
    ss.chmod(0o755)
    ss_env = {"PATH": f"{bindir}:{os.environ['PATH']}"}
    clear = run_bash('source "$1"; verify_canary_ports_closed', env=ss_env | {"FAKE_SS_MODE": "clear"}, args=[str(WRAPPER)])
    assert clear.returncode == 0, (clear.stdout, clear.stderr)
    opened = run_bash('source "$1"; verify_canary_ports_closed', env=ss_env | {"FAKE_SS_MODE": "open"}, args=[str(WRAPPER)])
    assert opened.returncode != 0 and "listener remains open" in opened.stderr
    failed = run_bash('source "$1"; verify_canary_ports_closed', env=ss_env | {"FAKE_SS_MODE": "fail"}, args=[str(WRAPPER)])
    assert failed.returncode != 0 and "unable to inspect" in failed.stderr

with tempfile.TemporaryDirectory() as directory:
    tmp = Path(directory)
    bindir = tmp / "bin"
    bindir.mkdir()
    count = tmp / "curl-count"
    args_log = tmp / "curl-args"
    curl = bindir / "curl"
    curl.write_text(
        "#!/usr/bin/env bash\n"
        "n=0; [[ ! -f \"$FAKE_CURL_COUNT\" ]] || n=$(cat \"$FAKE_CURL_COUNT\")\n"
        "n=$((n + 1)); printf '%s' \"$n\" > \"$FAKE_CURL_COUNT\"\n"
        "printf '%s\\n' \"$*\" >> \"$FAKE_CURL_ARGS\"\n"
        "case \"$FAKE_CURL_MODE\" in\n"
        "  success) exit 0 ;;\n"
        "  delayed) (( n >= FAKE_CURL_SUCCESS_AT )) && exit 0 || exit 22 ;;\n"
        "  timeout) exit 28 ;;\n"
        "  *) exit 99 ;;\n"
        "esac\n"
    )
    curl.chmod(0o755)
    sleep = bindir / "sleep"
    sleep.write_text("#!/usr/bin/env bash\nexit 0\n")
    sleep.chmod(0o755)
    test_env = {
        "PATH": f"{bindir}:{os.environ['PATH']}",
        "FAKE_CURL_COUNT": str(count),
        "FAKE_CURL_ARGS": str(args_log),
    }

    delayed_env = test_env | {"FAKE_CURL_MODE": "delayed", "FAKE_CURL_SUCCESS_AT": "3"}
    delayed = run_bash(
        'source "$1"; wait_http "delayed public route" "https://secret.invalid/path?token=never-log" 5 0',
        env=delayed_env,
        args=[str(WRAPPER)],
    )
    assert delayed.returncode == 0, (delayed.stdout, delayed.stderr)
    assert count.read_text() == "3"
    assert "secret.invalid" not in delayed.stdout + delayed.stderr
    assert "ready after attempt 3/5" in delayed.stdout
    assert "--connect-timeout 5" in args_log.read_text()
    assert "--max-time 10" in args_log.read_text()

    count.unlink()
    args_log.unlink()
    timeout_env = test_env | {"FAKE_CURL_MODE": "timeout", "FAKE_CURL_SUCCESS_AT": "99"}
    timed_out = run_bash(
        'source "$1"; if wait_http "bounded public route" "https://secret.invalid/timeout" 3 0; then exit 9; fi; [[ $(cat "$FAKE_CURL_COUNT") == 3 ]]',
        env=timeout_env,
        args=[str(WRAPPER)],
    )
    assert timed_out.returncode == 0, (timed_out.stdout, timed_out.stderr)
    assert "timed out after 3 attempts" in timed_out.stderr
    assert "secret.invalid" not in timed_out.stdout + timed_out.stderr

    count.unlink()
    args_log.unlink()
    rollback_count = tmp / "rollback-count"
    rollback = tmp / "rollback.sh"
    rollback.write_text(
        "#!/usr/bin/env bash\n"
        "n=0; [[ ! -f \"$ROLLBACK_COUNT\" ]] || n=$(cat \"$ROLLBACK_COUNT\")\n"
        "printf '%s' \"$((n + 1))\" > \"$ROLLBACK_COUNT\"\n"
    )
    rollback.chmod(0o755)
    rollback_env = test_env | {
        "FAKE_CURL_MODE": "success",
        "FAKE_CURL_SUCCESS_AT": "1",
        "ROLLBACK_COUNT": str(rollback_count),
    }
    rollback_result = run_bash(
        'source "$1"; ROLLBACK_ATTEMPTED=false; rollback_once "$2" "https://secret.invalid/home" "https://secret.invalid/health"; if rollback_once "$2" "https://secret.invalid/home" "https://secret.invalid/health"; then exit 9; fi; [[ $(cat "$ROLLBACK_COUNT") == 1 ]]',
        env=rollback_env,
        args=[str(WRAPPER), str(rollback)],
    )
    assert rollback_result.returncode == 0, (rollback_result.stdout, rollback_result.stderr)
    assert rollback_count.read_text() == "1"
    assert "secret.invalid" not in rollback_result.stdout + rollback_result.stderr
    assert "rollback already attempted" in rollback_result.stderr

print(
    "GamePlug executor contract: .sh hook accepts only the manual Aoleon/main deployment; "
    "actor/repository/ref/workflow/job/runner/SHA and payload spoof cases return 78; "
    "root-owned 0555 hook installation, root:root 0644 exact gate semantics, fail-closed canary listener checks, "
    "delayed HTTP success, bounded timeout, secret-free logs and single verified rollback all pass."
)
