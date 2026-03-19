Add-Type -AssemblyName System.Drawing
$inputPath = "e:\Antigravity\web agencia ia\img\zyndrix-logo-user.png"
$outputPath = "e:\Antigravity\web agencia ia\img\zyndrix-logo-final.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
$g = [System.Drawing.Graphics]::FromImage($newBmp)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Lógica de eliminación de checkerboard: 
        # Si el píxel es gris (R~G~B) y no es muy brillante, lo hacemos transparente.
        # El logo es Blanco (brillante) o Cian (B y G altos).
        $isGrey = ([Math]::Abs($c.R - $c.G) -lt 20) -and ([Math]::Abs($c.G - $c.B) -lt 20)
        $isDark = ($c.R + $c.G + $c.B) -lt 400
        
        if ($isGrey -and $isDark) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Logo final con transparencia real creado en $outputPath"
