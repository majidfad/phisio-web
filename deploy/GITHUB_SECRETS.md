# GitHub Secrets (Frontend)

| Secret | Description |
|--------|-------------|
| `DEPLOY_HOST` | VPS public IP (current: `85.198.15.132`) |
| `DEPLOY_USER` | SSH user with Docker access |
| `DEPLOY_SSH_KEY` | Private SSH key |
| `GHCR_PULL_TOKEN` | PAT with `read:packages` for mirrored GHCR pulls on the VPS |

Deploy path: `/opt/phisio` (compose owned by phisio-api).

CI pushes `ghcr.io/<owner>/phisio-web:<git-sha>`, writes the mirrored pull ref `focker.ir/ghcr.io/<owner>/phisio-web:<git-sha>` into `.env`, then:

`docker compose --profile web up -d --no-deps web`

Deploy API first, then web.
