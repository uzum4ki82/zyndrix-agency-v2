Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\img\zyndrix-orig.png"
$outputPath = "e:\Antigravity\web agencia ia\img\zyndrix-logo-surgical.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        
        # El logo tiene Cian (Símbolo Z) y Blanco (Texto).
        # Análisis cromático:
        # Cian tiene G y B altos, R bajo.
        # Blanco tiene R, G, B altos.
        # El checkerboard es Gris (R~G~B).
        
        $isTeal = ($c.G -gt 100) -and ($c.B -gt 100) -and ($c.G -gt ($c.R + 40))
        $isWhite = ($c.R -gt 200) -and ($c.G -gt 200) -and ($c.B -gt 200)
        
        # Umbral de gris: Si R, G y B son muy parecidos, es el fondo.
        $diffRG = [Math]::Abs($c.R - $c.G)
        $diffGB = [Math]::Abs($c.G - $c.B)
        $isGrey = ($diffRG -lt 15) -and ($diffGB -lt 15)
        
        if (($isTeal -or $isWhite) -and (-not $isGrey -or ($c.R + $c.G + $c.B) -gt 700)) {
            # Preservar el píxel
            $newBmp.SetPixel($x, $y, $c)
        } else {
            # Eliminar cuadrícula
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo Quirúrgico creado en $outputPath"
