#!/bin/bash
# Ven Ho Hotel — Daily Revenue Report Runner
# Chay qua launchd: 9:00 AM (chinh) + 10:30 AM (du phong neu Mac reboot sau 9h)
# Lock file /tmp/venho-revenue-YYYY-MM-DD.lock chong gui email trung

export SKYHOTEL_USER="koibito"
export SKYHOTEL_PASS="Venho181"
export GMAIL_USER="venhohotel@gmail.com"
export GMAIL_APP_PASS="hasw tptk oflx jbzp"   # 16 ky tu tu Google Account -> Security -> App passwords

LOCK="/tmp/venho-revenue-$(date +%Y-%m-%d).lock"
if [ -f "$LOCK" ]; then
    echo "[$(date '+%H:%M %d/%m/%Y')] Da gui bao cao hom nay — bo qua."
    exit 0
fi
touch "$LOCK"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "[$(date '+%H:%M %d/%m/%Y')] Bat dau lay bao cao doanh thu..."
python3 "$SCRIPT_DIR/skyhotel-scraper.py"
echo "[$(date '+%H:%M %d/%m/%Y')] Hoan thanh."
