Add-Type -AssemblyName System.Drawing

$src = "C:/Users/WIN--11/.gemini/antigravity/brain/e86e433f-c38e-4133-9474-4cbb0e74db4d/.user_uploaded/media_1791116341924.png"
$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $src).Path)

$minX = 33
$maxX = 387
$minY = 152
$maxY = 417

$w = ($maxX - $minX) + 1
$h = ($maxY - $minY) + 1

$cleanBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$lightBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $w; $x++) {
    for ($y = 0; $y -lt $h; $y++) {
        $orig = $bmp.GetPixel($minX + $x, $minY + $y)

        # Transparency threshold
        if ($orig.R -gt 248 -and $orig.G -gt 248 -and $orig.B -gt 248) {
            $cleanBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
            $lightBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } else {
            # Smooth anti-aliased edge
            $minChannel = [Math]::Min($orig.R, [Math]::Min($orig.G, $orig.B))
            $alpha = 255
            if ($minChannel -gt 225) {
                $alpha = [int](255 * (255 - $minChannel) / 30.0)
                if ($alpha -gt 255) { $alpha = 255 }
                if ($alpha -lt 0) { $alpha = 0 }
            }

            $cleanBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $orig.R, $orig.G, $orig.B))

            # Light version for dark footer: enhance dark navy pixels with bright cyan/blue
            $brightness = ($orig.R * 0.299 + $orig.G * 0.587 + $orig.B * 0.114)
            if ($brightness -lt 110) {
                $newR = [int]([Math]::Min(255, $orig.R + 60))
                $newG = [int]([Math]::Min(255, $orig.G + 185))
                $newB = [int]([Math]::Min(255, $orig.B + 220))
                $lightBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $newR, $newG, $newB))
            } else {
                $lightBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $orig.R, $orig.G, $orig.B))
            }
        }
    }
}

$dest1 = (Resolve-Path "images").Path + "\symbol.png"
$dest2 = (Resolve-Path "images").Path + "\symbol-light.png"

$cleanBmp.Save($dest1, [System.Drawing.Imaging.ImageFormat]::Png)
$lightBmp.Save($dest2, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Output "Clean symbol saved: $dest1 ($w x $h)"
Write-Output "Light symbol saved: $dest2 ($w x $h)"

$cleanBmp.Dispose()
$lightBmp.Dispose()
$bmp.Dispose()
