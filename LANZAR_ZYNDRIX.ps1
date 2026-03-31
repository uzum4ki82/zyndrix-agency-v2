# LANZADOR AUTOMÁTICO DE ZYNDRIX AI - v1.0.1
# Este script sube tu proyecto a GitHub y lo prepara para Vercel en un solo clic.

Write-Host "🕵️‍♂️ Iniciando Motor de Lanzamiento de Zyndrix AI..." -ForegroundColor Cyan

# 1. Verificar Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Git no está instalado en este sistema." -ForegroundColor Red
    Pause
    exit
}

# 2. Configurar Repositorio
Write-Host "📦 Preparando repositorio local..." -ForegroundColor Green
git init
git add .
git commit -m "Zyndrix AI v1.0.1 - Production Ready / Brand White-Label 360"

# 3. Instrucción de GitHub
Write-Host "🚀 PASO 1: Crea un repositorio vacío en GitHub (https://github.com/new)" -ForegroundColor Yellow
Write-Host "🔗 PASO 2: Pega aquí la URL de tu repositorio de GitHub (ej: https://github.com/usuario/zyndrix-agency):" -ForegroundColor White
$repoUrl = Read-Host

if ($repoUrl -ne "") {
    git remote add origin $repoUrl
    Write-Host "📈 Subiendo código de Zyndrix a la nube..." -ForegroundColor Green
    git push -u origin main -f
} else {
    Write-Host "⚠️ Operación de GitHub cancelada o URL vacía." -ForegroundColor Yellow
}

# 4. Lanzar Vercel
Write-Host "🌌 PASO 3: Desplegando en Vercel..." -ForegroundColor Magenta
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    vercel
} else {
    Write-Host "🔎 Vercel CLI no detectado. Abre https://vercel.com/new y conecta tu repo de GitHub." -ForegroundColor Cyan
}

Write-Host "✅ ¡Zyndrix AI está en camino al espacio exterior! Sesión completada con éxito." -ForegroundColor Green
Pause
