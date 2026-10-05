Add-Type -AssemblyName System.Drawing

$src = "C:/Users/WIN--11/.gemini/antigravity/brain/e86e433f-c38e-4133-9474-4cbb0e74db4d/.user_uploaded/media_1791116341924.png"
$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $src).Path)
$w = $bmp.Width
$h = $bmp.Height

Write-Output "Image Dimensions: $w x $h"

# Find non-white pixel count per column X
$colCounts = @()
for ($x = 0; $x -lt 600; $x++) {
    $count = 0
    for ($y = 0; $y -lt $h; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            $count++
        }
    }
    $colCounts += [PSCustomObject]@{ X = $x; NonWhite = $count }
}

# Print columns where non-white pixels transition from symbol to gap, and gap to text
$inSymbol = $false
$gapStart = 0
$gapEnd = 0

for ($i = 0; $i -lt 550; $i++) {
    $count = $colCounts[$i].NonWhite
    if ($count -gt 0 -and -not $inSymbol) {
        Write-Output "Symbol starts at X = $i"
        $inSymbol = $true
    }
    if ($count -eq 0 -and $inSymbol -and $gapStart -eq 0) {
        $gapStart = $i
        Write-Output "Symbol ends at X = $($i - 1)"
    }
    if ($count -gt 0 -and $gapStart -gt 0 -and $gapEnd -eq 0) {
        $gapEnd = $i
        Write-Output "Text 'Atiksh' starts at X = $i"
        break
    }
}

$bmp.Dispose()
