Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "images/symbol.png").Path
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $bmp.Width
$h = $bmp.Height

$lightBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $w; $x++) {
    for ($y = 0; $y -lt $h; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.A -gt 0) {
            # If the pixel is dark navy (low R, low G, high B or low brightness), brighten it
            $brightness = ($c.R * 0.299 + $c.G * 0.587 + $c.B * 0.114)
            if ($brightness -lt 100) {
                # Map dark navy to vibrant light cyan/teal
                $newR = [int]([Math]::Min(255, $c.R + 60))
                $newG = [int]([Math]::Min(255, $c.G + 180))
                $newB = [int]([Math]::Min(255, $c.B + 210))
                $lightBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, $newR, $newG, $newB))
            } else {
                $lightBmp.SetPixel($x, $y, $c)
            }
        } else {
            $lightBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$destPath = Join-Path (Get-Location) "images/symbol-light.png"
$lightBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Light symbol saved: $destPath"

$lightBmp.Dispose()
$bmp.Dispose()
