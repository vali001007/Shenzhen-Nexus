#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DIST_DIR="${DIST_DIR:-$ROOT_DIR/traveler-web/dist}"
STORAGE_BUCKET="${STORAGE_BUCKET:-}"
CDN_BASE_URL="${CDN_BASE_URL:-}"
RELEASE_TAG="${RELEASE_TAG:-$(date +%Y%m%d-%H%M%S)}"
RELEASE_PATH="releases/$RELEASE_TAG"
LATEST_PATH="releases/latest"
MANIFEST_PATH="$ROOT_DIR/infra/deployment/frontend-release.json"

if [[ ! -d "$DIST_DIR" ]]; then
  echo "[deploy_frontend] dist 目录不存在: $DIST_DIR"
  exit 1
fi

if [[ -z "$STORAGE_BUCKET" ]]; then
  echo "[deploy_frontend] 需要配置 STORAGE_BUCKET"
  exit 1
fi

run_cmd() {
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] $*"
  else
    eval "$*"
  fi
}

echo "[deploy_frontend] release=$RELEASE_TAG bucket=$STORAGE_BUCKET"

run_cmd "gsutil -m rsync -r \"$DIST_DIR\" \"$STORAGE_BUCKET/$RELEASE_PATH\""
run_cmd "gsutil -m rsync -r \"$DIST_DIR\" \"$STORAGE_BUCKET/$LATEST_PATH\""

if [[ "$DRY_RUN" == "true" ]]; then
  echo "[dry-run] 写入发布清单: $MANIFEST_PATH"
else
  cat > "$MANIFEST_PATH" <<EOF
{
  "release": "$RELEASE_TAG",
  "bucket": "$STORAGE_BUCKET",
  "latest": "$STORAGE_BUCKET/$LATEST_PATH",
  "cdn": "$CDN_BASE_URL",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
  echo "[deploy_frontend] 已写入发布清单: $MANIFEST_PATH"
fi
