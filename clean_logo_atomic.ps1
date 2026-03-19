Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\img\zyndrix-orig.png"
$outputPath = "e:\Antigravity\web agencia ia\img\zyndrix-logo-atomic.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

# Colores Objetivo
# Cian/Teal: R:85, G:225, B:210
# Blanco: R:255, G:255, B:255

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        
        # Distancia al Cian
        $distTeal = [Math]::Sqrt([Math]::Pow($c.R - 85, 2) + [Math]::Pow($c.G - 225, 2) + [Math]::Pow($c.B - 210, 2))
        
        # Distancia al Blanco
        $distWhite = [Math]::Sqrt([Math]::Pow($c.R - 255, 2) + [Math]::Pow($c.G - 255, 2) + [Math]::Pow($c.B - 255, 2))
        
        # Umbralización Agresiva: 
        # Si no se parece lo suficiente a ninguno de los dos colores maestros, fuera.
        # El umbral para Cian debe ser generoso para permitir gradientes, pero no tanto para incluir grises.
        # Los grises del fondo tienen distTeal grande (>150).
        
        $isColor = ($distTeal -lt 140) -or ($distWhite -lt 100)
        
        # Control de gris adicional: Si R, G y B están muy equilibrados, es casi seguro el fondo.
        $diffRG = [Math]::Abs($c.R - $c.G)
        $diffGB = [Math]::Abs($c.G - $c.B)
        $isPureGrey = ($diffRG -lt 8) -and ($diffGB -lt 8) -and ($c.R -lt 230)
        
        if ($isColor -and -not $isPureGrey) {
            $newBmp.SetPixel($x, $y, $c)
        } else {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo Atómico creado en $outputPath"
