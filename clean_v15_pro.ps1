Add-Type -AssemblyName System.Drawing
$inputPath = "C:\Users\omont\.gemini\antigravity\brain\461f8c8a-882b-4a23-816b-f24d7822f692\zyndrix_logo_final_masterpiece_v17_black_1774555597570.png"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v15.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

$minX = $bmp.Width; $maxX = 0; $minY = $bmp.Height; $maxY = 0;

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $lum = $c.R + $c.G + $c.B
        
        if ($lum -lt 5) {
            # Total black -> Transparent
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Logo colored halo or text
            $alpha = 255
            if ($lum -lt 100) { $alpha = [int](($lum / 100.0) * 255) }
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            
            # Bound tracking for trimming
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

# TRIM
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
Write-Host "Logo v15 FINAL PRO - Perfect and Trimmed"
