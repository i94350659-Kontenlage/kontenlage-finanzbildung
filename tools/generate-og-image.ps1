# Erzeugt das Social-Preview-Bild (Ticket P1-05) unter webseitenversionen/4.9.2026/public/og-image.png
# Aufruf: powershell -ExecutionPolicy Bypass -File tools/generate-og-image.ps1
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root 'webseitenversionen\4.9.2026\public\og-image.png'

$width = 1200
$height = 630
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$navy = [System.Drawing.ColorTranslator]::FromHtml('#111827')
$g.Clear($navy)

$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $rect,
  [System.Drawing.ColorTranslator]::FromHtml('#1b2942'),
  [System.Drawing.ColorTranslator]::FromHtml('#0a0f1c'),
  40)
$g.FillRectangle($gradient, $rect)

$gold = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#c9a84c'))
$goldLight = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#e2c27d'))
$cream = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#faf8f4'))
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#cdc6be'))

$g.FillRectangle($gold, 80, 132, 96, 6)

$fontTitle = New-Object System.Drawing.Font('Georgia', 68, [System.Drawing.FontStyle]::Bold)
$g.DrawString('Kontolage', $fontTitle, $cream, 74, 168)

$fontSub = New-Object System.Drawing.Font('Segoe UI', 30)
$g.DrawString('Unabhängige Finanzbildung & Steuerrechner', $fontSub, $goldLight, 78, 288)

$fontBody = New-Object System.Drawing.Font('Segoe UI', 22)
$lines = 'Rürup § 10 EStG  ·  Sparerpauschbetrag § 20 EStG' + [Environment]::NewLine + 'Fünftelregelung § 34 EStG  ·  VV-GmbH § 8b KStG'
$g.DrawString($lines, $fontBody, $muted, 80, 366)

$fontNote = New-Object System.Drawing.Font('Segoe UI', 18)
$g.DrawString('Keine Provision. Keine Beratung. Nur Rechnungen und Paragraphen.', $fontNote, $muted, 80, 486)

$fontBrand = New-Object System.Drawing.Font('Segoe UI', 22, [System.Drawing.FontStyle]::Bold)
$g.DrawString('kontolage.de', $fontBrand, $gold, 80, 546)

$g.Dispose()
$bmp.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

$info = Get-Item $target
Write-Output ("OG-Bild erzeugt: " + $info.FullName + " (" + $info.Length + " Bytes)")
