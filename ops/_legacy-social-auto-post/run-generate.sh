#!/bin/bash
# run-generate.sh — Ven Ho Hotel Social Media Bot
# Chay boi cron job: Thu 2 / 4 / 6 luc 10:00 sang
# Cron entry: 0 10 * * 1,3,5 cd "/path/to/Social Media Auto Post" && bash run-generate.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"
LOG_FILE="$LOG_DIR/scheduler-$(date '+%Y-%m').log"

mkdir -p "$LOG_DIR"

log() {
    local line="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$line"
    echo "$line" >> "$LOG_FILE"
}

log "=== Cron job bat dau ==="
cd "$SCRIPT_DIR"

if python3 content_generator.py >> "$LOG_FILE" 2>&1; then
    log "=== Hoan thanh OK ==="
else
    log "=== LOI: exit code $? ==="
fi
