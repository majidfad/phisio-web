# GitHub Secrets (Frontend)

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | VPS public IP |
| `DEPLOY_USER` | SSH user with Docker access |
| `DEPLOY_SSH_KEY` | Private SSH key |
| `GHCR_PULL_TOKEN` | PAT with `read:packages` for server image pull |

Deploy path on server: `/opt/phisio` (shared with API)

Compose is owned by **phisio-api**. This workflow only updates the `web` service.

**Order:** push/deploy API first (it creates `/opt/phisio` and migrates data in CI), then push/deploy web.
