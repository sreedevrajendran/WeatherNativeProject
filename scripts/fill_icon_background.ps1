
Add-Type -AssemblyName System.Drawing

$iconPath = "$PSScriptRoot/../assets/icon.png"
$outputPath = "$PSScriptRoot/../assets/icon_filled.png"

# Load original
if (-not (Test-Path $iconPath)) {
    Write-Error "Icon not found at $iconPath"
    exit 1
}

$original = [System.Drawing.Bitmap]::FromFile($iconPath)
$width = 1024
$height = 1024

# Create new bitmap
$newBitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($newBitmap)

# Set high quality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Fill with Dark Slate Blue (matching app theme)
# You can change this to [System.Drawing.ColorTranslator]::FromHtml("#4A90E2") for Splash Blue
# or "#1E293B" for Dark Slate
$bgColor = [System.Drawing.ColorTranslator]::FromHtml("#1E293B")
$graphics.Clear($bgColor)

# Draw original icon on top
# Since original is already 1024x1024 (resized with transparency), we just draw it 1:1
$graphics.DrawImage($original, 0, 0, $width, $height)

# Save
$newBitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Clean up
$graphics.Dispose()
$newBitmap.Dispose()
$original.Dispose()

Write-Host "Created filled icon at $outputPath"
