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

Images are built in CI and pulled from **GHCR**. Push API first, then this repo — Web Deploy updates only the `web` service (`--profile web`).

See [deploy/GITHUB_SECRETS.md](deploy/GITHUB_SECRETS.md).


