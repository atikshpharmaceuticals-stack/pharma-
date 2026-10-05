Add-Type -AssemblyName System.Drawing

$src = "C:/Users/WIN--11/.gemini/antigravity/brain/e86e433f-c38e-4133-9474-4cbb0e74db4d/.user_uploaded/media_1791116341924.png"
$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $src).Path)
$h = $bmp.Height

$minY = $h
$maxY = 0

for ($x = 33; $x -le 387; $x++) {
    for ($y = 0; $y -lt $h; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Symbol Y range: [$minY, $maxY]"
$cropW = (387 - 33) + 1
$cropH = ($maxY - $minY) + 1
Write-Output "Exact Symbol Dimensions: $cropW x $cropH"

$bmp.Dispose()
