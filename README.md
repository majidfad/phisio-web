# Phisio Web (Frontend)

Standalone frontend repository for the Phisio physiotherapy platform.

**Location:** `c:\Users\Mahboubeh\source\repos\phisio-web`  
**Backend repo:** [phisio-api](https://github.com/majidfad/phisio-api)

## Local development

```bash
npm ci
npm run dev
```

## Docker

```bash
docker build -t phisio-web:local .
```

## Production deploy

Runs in the unified stack at `/opt/phisio` (compose owned by phisio-api).

Push API to `main` first (CI bootstraps + migrates + starts postgres/api), then push web — CI updates only the `web` service.

See [deploy/GITHUB_SECRETS.md](deploy/GITHUB_SECRETS.md) for CI/CD secrets.

