# GitHub Secrets (Frontend)

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | VPS public IP |
| `DEPLOY_USER` | SSH user with Docker access |
| `DEPLOY_SSH_KEY` | Private SSH key |
| `GHCR_PULL_TOKEN` | PAT with `read:packages` for server image pull |

Optional: `HTTP_PORT` (default `8080`)

Deploy path on server: `/opt/phisio-web`

Deploy **after** the backend repo — web joins external network `phisio_internal` and proxies `/api` to container `phisio-api`.
