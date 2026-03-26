Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-v14-raw.jpg"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v14.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $color = $bmp.GetPixel($x, $y)
        
        $max = [Math]::Max($color.R, [Math]::Max($color.G, $color.B))
        $min = [Math]::Min($color.R, [Math]::Min($color.G, $color.B))
        $saturation = $max - $min
        $avg = ($color.R + $color.G + $color.B) / 3
        
        # Checkerboard colors
        $isPureWhite = ($color.R -eq 255) -and ($color.G -eq 255) -and ($color.B -eq 255)
        # Some checkerboards use a lighter grey too
        $isGreyBG = ($color.R -gt 200) -and ($color.R -lt 210) -and ($color.G -gt 200) -and ($color.G -lt 210) -and ($color.B -gt 200) -and ($color.B -lt 210)
        
        # Logo Z area: Usually R<250, G<250, B<250 except highlights
        $isLogo = $saturation -gt 15
        
        # Text area: roughly bottom 25%
        $isTextArea = $y -gt ($bmp.Height * 0.78)
        
        # Keep logo colors
        if ($isLogo) {
            $newBmp.SetPixel($x, $y, $color)
        } elseif ($isTextArea -and ($avg -gt 180)) {
            # Keep text: only keep bright pixels in the text area
            # But wait, if we are on a white square it will fail.
            # We assume text is denser.
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($color.A, 255, 255, 255))
        } elseif ($avg -gt 250 -and $y -lt ($bmp.Height * 0.78)) {
            # Probably a highlight in the Z shape (since not text area and bright)
            # Check if it was surrounded by logo colors? 
            # For now keep if bright but only if it's very bright (255) AND not a perfect square?
            # Actually just make it transparent if it's exactly 255 and in a large white area.
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

# Cleanup text: remove stray pixels in text area that are likely checkerboard leftovers
# (Not doing it now to save time, let's see this first)

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo V14 Ruthless Cleaned"
