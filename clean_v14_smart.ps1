Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-v14-raw.jpg"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v14.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

# Create a temporary array for processing - using 1D array to avoid multi-dimensional issues if any
$bmpWidth = $bmp.Width
$bmpHeight = $bmp.Height
$pixels = New-Object "System.Drawing.Color[]" ($bmpWidth * $bmpHeight)

for ($y = 0; $y -lt $bmpHeight; $y++) {
    for ($x = 0; $x -lt $bmpWidth; $x++) {
        $pixels[$y * $bmpWidth + $x] = $bmp.GetPixel($x, $y)
    }
}

for ($y = 0; $y -lt $bmpHeight; $y++) {
    for ($x = 0; $x -lt $bmpWidth; $x++) {
        $color = $pixels[$y * $bmpWidth + $x]
        $max = [Math]::Max($color.R, [Math]::Max($color.G, $color.B))
        $min = [Math]::Min($color.R, [Math]::Min($color.G, $color.B))
        $saturation = $max - $min
        
        $isPureWhite = ($color.R -gt 250) -and ($color.G -gt 250) -and ($color.B -gt 250)
        
        $isLargeWhiteBlock = $false
        if ($isPureWhite) {
            $allWhite = $true
            for ($dy = -2; $dy -le 2; $dy++) {
                for ($dx = -2; $dx -le 2; $dx++) {
                    $nx = $x + $dx
                    $ny = $y + $dy
                    if ($nx -ge 0 -and $nx -lt $bmpWidth -and $ny -ge 0 -and $ny -lt $bmpHeight) {
                        $nc = $pixels[$ny * $bmpWidth + $nx]
                        if ($nc.R -lt 245) { $allWhite = $false; break }
                    }
                }
                if (-not $allWhite) { break }
            }
            $isLargeWhiteBlock = $allWhite
        }
        
        if ($saturation -gt 20) {
            $newBmp.SetPixel($x, $y, $color)
        } elseif ($isPureWhite -and -not $isLargeWhiteBlock) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
        } else {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo V14 Smart Cleaned - Version 2"
