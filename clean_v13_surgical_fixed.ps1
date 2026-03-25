Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v13.png"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v13-clean.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $color = $bmp.GetPixel($x, $y)
        
        # Original surgical logic:
        # Cian has G and B hits, R low.
        # White has R,G,B high.
        # Grey has R=G=B.
        
        $isTeal = ($color.G -gt 100) -and ($color.B -gt 100) -and ($color.G -gt ($color.R + 40))
        $isWhite = ($color.R -gt 210) -and ($color.G -gt 210) -and ($color.B -gt 210)
        
        # Check if it's NOT a background grey (like #CCCCCC or #EEEEEE)
        $diffRG = [Math]::Abs($color.R - $color.G)
        $diffGB = [Math]::Abs($color.G - $color.B)
        $isGrey = ($diffRG -lt 15) -and ($diffGB -lt 15)
        
        if (($isTeal -or $isWhite) -and (-not $isGrey -or ($color.R + $color.G + $color.B) -gt 700)) {
            $newBmp.SetPixel($x, $y, $color)
        } else {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo Limpio (Surgical) terminado!"
