Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v13.png"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v13-clean.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

# Checkerboard typically has white (#FFFFFF) and light grey (#CCCCCC)
# The logo has cyan/blue and white text.

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        
        # Calculate color distance to common "checkerboard" grays
        $diffRG = [Math]::Abs($c.R - $c.G)
        $diffGB = [Math]::Abs($c.G - $c.B)
        $isGrey = ($diffRG -lt 15) -and ($diffGB -lt 15)
        
        # If it's a grey pixel and not very bright white, or if it's white but in the background
        # We assume anything with low saturation (isGrey) above a certain brightness is background
        # UNLESS it's the white text of the logo.
        # But wait, the logo's text is white.
        
        # Sophisticated check: If it's pure white (R:255,G:255,B:255) it MIGHT be text or background.
        # If it's slightly grey (R~200, G~200, B~200) it's almost certainly background.
        
        $isBackground = ($isGrey -and $c.R -gt 150 -and $c.R -lt 250) -or ($c.R -gt 250 -and $c.G -gt 250 -and $c.B -gt 250 -and $x -lt 50)
        
        # Actually, let's just use a simpler heuristic: If saturation is very low and it's bright, it's background.
        # But we need to keep the white text.
        # Usually the logo is in the middle.
        
        if ($isBackground) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo Limpio v13 creado!"
