Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-v14-raw.jpg"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v14.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

# Create a copy to work with
$g = [System.Drawing.Graphics]::FromImage($newBmp)
$g.DrawImage($bmp, 0, 0)
$g.Dispose()

# Flood fill from the corners
# We'll use a tolerance
$tolerance = 60

function ColorDist($c1, $c2) {
    return [Math]::Abs($c1.R - $c2.R) + [Math]::Abs($c1.G - $c2.G) + [Math]::Abs($c1.B - $c2.B)
}

# The background is checkerboard (white and grey)
# We can't just flood fill ONE color.
# But we can remove ANYTHING that is "not colorful" and connected to the outside.

# For simplicity, let's just go back to the "Smart" script but fix the error.
# The error was in array access or something.

$bmpWidth = $bmp.Width
$bmpHeight = $bmp.Height

for ($y = 0; $y -lt $bmpHeight; $y++) {
    for ($x = 0; $x -lt $bmpWidth; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $max = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
        $min = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
        $sat = $max - $min
        $avg = ($c.R + $c.G + $c.B) / 3
        
        # Checkerboard squares are ~24-32 pixels.
        # If we remove anything with Sat < 15 and not VERY white (not text), it's background.
        
        # Text is VERY white (Avg > 240) and has low saturation.
        # Checkerboard white is also Avg > 240 and low saturation.
        # BUT text is surrounded by dark background if we clean it? No.
        
        # Let's try this: if it's very white AND surrounded by other very white pixels in a 10x10 area, it's a square.
        # This detection is robust.
        
        $kill = $false
        if ($sat -lt 25) {
            if ($avg -lt 245) {
                # Grey square or grid line
                $kill = $true
            } else {
                # Could be text or white square.
                # Check neighbors at distance 5
                $isSquare = $true
                foreach ($ox in @(-5, 0, 5)) {
                    foreach ($oy in @(-5, 0, 5)) {
                        if ($ox -ne 0 -or $oy -ne 0) {
                            $nx = $x + $ox
                            $ny = $y + $oy
                            if ($nx -ge 0 -and $nx -lt $bmpWidth -and $ny -ge 0 -and $ny -lt $bmpHeight) {
                                $nc = $bmp.GetPixel($nx, $ny)
                                if (($nc.R + $nc.G + $nc.B) / 3 -lt 240) { $isSquare = $false; break }
                            }
                        }
                    }
                    if (-not $isSquare) { break }
                }
                if ($isSquare) { $kill = $true }
            }
        }
        
        if ($kill) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo V14 FINAL Smart Cleaned"
