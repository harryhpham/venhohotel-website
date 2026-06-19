#!/bin/bash
# Ven Ho Hotel — Khoi dong website

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Dang khoi dong Ven Ho Hotel website..."
echo ""
echo "Chon che do:"
echo "  1. npm run dev  (phat trien - co live reload)"
echo "  2. npx serve out (xem ban build)"
echo ""
read -rp "Nhap 1 hoac 2: " choice

if [ "$choice" = "1" ]; then
    echo "Khoi dong dev server..."
    npm run dev
else
    echo "Khoi dong static server..."
    npx serve out -p 3000
fi
