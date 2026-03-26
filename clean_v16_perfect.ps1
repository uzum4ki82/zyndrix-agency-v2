Add-Type -AssemblyName System.Drawing
$inputPath = "C:\Users\omont\.gemini\antigravity\brain\461f8c8a-882b-4a23-816b-f24d7822f692\zyndrix_logo_black_v16_premium_1774554101186.png"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-logo-v14.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        
        # Calculate overall luminosity
        $lum = $c.R + $c.G + $c.B
        
        if ($lum -lt 3) {
            # Total black -> Transparent
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($lum -lt 100) {
            # Very dark areas -> Soft transparency gradient
            $alpha = [int](($lum / 100.0) * 255)
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
        } else {
            # Bright areas -> Keep
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo Black v16 Cleaned and Transparent - TOTAL SUCCESS"
