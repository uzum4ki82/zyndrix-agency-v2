param(
    [string]$InputFile,
    [string]$OutputFile,
    [int]$Threshold = 40
)

Add-Type -AssemblyName System.Drawing

if (-not $InputFile -or -not (Test-Path $InputFile)) {
    Write-Host "Please provide a valid input file."
    exit
}

if (-not $OutputFile) {
    $OutputFile = $InputFile.Replace(".png", "-clean.png")
}

$bmp = New-Object System.Drawing.Bitmap($InputFile)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        
        # Check if pixel is near black
        if ($c.R -le $Threshold -and $c.G -le $Threshold -and $c.B -le $Threshold) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # For non-black pixels, if they are part of the white logo but have some black bleed
            # we could potentially enhance them, but for now simple copy is fine.
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$newBmp.Save($OutputFile, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()

Write-Host "Cleaned image saved to: $OutputFile"
