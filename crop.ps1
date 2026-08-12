Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Users\user\.gemini\antigravity-ide\scratch\economics_website\public\favicon.png")
Write-Output "Width: $($img.Width), Height: $($img.Height)"
$size = $img.Height
$rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, $rect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$img.Dispose()
$bmp.Save("C:\Users\user\.gemini\antigravity-ide\scratch\economics_website\public\favicon.png")
$bmp.Dispose()
Write-Output "Cropped to $($size)x$($size) and saved."
