# Legt den Stripe-Webhook fuer die Supabase-Function an, setzt das Signing-Secret und prueft die Signatur-Pipeline.
param([ValidateSet('test', 'live')][string]$Mode = 'test')
$ErrorActionPreference = 'Stop'
$projectRef = 'tberfzrzfkwoytgqlpij'
$webhookUrl = "https://$projectRef.supabase.co/functions/v1/stripe-webhook"
$root = Split-Path -Parent $PSScriptRoot
$candidates = @((Join-Path $root '.env'), (Join-Path $root '.env.production.local'))
$tmpDir = Join-Path $PSScriptRoot 'tmp'
if (-not (Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir | Out-Null }
$envName = if ($Mode -eq 'test') { 'STRIPE_TEST_SECRET_KEY' } else { 'STRIPE_SECRET_KEY' }
$key = ''
foreach ($file in $candidates) {
  if (-not (Test-Path $file)) { continue }
  $line = Get-Content $file | Where-Object { $_ -match "^$envName=" } | Select-Object -First 1
  if ($line) {
    $key = ($line -replace "^$envName=", '' -replace '"', '' -replace '\\r', '' -replace '\\n', '').Trim()
    if ($key) { break }
  }
}
if (-not $key) { throw "$envName nicht gefunden" }
Write-Output "Modus: $Mode | Key-Prefix: $($key.Substring(0, [Math]::Min(8, $key.Length)))"

function Stripe-Call {
  param([string]$Method, [string]$Path, [hashtable]$Fields = @{})
  $args = @('-s', '-X', $Method, "https://api.stripe.com/v1$Path", '-u', "$key`:")
  foreach ($name in $Fields.Keys) { $args += @('--data-urlencode', "$name=$($Fields[$name])") }
  $raw = & curl.exe @args
  return $raw | ConvertFrom-Json
}

$events = @(
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed'
)

Write-Output "=== Bestehende Webhooks pruefen (Ziel: $webhookUrl) ==="
$existing = Stripe-Call -Method GET -Path '/webhook_endpoints?limit=100'
if ($existing.error) { throw ("Stripe-API-Fehler: " + $existing.error.message) }
$match = $existing.data | Where-Object { $_.url -eq $webhookUrl -and $_.status -eq 'enabled' } | Select-Object -First 1
$secret = ''
if ($match) {
  Write-Output "Vorhanden: $($match.id) -> $($match.url)"
  if ($env:STRIPE_WEBHOOK_SECRET_MANUAL) { $secret = $env:STRIPE_WEBHOOK_SECRET_MANUAL.Trim() }
  else { Write-Output 'Signing-Secret kann von Stripe nicht erneut gelesen werden - ueberspringe Secret-Update.' }
} else {
  Write-Output 'Kein passender Webhook gefunden - lege neuen Endpoint an...'
  $fields = @{ url = $webhookUrl; description = 'Kontolage Supabase Billing' }
  for ($i = 0; $i -lt $events.Count; $i++) { $fields["enabled_events[$i]"] = $events[$i] }
  $created = Stripe-Call -Method POST -Path '/webhook_endpoints' -Fields $fields
  if ($created.error) { throw ("Anlegen fehlgeschlagen: " + $created.error.message) }
  Write-Output "Angelegt: $($created.id) -> $($created.url) status=$($created.status)"
  if (-not $created.secret) { throw 'Stripe hat kein Signing-Secret geliefert.' }
  $secret = $created.secret
}

if ($secret) {
  Write-Output 'Setze STRIPE_WEBHOOK_SECRET in Supabase...'
  $ErrorActionPreference = 'Continue'
  & supabase secrets set "STRIPE_WEBHOOK_SECRET=$secret" --project-ref $projectRef 2>$null | Select-String -Pattern 'Finished|Error|error' | ForEach-Object { Write-Output ($_.ToString()) }
  $ErrorActionPreference = 'Stop'
}

Write-Output ''
Write-Output '=== Signatur-Pipeline testen (echter HMAC, vollstaendig lokal berechnet) ==='
if (-not $secret) {
  Write-Output 'Uebersprungen: Secret nicht verfuegbar (manuell per STRIPE_WEBHOOK_SECRET_MANUAL setzbar).'
  return
}
$eventId = 'evt_diag_' + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$payload = '{"id":"' + $eventId + '","type":"kontolage.diagnostic","data":{"object":{}}}'
$payloadFile = Join-Path $tmpDir 'webhook-probe.json'
[System.IO.File]::WriteAllText($payloadFile, $payload, (New-Object System.Text.UTF8Encoding($false)))
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
$signature = (($hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes("$timestamp.$payload"))) | ForEach-Object { $_.ToString('x2') }) -join ''
$probe = & curl.exe -s -w '<<HTTP:%{http_code}>>' -X POST $webhookUrl -H 'content-type: application/json' -H "stripe-signature: t=$timestamp,v1=$signature" --data-binary "@$payloadFile"
Write-Output "Antwort: $probe"
Write-Output 'Webhook-Setup abgeschlossen.'
