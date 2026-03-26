Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-v14-raw.jpg"
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
        
        # Thresholds
        if ($sat -gt 25) {
            # Logo colored halo or Z body
            $newBmp.SetPixel($x, $y, $c)
        } elseif ($avg -gt 250) {
            # White pixels. We check if it's text by checking neighbors.
            # Only keep if it's a THIN line.
            # If (x+10, y) is also white, it might be a block.
            $isBlock = $false
            if ($x + 10 -lt $bmp.Width) {
                $c2 = $bmp.GetPixel($x+10, $y)
                if ($c2.R -gt 250) { $isBlock = $true }
            }
            if ($isBlock) {
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
Write-Host "Logo v14 RE-CLEANED - Blocks Removed"
