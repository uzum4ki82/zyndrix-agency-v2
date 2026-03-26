Add-Type -AssemblyName System.Drawing
$inputPath = "C:\Users\omont\.gemini\antigravity\brain\461f8c8a-882b-4a23-816b-f24d7822f692\zyndrix_logo_ultra_premium_v15_1774553559994.png"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v14.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $max = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
        $min = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
        $sat = $max - $min
        $avg = ($c.R + $c.G + $c.B) / 3
        
        # In this generated image, the "transparent" background is a grey checkerboard.
        # Logo colors are very saturated.
        # Text is white (Avg > 240, Sat < 10).
        
        $isLogo = ($sat -gt 15)
        $isText = ($avg -gt 150) -and ($sat -lt 15)
        
        # Checkerboard is grey (Avg ~ 10-50, Sat ~ 0).
        # Wait, looking at the image, some squares are dark grey, some black.
        
        if ($isLogo -or $isText) {
            # Check if it's REALLY text and not a light checkerboard square
            # Actually, the text is VERY bright white. Squares are dark.
            if ($avg -lt 140 -and -not $isLogo) {
                 # It's a dark checkerboard square
                 $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                 $newBmp.SetPixel($x, $y, $c)
            }
        } else {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo Ultra FINAL - Super Clean"
