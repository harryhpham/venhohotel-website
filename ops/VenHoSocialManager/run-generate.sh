#!/bin/bash
# run-generate.sh — Ven Ho Hotel Social Media Bot
# Chay boi cron job: Thu 2 / 4 / 6 luc 10:00 sang
#
# Cron entry (them vao crontab -e):
# 0 10 * * 1,3,5 cd "/Users/hanhpham/Developer/Claude-Workspace/projects/Ven Ho Hotel/ops/VenHoSocialManager" && bash run-generate.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"
LOG_FILE="$LOG_DIR/scheduler-$(date '+%Y-%m').log"

mkdir -p "$LOG_DIR"

log() {
    local line="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$line"
    echo "$line" >> "$LOG_FILE"
}

log "=== VenHoSocialManager: Cron job bat dau ==="
cd "$SCRIPT_DIR"

if python3 generate_content.py >> "$LOG_FILE" 2>&1; then
    log "=== Hoan thanh OK ==="
else
    log "=== LOI: exit code $? — Kiem tra log de biet chi tiet ==="
fi
