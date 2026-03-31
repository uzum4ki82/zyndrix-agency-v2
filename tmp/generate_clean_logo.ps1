Add-Type -AssemblyName System.Drawing
$inputPath = "C:\Users\omont\.gemini\antigravity\brain\c256ee38-c75e-49de-8326-47f11c6f8fc5\zyndrix_horizontal_logo_png_1774965730376.png"
$outputPath = "e:\Antigravity\web agencia ia\public\img\zyndrix-live.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $alpha = [math]::Max($c.R, [math]::Max($c.G, $c.B))
        if ($alpha -gt 35) {
             # Unmultiply alpha formula
             $r = [int](($c.R / $alpha) * 255)
             $g = [int](($c.G / $alpha) * 255)
             $b = [int](($c.B / $alpha) * 255)
             if ($r -gt 255) { $r = 255 }
             if ($g -gt 255) { $g = 255 }
             if ($b -gt 255) { $b = 255 }
             $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
        } else {
             $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}
$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose(); $newBmp.Dispose()
