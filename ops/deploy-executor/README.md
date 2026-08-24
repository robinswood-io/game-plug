# GamePlug canonical deployment executor

## Trust boundary

- Repository scope: `robinswood-io/game-plug` only.
- Runner labels: `gameplug-canonical-deploy`, `repo-game-plug`, `trusted-main-only`.
- The root-owned pre-job hook runs before any workflow step and accepts only the `deploy` job from `.github/workflows/deploy-production.yml@refs/heads/main`, on `push` or `workflow_dispatch` for `refs/heads/main`.
- Pull-request payloads, branch refs, alternate workflows and mismatched commit payloads fail before checkout or any job command.
- The runner service account has no sudo, Docker group, login shell, repository checkout or general server secret access.
- Its only deployment credential is a dedicated SSH key. The target authorizes it only from `146.59.230.253`, with a forced command and forwarding/TTY disabled.
- The target wrapper accepts only `preflight`, `canary` or `deploy` plus one 40-character commit SHA and two `sha256:` image digests.

## Image and runtime contract

Application images are built and published only by GitHub-hosted runners. The executor receives the immutable digests emitted by those build jobs. The target verifies tag-to-digest binding, non-root `bun` runtime and OCI revision binding before deployment. Canary runs use the exact digests, isolated names/network and localhost ports `55230`/`55231`, then remove all temporary resources.

The backend environment stays outside the repository at `/srv/workspace/.secrets/gameplug-backend.env` in mode `0600`. The target never receives GHCR or backend secrets from a workflow. Existing target-side GHCR pull credentials are used without logging their content.

## Activation and cutover plan

The architecture is intentionally fail-closed until independent review of this pull request.

1. Independent reviewer validates the PR head SHA, Actions permissions, host script SHA-256 values, runner scope/labels and pre-job denial fixtures.
2. Merge through a reviewed PR; do not use automatic merge.
3. Confirm the post-merge GitHub-hosted build published backend/frontend images whose OCI revision equals the merged `main` SHA.
4. Run the exact-digest canary through the forced command and verify three HTTP checks, `bun` users, `restart=no`, cleanup and closed localhost ports.
5. Recheck `/srv/workspace/.secrets/gameplug-backend.env` mode `0600` and byte-for-byte fingerprints for `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET` and current optional AI key.
6. Revalidate `/srv/workspace/.recovery/gameplug-cutover-edc014e-20260824-2313/SHA256SUMS` and execute a non-mutating rollback preflight.
7. Create the root-owned local gate `/etc/gameplug-deploy/enabled` with exact content `enabled=true`, then set repository variable `GAMEPLUG_CANONICAL_DEPLOY_ENABLED=true`.
8. Dispatch `Deploy Production` manually from `main` for the first cutover. Verify exact production image digests, container health, public `/`, public `/api/health`, Traefik routing, browser console/network and user journey.
9. On any bounded deployment failure, the wrapper restores the verified source-runtime bridge via `rollback-source-runtime.sh`.
10. After verified cutover, keep the source-runtime recovery bundle and disable both gates if canonical deployment must be paused.

Current state: runner and target command may be installed for review/canary, but both cutover gates remain disabled and no production container is replaced.
