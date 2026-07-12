# Phisio Web (Frontend)

React 19 + Vite PWA for the Phisio physiotherapy platform.

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

Deploys nginx + static app to `/opt/phisio-web` on the VPS (port 80).

**Deploy after the backend repo** — requires Docker network `phisio_internal` from the API stack.

See [deploy/GITHUB_SECRETS.md](deploy/GITHUB_SECRETS.md) for CI/CD secrets.
