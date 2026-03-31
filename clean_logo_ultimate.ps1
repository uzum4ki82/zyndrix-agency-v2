Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v16.png"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-ultimate.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

# More aggressive cleaning for surgical transparency
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $lum = $c.R + $c.G + $c.B
        
        if ($lum -lt 15) {
            # Kill dark gray halos
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($lum -lt 220) {
            # Extended gradient for ultra-smooth glow
            $alpha = [int](($lum / 220.0) * 255)
            # Ensure alpha doesn't exceed 255
            if ($alpha -gt 255) { $alpha = 255 }
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
        } else {
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Zydrix Ultimate Logo Surgically Refined - OK"
