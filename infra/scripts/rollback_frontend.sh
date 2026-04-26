#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STORAGE_BUCKET="${STORAGE_BUCKET:-}"
ROLLBACK_TO="${ROLLBACK_TO:-}"
LATEST_PATH="releases/latest"
MANIFEST_PATH="$ROOT_DIR/infra/deployment/frontend-release.json"

if [[ -z "$STORAGE_BUCKET" ]]; then
  echo "[rollback_frontend] 需要配置 STORAGE_BUCKET"
  exit 1
fi

if [[ -z "$ROLLBACK_TO" ]]; then
  echo "[rollback_frontend] 需要配置 ROLLBACK_TO，例如 20260426-120000"
  exit 1
fi

run_cmd() {
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] $*"
  else
    eval "$*"
  fi
}

echo "[rollback_frontend] rollback_to=$ROLLBACK_TO bucket=$STORAGE_BUCKET"

run_cmd "gsutil -m rsync -r \"$STORAGE_BUCKET/releases/$ROLLBACK_TO\" \"$STORAGE_BUCKET/$LATEST_PATH\""

if [[ "$DRY_RUN" == "true" ]]; then
  echo "[dry-run] 写入回滚清单: $MANIFEST_PATH"
else
  cat > "$MANIFEST_PATH" <<EOF
{
  "release": "$ROLLBACK_TO",
  "bucket": "$STORAGE_BUCKET",
  "latest": "$STORAGE_BUCKET/$LATEST_PATH",
  "rollback": true,
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
  echo "[rollback_frontend] 已写入回滚清单: $MANIFEST_PATH"
fi
