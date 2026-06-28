#!/bin/bash
# setup.sh — Cai thu vien Python (chay 1 lan)

echo "=== VenHoSocialManager Setup ==="
echo "Dang cai thu vien Python..."

pip3 install openai python-dotenv google-api-python-client google-auth-oauthlib google-auth-httplib2

echo ""
echo "=== Checklist thiet lap ==="
echo ""
echo "1. [x] Thu vien da cai xong"
echo "2. [ ] Copy .env.example -> .env"
echo "       cp .env.example .env"
echo "3. [ ] Dien OPENAI_API_KEY vao .env"
echo "       Lay tai: platform.openai.com/api-keys"
echo "4. [ ] Dien GMAIL_APP_PASSWORD vao .env"
echo "       Huong dan: myaccount.google.com -> Security -> App passwords"
echo "5. [ ] Setup Google Drive (1 lan duy nhat):"
echo "       a. Vao: console.cloud.google.com"
echo "       b. Tao project moi (hoac chon project cu)"
echo "       c. Enable API: APIs & Services > Enable APIs > tim 'Google Drive API' > Enable"
echo "       d. Tao credentials: APIs & Services > Credentials > Create Credentials > OAuth 2.0 Client ID"
echo "          - Application type: Desktop app"
echo "          - Download file JSON > doi ten thanh credentials.json"
echo "          - Copy vao thu muc VenHoSocialManager/"
echo "       e. Xac thuc lan dau (mo trinh duyet):"
echo "          python3 google_drive.py"
echo "6. [ ] Test thu cong:"
echo "       python3 generate_content.py --force"
echo "7. [ ] Kiem tra email tai hpham1504@gmail.com"
echo "8. [ ] Kiem tra Google Drive: tim folder 'VenHoSocialManager'"
echo "9. [ ] Dang ky cron (chay tu dong Thu 2/4/6 luc 10:00 AM):"
echo "       crontab -e"
echo "       Them dong sau:"
echo '       0 10 * * 1,3,5 cd "/Users/hanhpham/Developer/Claude-Workspace/projects/Ven Ho Hotel/VenHoSocialManager" && bash run-generate.sh'
echo ""
echo "=== Xong! ==="
