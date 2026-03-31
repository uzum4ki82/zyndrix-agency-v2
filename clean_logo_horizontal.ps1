Add-Type -AssemblyName System.Drawing
$inputPath = "C:\Users\omont\.gemini\antigravity\brain\c256ee38-c75e-49de-8326-47f11c6f8fc5\zyndrix_horizontal_logo_png_1774965730376.png"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-ultimate.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

# Cleaing for the horizontal logo
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $lum = $c.R + $c.G + $c.B
        
        if ($lum -lt 30) {
            # More aggressive cleaning for generated black background
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($lum -lt 250) {
            # Ultra smooth glow for professional horizontal logo
            $alpha = [int](($lum / 250.0) * 255)
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
Write-Host "Horizontal Logo Refined - READY"
