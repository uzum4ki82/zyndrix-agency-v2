Add-Type -AssemblyName System.Drawing
$inputPath = "C:\Users\omont\.gemini\antigravity\brain\38f8ef7e-7311-4129-94a2-f05e0956a1f2\zyndrix_logo_v14_black_bg_for_alpha_1773413733264.png"
$outputPath = "e:\Antigravity\web agencia ia\img\zyndrix-logo-alpha.png"

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$bmp.MakeTransparent([System.Drawing.Color]::Black)
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Logo con transparencia real creado en $outputPath"
