# GitHub Actions CI/CD Configuration

Welcome to the Game-Plug GitHub Actions CI/CD setup!

## Quick Start

1. **Read the documentation:**
   - `WORKFLOWS.md` - Complete workflow guide
   - `SETUP.md` - Configuration and secrets setup
   - `INDEX.md` - Overview and architecture

2. **Configure secrets in GitHub:**
   - Go to Settings > Secrets and variables > Actions
   - Add: DEPLOY_HOST, DEPLOY_USER, DEPLOY_KEY
   - See SETUP.md for detailed instructions

3. **Test the setup:**
   - Create a feature branch
   - Push and create a PR
   - Watch the workflows run in Actions tab

## Workflows Summary

| Workflow | Trigger | Purpose | Time |
|----------|---------|---------|------|
| backend-ci | Push/PR | Test & build backend | 15-20m |
| frontend-ci | Push/PR | Test & build frontend | 10-15m |
| code-quality | Push/PR/Daily | Code quality checks | 5-10m |
| docker-build-test | Docker changes | Docker validation | 25-35m |
| deploy | Push main | Production deploy | 30-45m |
| release | Tag v*.*.* | Release management | 45-60m |
| dependencies | Weekly | Dependency audit | 10-15m |

## Key Features

✓ **Automated Testing** - TypeScript, ESLint, Unit, E2E tests
✓ **Security Scanning** - npm audit, Trivy, CodeQL
✓ **Docker Validation** - Full stack testing
✓ **Production Deployment** - SSH-based with rollback
✓ **Release Management** - Semantic versioning
✓ **Slack Notifications** - Deployment alerts
✓ **Coverage Reports** - Codecov integration

## Next Steps

1. Configure secrets: See `SETUP.md`
2. Test locally: `npm test` in apps/backend and apps/frontend
3. Create your first PR to trigger workflows
4. Monitor Actions tab for results

## Support

Refer to the documentation files:
- `.github/WORKFLOWS.md` - Full workflow documentation
- `.github/SETUP.md` - Configuration guide
- `.github/INDEX.md` - Architecture overview

## Status

All workflows are configured and ready to use.
Last updated: 2026-01-23
