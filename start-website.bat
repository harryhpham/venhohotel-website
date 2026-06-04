@echo off
echo Dang khoi dong Ven Ho Hotel website...
cd /d "%~dp0"
echo.
echo Chon che do:
echo 1. npm run dev  (phat trien - co live reload)
echo 2. npx serve out (xem ban build)
echo.
set /p choice="Nhap 1 hoac 2: "

if "%choice%"=="1" (
    echo Khoi dong dev server...
    npm run dev
) else (
    echo Khoi dong static server...
    npx serve out -p 3000
)
pause
