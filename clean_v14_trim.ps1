Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-v14-raw.jpg"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v14.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

# Detection and Cleaning pass
$minX = $bmp.Width; $maxX = 0; $minY = $bmp.Height; $maxY = 0;

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $max = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
        $min = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
        $sat = $max - $min
        $avg = ($c.R + $c.G + $c.B) / 3
        
        $isLogo = ($sat -gt 25)
        $isPureWhite = ($avg -gt 250)
        
        $keep = $false
        if ($isLogo) {
            $keep = $true
        } elseif ($isPureWhite) {
            # Thick block removal
            $isBlock = $false
            if ($x + 10 -lt $bmp.Width) {
                if ($bmp.GetPixel($x+10, $y).R -gt 250) { $isBlock = $true }
            }
            if (-not $isBlock) { $keep = $true }
        }
        
        if ($keep) {
            $newBmp.SetPixel($x, $y, $c)
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        } else {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

# TRIM: If we found content, crop it.
if ($maxX -gt $minX) {
    $rect = New-Object System.Drawing.Rectangle($minX, $minY, ($maxX - $minX + 1), ($maxY - $minY + 1))
    $croppedBmp = $newBmp.Clone($rect, $newBmp.PixelFormat)
    $croppedBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $croppedBmp.Dispose()
} else {
    $newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
}

$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo v14 RE-CLEANED and TRIMMED - Success"
