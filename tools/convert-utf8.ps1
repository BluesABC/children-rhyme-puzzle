$ErrorActionPreference = 'Stop'

$root = 'e:\c_project\c++核心编程\children-rhyme-puzzle'
$files = @(
  'app.json',
  'project.config.json',
  'pages\index\index.wxml',
  'pages\index\index.json',
  'pages\game\game.wxml',
  'pages\game\game.json',
  'pages\select\select.wxml',
  'pages\select\select.json'
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$gbk = [System.Text.Encoding]::GetEncoding(936)

function Get-EncodingNameFromBom([byte[]]$bytes) {
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) { return 'UTF-8-BOM' }
  if ($bytes.Length -ge 2 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE) { return 'UTF-16-LE' }
  if ($bytes.Length -ge 2 -and $bytes[0] -eq 0xFE -and $bytes[1] -eq 0xFF) { return 'UTF-16-BE' }
  return $null
}

foreach ($rel in $files) {
  $path = Join-Path $root $rel
  if (-not (Test-Path -LiteralPath $path)) {
    Write-Host "missing: $rel" -ForegroundColor Yellow
    continue
  }

  $bytes = [System.IO.File]::ReadAllBytes($path)
  $bom = Get-EncodingNameFromBom $bytes

  $text = $null
  $source = $null

  if ($bom -eq 'UTF-8-BOM') {
    $text = [System.Text.Encoding]::UTF8.GetString($bytes, 3, $bytes.Length - 3)
    $source = 'UTF-8-BOM'
  } elseif ($bom -eq 'UTF-16-LE') {
    $text = [System.Text.Encoding]::Unicode.GetString($bytes, 2, $bytes.Length - 2)
    $source = 'UTF-16-LE'
  } elseif ($bom -eq 'UTF-16-BE') {
    $text = [System.Text.Encoding]::BigEndianUnicode.GetString($bytes, 2, $bytes.Length - 2)
    $source = 'UTF-16-BE'
  } else {
    # 没 BOM：优先按 GBK(936) 读取（你的乱码现象最符合这一类）
    $text = $gbk.GetString($bytes)
    $source = 'GBK(936)/No-BOM'
  }

  [System.IO.File]::WriteAllText($path, $text, $utf8NoBom)
  Write-Host "converted: $rel (from $source -> UTF-8 no BOM)" -ForegroundColor Green
}
