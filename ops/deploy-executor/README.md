# GamePlug canonical deployment executor

## Trust boundary

- Repository scope: `robinswood-io/game-plug` only.
- Runner labels: `gameplug-canonical-deploy`, `repo-game-plug`, `trusted-main-only`.
- The pre-job hook is the Bash file `runner-pre-job.sh`. GitHub Runner requires a language extension such as `.sh`; a `.py` hook is not accepted even when executable.
- The root-owned pre-job hook runs before any workflow step and accepts only the `deploy` job from `.github/workflows/deploy-production.yml@refs/heads/main`, for a manual `workflow_dispatch` on `refs/heads/main`.
- The first-cutover actor allowlist is deliberately minimal: GitHub login `Aoleon`, immutable account ID `157592993`. `GITHUB_ACTOR`, `GITHUB_ACTOR_ID`, `GITHUB_TRIGGERING_ACTOR` and payload `sender.login`/`sender.id` must all agree.
- Pull-request payloads, push events, branch refs, alternate workflows, absent/different actors, repository IDs, runner identities and mismatched workflow/commit payloads fail with code `78` before checkout or any job command.
- GitHub documents `GITHUB_*` and `RUNNER_*` default variables as non-overwritable by workflow `env`; the hook uses those runner-provided variables and a root-owned allowlist, not values from repository steps.
- The runner service account has no sudo, Docker group, login shell, repository checkout or general server secret access.
- Its only deployment credential is a dedicated SSH key. The target authorizes it only from `146.59.230.253`, with a forced command and forwarding/TTY disabled.
- The target wrapper accepts only `preflight`, `canary` or `deploy` plus one 40-character commit SHA and two `sha256:` image digests.

## Root-owned hook installation contract

The reviewed repository file is installed outside the Actions Runner application directory. The live copy must be immutable to the runner account: owner `root:root`, mode exactly `0555`, and an absolute `.sh` path supplied by systemd.
The hook verifies those owner/group/mode and non-symlink invariants itself before reading any GitHub job metadata; a drifted installation returns `78`.

```bash
sudo install -d -o root -g root -m 0755 /usr/local/libexec
sudo install -o root -g root -m 0555 \
  ops/deploy-executor/runner-pre-job.sh \
  /usr/local/libexec/gameplug-runner-pre-job.sh
sudo test "$(stat -c '%u:%g:%a' /usr/local/libexec/gameplug-runner-pre-job.sh)" = '0:0:555'
sudo systemctl daemon-reload
sudo systemctl restart gameplug-runner.service
```

`gameplug-runner.service` versions the exact setting:

```ini
Environment=ACTIONS_RUNNER_HOOK_JOB_STARTED=/usr/local/libexec/gameplug-runner-pre-job.sh
```

Do not perform these installation/restart commands from pull-request validation. They are cutover preparation operations requiring independent review.

## Local cutover gate contract

`/etc/gameplug-deploy/enabled` is deliberately non-secret so the forced-command user can read it. It is valid only when all properties hold:

- regular file, never a symlink;
- owner and group exactly `root:root`;
- mode exactly `0644` (no group/other write or execute right);
- bytes exactly `enabled=true\n`, with one trailing newline and nothing else.

When independently authorized, create it atomically as root:

```bash
tmp=$(sudo mktemp /etc/gameplug-deploy/enabled.XXXXXX)
printf 'enabled=true\n' | sudo tee "$tmp" >/dev/null
sudo chown root:root "$tmp"
sudo chmod 0644 "$tmp"
sudo mv -f "$tmp" /etc/gameplug-deploy/enabled
sudo test "$(stat -c '%u:%g:%a' /etc/gameplug-deploy/enabled)" = '0:0:644'
printf 'enabled=true\n' | sudo cmp -s - /etc/gameplug-deploy/enabled
```

The repository contract tests valid content plus rejection of wrong mode, owner, group, symlink, extra bytes and missing newline. This pull request does **not** create or activate the live gate.

## Image, propagation and rollback contract

Application images are built and published only by GitHub-hosted runners. The executor receives the immutable digests emitted by those build jobs. The target verifies tag-to-digest binding, non-root `bun` runtime and OCI revision binding before deployment. Canary runs use the exact digests, isolated names/network and localhost ports `55230`/`55231`, then remove all temporary resources.

The backend environment stays outside the repository at `/srv/workspace/.secrets/gameplug-backend.env` in mode `0600`. The target never receives GHCR or backend secrets from a workflow. Existing target-side GHCR pull credentials are used without logging their content.

All local and public HTTP checks use `wait_http`: finite attempts, finite per-request connect/total timeouts and retry delay. Logs contain only fixed check labels and counters, never the URL or response body. Public checks run after production Compose and again after the source-runtime rollback script, allowing bounded Traefik propagation. A failed cutover can invoke the rollback script at most once; a duplicate attempt is refused.

## Activation and cutover plan

The architecture remains fail-closed until independent review.

1. Independent reviewer validates the pull-request head SHA, Actions permissions, host script SHA-256 values, runner scope/labels, immutable GitHub variable behavior and all actor/pre-job denial fixtures.
2. Merge through a reviewed pull request; do not use automatic merge.
3. Recheck `/srv/workspace/.secrets/gameplug-backend.env` mode `0600` and byte-for-byte fingerprints for `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET` and current optional AI key.
4. Revalidate `/srv/workspace/.recovery/gameplug-cutover-edc014e-20260824-2313/SHA256SUMS` and execute a non-mutating rollback preflight.
5. Install the reviewed root-owned `.sh` hook, then create the root-owned local gate with the exact contract above and set repository variable `GAMEPLUG_CANONICAL_DEPLOY_ENABLED=true`.
6. From the merged `main`, `Aoleon` manually dispatches `Deploy Production`. GitHub-hosted jobs first build/publish both immutable images; the self-hosted job receives only their digests after all hosted gates pass.
7. Verify each published image OCI revision equals the dispatched `main` SHA, then run the exact-digest canary and verify three HTTP checks, `bun` users, `restart=no`, cleanup and closed localhost ports.
8. Complete the first cutover and verify exact production image digests, container health, bounded public `/` and `/api/health` propagation, Traefik routing, browser console/network and user journey.
9. On a bounded deployment failure, restore and verify the source-runtime once. Never automatically replay an ambiguous deployment.
10. After verified cutover, keep the source-runtime recovery bundle and disable both gates if canonical deployment must be paused.

Current state for this corrective pull request: no gate, secret or repository variable is activated; no service is restarted; no production container is touched; no cutover is dispatched.
