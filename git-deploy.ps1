# SCRIPT DE DESPLIEGUE ROBUSTO DE ZYNDRIX AI
Write-Host "🕵️‍♂️ Iniciando Sincronización de Producción de Zyndrix..." -ForegroundColor Cyan

# 1. Registrar Cambios
git add .
Write-Host "✅ Archivos registrados." -ForegroundColor Green

# 2. Realizar Commit
$msg = "Zyndrix AI v1.1.1 - Final Dashboard Production Build / Data Clean Slate / White-Label"
git commit -m $msg
Write-Host "✅ Versión sellada en historial." -ForegroundColor Green

# 3. Forzar Push
Write-Host "🚀 Lanzando a la nube..." -ForegroundColor Yellow
git push origin main -f
Write-Host "✅ Zyndrix está en línea en GitHub." -ForegroundColor Green
