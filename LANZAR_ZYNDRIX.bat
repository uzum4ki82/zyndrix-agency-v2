@echo off
TITLE ZYNDRIX PRODUCTION COMMANDER
color 0b

echo ======================================================
echo           ZYNDRIX SYSTEM - ADAPTIVE POWER
echo ======================================================
echo.
echo [1/3] Verificando infraestructura...
if not exist node_modules (
    echo [!] Instalando dependencias necesarias...
    call npm install
)

echo [2/3] Iniciando DAEMON (Motor Autónomo v2.2)...
start "ZYNDRIX_DAEMON" cmd /k "node zyndrix_daemon.js"

echo [3/3] Iniciando DASHBOARD (Interfaz de Control)...
start http://localhost:3000
echo.
echo [✓] Sistema totalmente operativo.
echo [!] Monitoriza los logs en la ventana 'ZYNDRIX_DAEMON'.
echo.

npm run dev
pause
