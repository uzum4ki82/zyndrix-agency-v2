Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\img\zyndrix-orig-v2.png"
$outputPath = "e:\Antigravity\web agencia ia\img\zyndrix-logo-user-v2.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
$g = [System.Drawing.Graphics]::FromImage($newBmp)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Lógica de transparencia: El checkerboard consiste en píxeles grises (R=G=B).
        # El logo tiene Blanco puro o Cian (B y G altos).
        $diffRG = [Math]::Abs($c.R - $c.G)
        $diffGB = [Math]::Abs($c.G - $c.B)
        $isGrey = ($diffRG -lt 12) -and ($diffGB -lt 12)
        $isNotBright = ($c.R + $c.G + $c.B) -lt 600 # Mantenemos el blanco brillante del logo
        
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
Write-Host "Logo V2 con transparencia real creado en $outputPath"
