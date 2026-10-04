Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "images/logo.png").Path
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $bmp.Width
$h = $bmp.Height

Write-Output "Image size: $w x $h"

# Find bounding box of the symbol (left half of image, x from 0 to 450)
$minX = $w
$maxX = 0
$minY = $h
$maxY = 0

for ($x = 0; $x -lt 450; $x++) {
    for ($y = 0; $y -lt $h; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # Check if pixel is not white
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Symbol Bounding Box: X=[$minX, $maxX], Y=[$minY, $maxY]"

$cropWidth = ($maxX - $minX) + 1
$cropHeight = ($maxY - $minY) + 1
Write-Output "Cropped Symbol Size: $cropWidth x $cropHeight"

# Create a cropped bitmap with transparent background
$cropped = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $cropWidth; $x++) {
    for ($y = 0; $y -lt $cropHeight; $y++) {
        $origColor = $bmp.GetPixel($minX + $x, $minY + $y)
        
        # If nearly white, make transparent
        if ($origColor.R -gt 245 -and $origColor.G -gt 245 -and $origColor.B -gt 245) {
            $cropped.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } else {
            # Compute alpha for smooth anti-aliased edge
            $whiteness = [Math]::Min($origColor.R, [Math]::Min($origColor.G, $origColor.B))
            if ($whiteness -gt 220) {
                $alpha = [int](255 * (255 - $whiteness) / 35.0)
                if ($alpha -gt 255) { $alpha = 255 }
                if ($alpha -lt 0) { $alpha = 0 }
                $cropped.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $origColor.R, $origColor.G, $origColor.B))
            } else {
                $cropped.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $origColor.R, $origColor.G, $origColor.B))
            }
        }
    }
}

$destPath = Join-Path (Get-Location) "images/symbol.png"
$cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Cropped transparent symbol saved to: $destPath"

$cropped.Dispose()
$bmp.Dispose()
