#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/phisio-web"
REPO_URL="${REPO_URL:-}"

echo "==> Creating application directory at ${APP_DIR}"
sudo mkdir -p "${APP_DIR}"
sudo chown "${USER}:${USER}" "${APP_DIR}"

if [[ -n "${REPO_URL}" ]]; then
  if [[ ! -d "${APP_DIR}/repo" ]]; then
    git clone "${REPO_URL}" "${APP_DIR}/repo"
  fi
  cp "${APP_DIR}/repo/deploy/docker-compose.prod.yml" "${APP_DIR}/"
  cp "${APP_DIR}/repo/deploy/.env.example" "${APP_DIR}/.env.example"
fi

if [[ ! -f "${APP_DIR}/.env" ]]; then
  cp "${APP_DIR}/.env.example" "${APP_DIR}/.env"
fi

if ! groups "${USER}" | grep -q '\bdocker\b'; then
  sudo usermod -aG docker "${USER}"
fi

if command -v ufw >/dev/null 2>&1; then
  sudo ufw allow 80/tcp || true
fi

cat <<EOF

Frontend bootstrap complete.

Requires backend stack running first (shared network phisio_internal).

Next:
1. Configure GitHub secrets (see deploy/GITHUB_SECRETS.md).
2. Deploy frontend after backend is healthy.

EOF
