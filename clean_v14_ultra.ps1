Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-v14-raw.jpg"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v14.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $color = $bmp.GetPixel($x, $y)
        
        # Calculate Saturation (simplified)
        $max = [Math]::Max($color.R, [Math]::Max($color.G, $color.B))
        $min = [Math]::Min($color.R, [Math]::Min($color.G, $color.B))
        $saturation = $max - $min
        $brightness = ($color.R + $color.G + $color.B) / 3
        
        # Logo Logic:
        # 1. Very bright whites (Text and Highlights)
        $isTextWhite = ($color.R -gt 245) -and ($color.G -gt 245) -and ($color.B -gt 245)
        # 2. Saturated colors (Teal, Purple)
        $isLogoColors = ($saturation -gt 40)
        # 3. Teal specific (strong blue and green)
        $isTeal = ($color.G -gt 130) -and ($color.B -gt 130)  -and ($color.G -gt ($color.R + 25))
        # 4. Purple specific
        $isPurple = ($color.R -gt 130) -and ($color.B -gt 130) -and ($color.B -gt ($color.G + 25))
        
        # GRID/Checkerboard logic:
        # Those background grid lines are usually greyish (R~G~B) or very pale.
        $isGrey = ($saturation -lt 15)
        $isBackgroundGrey = $isGrey -and ($color.R -lt 240) -and ($color.R -gt 140)
        $isBackgroundWhite = ($color.R -gt 250) -and ($color.G -gt 250) -and ($color.B -gt 250) 
        
        # WE NEED TO BE SURGICAL:
        # Keep it IF it's deeply teal/purple or VERY bright text.
        # But REJECT it if it's the exact colors of the grid lines.
        
        # Let's check for those specific cyan lines (R: 1xx, G: 2xx, B: 2xx)
        # Actually, the grid lines often have low saturation.
        
        if ($isTeal -or $isPurple -or ($isTextWhite -and $y -gt ($bmp.Height * 0.75))) {
             # Keep text white only in lower area for text
             $newBmp.SetPixel($x, $y, $color)
        } elseif (($isLogoColors -or ($brightness -gt 245)) -and -not $isBackgroundGrey -and -not $isBackgroundWhite) {
             # Keep highlights and saturated areas but not the background
             $newBmp.SetPixel($x, $y, $color)
        } else {
             $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo V14 Ultra Cleaned - Grid Removed"
