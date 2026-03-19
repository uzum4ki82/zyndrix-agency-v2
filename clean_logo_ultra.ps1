Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\img\zyndrix-orig.png"
$outputPath = "e:\Antigravity\web agencia ia\img\zyndrix-logo-ultra.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Limpieza de Checkerboard (patrón de grises)
        $diffRG = [Math]::Abs($c.R - $c.G)
        $diffGB = [Math]::Abs($c.G - $c.B)
        $isGrey = ($diffRG -lt 15) -and ($diffGB -lt 15)
        $avg = ($c.R + $c.G + $c.B) / 3
        
        # Si es gris y no es muy brillante (el blanco es > 200), lo borramos.
        if ($isGrey -and ($avg -lt 240)) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Realce sutil: Si es el texto blanco, aseguramos brillo total.
            if ($avg -gt 240) {
                $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, 255, 255, 255))
            } else {
                $newBmp.SetPixel($x, $y, $c)
            }
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo Ultra creado en $outputPath"
