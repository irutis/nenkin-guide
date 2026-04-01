#!/bin/bash
# A8自動管理スクリプトをcronに登録する
# 実行: bash scripts/setup-cron.sh

PROJECT_DIR="/Users/morimototaichi/Desktop/AI_Company/development/projects/nenkin-guide"
LOG_FILE="$PROJECT_DIR/logs/a8-auto-manage.log"

# logsディレクトリを作成
mkdir -p "$PROJECT_DIR/logs"

# cronジョブの内容（毎日朝9時に実行）
CRON_JOB="0 9 * * * cd $PROJECT_DIR && node --env-file=.env.local scripts/a8-auto-manage.mjs >> $LOG_FILE 2>&1"

# 既存のcronに追加（重複チェック付き）
if crontab -l 2>/dev/null | grep -q "a8-auto-manage"; then
  echo "⚠️  既にcronに登録済みです"
  crontab -l | grep "a8-auto-manage"
else
  (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  echo "✅ cronに登録しました（毎日朝9時実行）"
  echo "$CRON_JOB"
fi

echo ""
echo "今すぐ実行する場合:"
echo "  node --env-file=.env.local scripts/a8-auto-manage.mjs"
