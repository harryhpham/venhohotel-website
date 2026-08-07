#!/bin/bash
# Ven Ho Hotel — Dang Bai Social Media

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo " =========================================="
echo "  Ven Ho Hotel - Dang Bai Social Media"
echo " =========================================="
echo ""
python3 post_publisher.py "$@"
