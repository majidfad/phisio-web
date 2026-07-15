#!/usr/bin/env bash
set -euo pipefail

cat <<EOF
No server bootstrap needed for the frontend.

API Deploy CI (phisio-api) creates /opt/phisio, migrates volumes, and starts
postgres + api. Then push this repo — Web Deploy CI updates only the web service.

EOF
