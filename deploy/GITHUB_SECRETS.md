# GitHub Secrets (Frontend)

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | VPS public IP |
| `DEPLOY_USER` | SSH user with Docker access |
| `DEPLOY_SSH_KEY` | Private SSH key |
| `GHCR_PULL_TOKEN` | PAT with `read:packages` for GHCR pulls on the VPS |

Deploy path: `/opt/phisio` (compose owned by phisio-api).

CI pushes `ghcr.io/<owner>/phisio-web:<git-sha>`, writes that into `.env`, then:

`docker compose --profile web up -d --no-deps web`

Deploy API first, then web.
