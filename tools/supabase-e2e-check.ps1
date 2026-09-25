# Kontolage E2E-Diagnose (curl-basiert): Auth-Settings, CORS/Origin, account- und Checkout-Function mit echtem Testnutzer.
$ErrorActionPreference = 'Stop'
$projectRef = 'tberfzrzfkwoytgqlpij'
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root '.env.production.local'
$tmpDir = Join-Path $PSScriptRoot 'tmp'
if (-not (Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir | Out-Null }

$vars = @{}
foreach ($line in Get-Content $envFile) {
  if ($line -match '^([A-Za-z0-9_]+)=(.*)$') {
    $vars[$Matches[1]] = ($Matches[2].Trim().Trim('"') -replace '\\r', '' -replace '\\n', '').Trim()
  }
}
$url = $vars['VITE_SUPABASE_URL']
$anon = $vars['VITE_SUPABASE_ANON_KEY']
if (-not $url -or -not $anon) { throw 'VITE_SUPABASE_URL/ANON_KEY fehlen in .env.production.local' }

$ErrorActionPreference = 'Continue'
$keysJson = supabase projects api-keys --project-ref $projectRef -o json 2>$null | Out-String
$ErrorActionPreference = 'Stop'
$keys = $keysJson | ConvertFrom-Json
$service = ($keys | Where-Object { $_.name -eq 'service_role' } | Select-Object -First 1).api_key
if (-not $service) { throw 'service_role key konnte nicht gelesen werden' }

function Invoke-Api {
  param([string]$Method, [string]$Uri, [hashtable]$Headers = @{}, [string]$Json = $null)
  $outFile = Join-Path $tmpDir ([Guid]::NewGuid().ToString('N') + '.json')
  $args = @('-s', '-X', $Method, $Uri, '-o', $outFile, '-w', '%{http_code}')
  foreach ($key in $Headers.Keys) { $args += @('-H', "$key`: $($Headers[$key])") }
  if ($Json) {
    $bodyFile = Join-Path $tmpDir ([Guid]::NewGuid().ToString('N') + '.body')
    [System.IO.File]::WriteAllText($bodyFile, $Json, (New-Object System.Text.UTF8Encoding($false)))
    $args += @('-H', 'Content-Type: application/json', '--data-binary', "@$bodyFile")
  }
  $status = & curl.exe @args
  $body = if (Test-Path $outFile) { (Get-Content $outFile -Raw) } else { '' }
  if (Test-Path $outFile) { Remove-Item $outFile -Force }
  return [pscustomobject]@{ Status = [int]$status; Body = $body }
}

function Show-Result {
  param([string]$Label, $Result)
  Write-Output "--- $Label ---"
  Write-Output ("STATUS: " + $Result.Status)
  Write-Output ("BODY: " + $Result.Body)
}

Write-Output '=== 1) Auth Settings (public) ==='
(Invoke-Api -Method GET -Uri "$url/auth/v1/settings" -Headers @{ apikey = $anon }).Body

Write-Output ''
Write-Output '=== 2) Preflight www.kontolage.de (Browser-Verhalten) ==='
foreach ($fn in @('account', 'create-checkout-session')) {
  $r = Invoke-Api -Method OPTIONS -Uri "$url/functions/v1/$fn" -Headers @{
    Origin = 'https://www.kontolage.de'; 'Access-Control-Request-Method' = 'POST'
  }
  Write-Output "$fn -> STATUS $($r.Status)"
}

Write-Output ''
Write-Output '=== 3) Testnutzer anlegen (email_confirm=true) ==='
$email = "diagnose-" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() + "@kontolage.de"
$password = "Diagnose" + [Guid]::NewGuid().ToString('N').Substring(0, 14) + "9x"
$create = Invoke-Api -Method POST -Uri "$url/auth/v1/admin/users" -Headers @{ apikey = $service; Authorization = "Bearer $service" } -Json (@{ email = $email; password = $password; email_confirm = $true } | ConvertTo-Json)
Show-Result 'admin create user' $create
$userId = ($create.Body | ConvertFrom-Json).id

Write-Output ''
Write-Output '=== 4) Login (password grant) ==='
$login = Invoke-Api -Method POST -Uri "$url/auth/v1/token?grant_type=password" -Headers @{ apikey = $anon } -Json (@{ email = $email; password = $password } | ConvertTo-Json)
$token = ($login.Body | ConvertFrom-Json).access_token
Write-Output ("STATUS: " + $login.Status + " token_length=" + ($token | Measure-Object -Character).Characters)

Write-Output ''
Write-Output '=== 5) GET account (Origin kontolage.de) ==='
Show-Result 'account' (Invoke-Api -Method GET -Uri "$url/functions/v1/account" -Headers @{ apikey = $anon; Authorization = "Bearer $token"; Origin = 'https://kontolage.de' })

Write-Output ''
Write-Output '=== 5b) GET account (Origin www.kontolage.de) ==='
Show-Result 'account www' (Invoke-Api -Method GET -Uri "$url/functions/v1/account" -Headers @{ apikey = $anon; Authorization = "Bearer $token"; Origin = 'https://www.kontolage.de' })

Write-Output ''
Write-Output '=== 6) POST create-checkout-session plan=starter ==='
Show-Result 'checkout' (Invoke-Api -Method POST -Uri "$url/functions/v1/create-checkout-session" -Headers @{ apikey = $anon; Authorization = "Bearer $token"; Origin = 'https://kontolage.de' } -Json (@{ plan = 'starter' } | ConvertTo-Json))

Write-Output ''
Write-Output '=== 7) DB-Zeilen des Testnutzers (service role) ==='
foreach ($table in @('profiles', 'subscriptions')) {
  $filter = if ($table -eq 'profiles') { "id=eq.$userId" } else { "user_id=eq.$userId" }
  Show-Result $table (Invoke-Api -Method GET -Uri "$url/rest/v1/$table`?select=*&$filter" -Headers @{ apikey = $service; Authorization = "Bearer $service" })
}

Write-Output ''
Write-Output '=== 8) Aufraeumen: Testnutzer loeschen ==='
$del = Invoke-Api -Method DELETE -Uri "$url/auth/v1/admin/users/$userId" -Headers @{ apikey = $service; Authorization = "Bearer $service" }
Write-Output ("delete STATUS: " + $del.Status)
