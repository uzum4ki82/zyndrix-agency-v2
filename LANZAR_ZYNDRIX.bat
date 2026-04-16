@echo off
TITLE ZYNDRIX COMMANDER - MOTOR DE PROSPECCION AUTONOMA
color 0b

echo ======================================================
echo           ZYNDRIX COMMANDER - AI ENGINE
echo ======================================================
echo.
echo [1/3] Verificando entorno de ejecucion...
if not exist node_modules (
    echo [!] Error: No se detectan dependencias instaladas.
    echo [!] Ejecutando instalacion rapida...
    call npm install
)

echo [2/3] Arrancando Nucleo de Prospeccion (Localhost:3000)...
start http://localhost:3000

echo [3/3] Iniciando Servidor...
echo.
echo Presiona CTRL+C para detener el motor.
echo.
npm run dev
pause
