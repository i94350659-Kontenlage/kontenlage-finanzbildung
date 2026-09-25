# Prueft, ob Supabase Bestaetigungslinks fuer alle Kontolage-Origins erzeugt (Redirect-Allowlist).
$ErrorActionPreference = 'Stop'
$projectRef = 'tberfzrzfkwoytgqlpij'
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root '.env.production.local'
$tmpDir = Join-Path $PSScriptRoot 'tmp'
if (-not (Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir | Out-Null }

$vars = @{}
foreach ($line in Get-Content $envFile) {
  if ($line -match '^([A-Za-z0-9_]+)=(.*)$') { $vars[$Matches[1]] = ($Matches[2].Trim().Trim('"') -replace '\\r', '' -replace '\\n', '').Trim() }
}
$url = $vars['VITE_SUPABASE_URL']

$ErrorActionPreference = 'Continue'
$keysJson = supabase projects api-keys --project-ref $projectRef -o json 2>$null | Out-String
$ErrorActionPreference = 'Stop'
$svc = (($keysJson | ConvertFrom-Json) | Where-Object { $_.name -eq 'service_role' } | Select-Object -First 1).api_key
if (-not $svc) { throw 'service_role key konnte nicht gelesen werden' }

$email = "redirect-check-" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() + "@kontolage.de"
$password = "Redirect" + [Guid]::NewGuid().ToString('N').Substring(0, 12) + "7z"
$origins = @('https://kontolage.de', 'https://www.kontolage.de', 'https://kontolage-finanzbildung-4npcutb88-kolbaska2009-9272s-projects.vercel.app', 'http://localhost:5173')

foreach ($origin in $origins) {
  $bodyFile = Join-Path $tmpDir 'generate-link.json'
  $payload = @{ type = 'signup'; email = $email; password = $password; redirect_to = "$origin/konto" } | ConvertTo-Json
  [System.IO.File]::WriteAllText($bodyFile, $payload, (New-Object System.Text.UTF8Encoding($false)))
  $raw = & curl.exe -s -X POST "$url/auth/v1/admin/generate_link" -H "apikey: $svc" -H "Authorization: Bearer $svc" -H 'content-type: application/json' --data-binary "@$bodyFile"
  try {
    $parsed = $raw | ConvertFrom-Json
    if ($parsed.error -or $parsed.error_code) {
      $message = $parsed.error_description
      if (-not $message) { $message = $parsed.msg }
      if (-not $message) { $message = $parsed.error }
      Write-Output "$origin -> FEHLER: $message"
    } else {
      Write-Output "$origin -> OK, redirect_to=$($parsed.redirect_to)"
    }
  } catch {
    Write-Output "$origin -> Unlesbare Antwort: $raw"
  }
}

Write-Output ''
Write-Output '=== Testnutzer aufraeumen ==='
$userId = ((& curl.exe -s "$url/rest/v1/profiles?select=id&email=eq.$email" -H "apikey: $svc" -H "Authorization: Bearer $svc") | ConvertFrom-Json | Select-Object -First 1).id
if ($userId) {
  & curl.exe -s -o $null -w "delete status: %{http_code}" -X DELETE "$url/auth/v1/admin/users/$userId" -H "apikey: $svc" -H "Authorization: Bearer $svc"
  Write-Output ''
} else {
  Write-Output 'Kein Testnutzer angelegt.'
}
