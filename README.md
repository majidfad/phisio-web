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

Deploys nginx + static app to `/opt/phisio-web` on the VPS (port 8080).

**Deploy after the backend repo** — requires Docker network `phisio_internal` from the API stack.

See [deploy/GITHUB_SECRETS.md](deploy/GITHUB_SECRETS.md) for CI/CD secrets.
