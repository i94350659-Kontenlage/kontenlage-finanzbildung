$ErrorActionPreference = 'Stop'
$wf = 'C:\Users\user\.cline\worktrees\27070\B2B steuer Business Ideee 6.8.2026\.github\workflows\hermes_cron.yml'
$content = Get-Content $wf -Raw

# Altes TOGETHER_API_KEY durch neues TOGETHERAI_API_KEY ersetzen
$content = $content -replace 'TOGETHER_API_KEY:\s*\$\{\{ secrets\.TOGETHER_API_KEY \}\}', 'TOGETHERAI_API_KEY: ${{ secrets.TOGETHERAI_API_KEY }}'
$content = $content -replace 'TOGETHER_MODEL:\s*\$\{\{ secrets\.TOGETHER_MODEL \}\}', 'TOGETHERAI_MODEL: ${{ secrets.TOGETHERAI_MODEL }}'

# Neue Secrets einfügen nach OPENROUTER_MODEL Zeile
$content = $content -replace '(OPENROUTER_MODEL:\s*\$\{\{ secrets\.OPENROUTER_MODEL \}\})', '$1`n          ORCAROUTER_API_KEY: ${{ secrets.ORCAROUTER_API_KEY }}`n          ORCAROUTER_MODEL: ${{ secrets.ORCAROUTER_MODEL }}`n          ZENMUXAI_API_KEY: ${{ secrets.ZENMUXAI_API_KEY }}`n          ZENMUXAI_MODEL: ${{ secrets.ZENMUXAI_MODEL }}'

# Version im Namen updaten
$content = $content -replace 'name: Hermes v2\.3', 'name: Hermes v2.4'

Set-Content $wf -Encoding UTF8 $content
Write-Output 'Workflow aktualisiert'

$runner = 'C:\Users\user\.cline\worktrees\27070\B2B steuer Business Ideee 6.8.2026\scripts\hermes_runner.js'
$rc = Get-Content $runner -Raw

# Version updaten
$rc = $rc -replace 'v2\.3', 'v2.4'

Set-Content $runner -Encoding UTF8 $rc
Write-Output 'Runner aktualisiert'