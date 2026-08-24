# GamePlug canonical deployment executor

## Trust boundary

- Repository scope: `robinswood-io/game-plug` only.
- Runner labels: `gameplug-canonical-deploy`, `repo-game-plug`, `trusted-main-only`.
- The root-owned pre-job hook runs before any workflow step and accepts only the `deploy` job from `.github/workflows/deploy-production.yml@refs/heads/main`, for a manual `workflow_dispatch` on `refs/heads/main`.
- The first-cutover actor allowlist is deliberately minimal: GitHub login `Aoleon`, immutable account ID `157592993`. `GITHUB_ACTOR`, `GITHUB_ACTOR_ID`, `GITHUB_TRIGGERING_ACTOR` and payload `sender.login`/`sender.id` must all agree.
- Pull-request payloads, push events, branch refs, alternate workflows, absent/different actors and mismatched workflow/commit payloads fail with code `78` before checkout or any job command.
- GitHub documents `GITHUB_*` and `RUNNER_*` default variables as non-overwritable by workflow `env`; the hook uses those runner-provided variables and a root-owned allowlist, not values from repository steps.
- The runner service account has no sudo, Docker group, login shell, repository checkout or general server secret access.
- Its only deployment credential is a dedicated SSH key. The target authorizes it only from `146.59.230.253`, with a forced command and forwarding/TTY disabled.
- The target wrapper accepts only `preflight`, `canary` or `deploy` plus one 40-character commit SHA and two `sha256:` image digests.

## Image and runtime contract

Application images are built and published only by GitHub-hosted runners. The executor receives the immutable digests emitted by those build jobs. The target verifies tag-to-digest binding, non-root `bun` runtime and OCI revision binding before deployment. Canary runs use the exact digests, isolated names/network and localhost ports `55230`/`55231`, then remove all temporary resources.

The backend environment stays outside the repository at `/srv/workspace/.secrets/gameplug-backend.env` in mode `0600`. The target never receives GHCR or backend secrets from a workflow. Existing target-side GHCR pull credentials are used without logging their content.

## Activation and cutover plan

The architecture is intentionally fail-closed until independent review of this pull request.

Repository observation at review time: `main` has no branch protection and no GitHub environment protection is configured. Those settings are not used as a trust boundary here, no repository access was broadened, and no plan limitation is bypassed. The root-owned hook, manual actor binding, forced SSH command and two disabled cutover gates remain authoritative.

1. Independent reviewer validates the PR head SHA, Actions permissions, host script SHA-256 values, runner scope/labels, immutable GitHub variable behavior and all actor/pre-job denial fixtures.
2. Merge through a reviewed PR; do not use automatic merge.
3. Recheck `/srv/workspace/.secrets/gameplug-backend.env` mode `0600` and byte-for-byte fingerprints for `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET` and current optional AI key.
4. Revalidate `/srv/workspace/.recovery/gameplug-cutover-edc014e-20260824-2313/SHA256SUMS` and execute a non-mutating rollback preflight.
5. Create the root-owned local gate `/etc/gameplug-deploy/enabled` with exact content `enabled=true`, then set repository variable `GAMEPLUG_CANONICAL_DEPLOY_ENABLED=true`.
6. From the merged `main`, `Aoleon` manually dispatches `Deploy Production`. GitHub-hosted jobs first build/publish both immutable images; the self-hosted job receives only their digests after all hosted gates pass.
7. Verify each published image OCI revision equals the dispatched `main` SHA, then run the exact-digest canary and verify three HTTP checks, `bun` users, `restart=no`, cleanup and closed localhost ports.
8. Complete the first cutover and verify exact production image digests, container health, public `/`, public `/api/health`, Traefik routing, browser console/network and user journey.
9. On any bounded deployment failure, the wrapper restores the verified source-runtime bridge via `rollback-source-runtime.sh`.
10. After verified cutover, keep the source-runtime recovery bundle and disable both gates if canonical deployment must be paused.

Current state: runner and target command are installed for review/canary, but both cutover gates remain disabled and no production container is replaced.
