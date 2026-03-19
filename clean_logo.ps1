Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\img\zyndrix-orig.png"
$outputPath = "e:\Antigravity\web agencia ia\img\zyndrix-logo-user-final.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
$g = [System.Drawing.Graphics]::FromImage($newBmp)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # El checkerboard es gris alternado. 
        # El logo tiene Blanco (255,255,255), Cian (brillante) y brillos.
        # Eliminamos píxeles donde R, G y B sean similares y oscuros/medios (gris).
        $diffRG = [Math]::Abs($c.R - $c.G)
        $diffGB = [Math]::Abs($c.G - $c.B)
        $isGrey = ($diffRG -lt 15) -and ($diffGB -lt 15)
        $isNotBright = ($c.R + $c.G + $c.B) -lt 550 # Evita borrar el blanco puro
        
        if ($isGrey -and $isNotBright) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Procesamiento completado: $outputPath"
