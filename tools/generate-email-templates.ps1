# Erzeugt die weiteren Kontolage-E-Mail-Vorlagen aus confirmation.html (einheitliches Branding).
$ErrorActionPreference = 'Stop'
$tpl = Join-Path (Split-Path -Parent $PSScriptRoot) 'webseitenversionen\4.9.2026\supabase\templates'
$src = Get-Content (Join-Path $tpl 'confirmation.html') -Raw -Encoding UTF8

function New-Variant {
  param(
    [string]$Name,
    [string]$Title,
    [string]$Preheader,
    [string]$Heading,
    [string]$IntroHtml,
    [string]$ButtonLabel = '',
    [string]$NoteHtml = '',
    [switch]$NoLink
  )
  $html = $src
  $html = [regex]::Replace($html, '<title>.*?</title>', "<title>$Title</title>", 'Singleline')
  $html = [regex]::Replace($html, '(?s)<div style="display:none;.*?</div>', "<div style=`"display:none;font-size:1px;color:#0B1220;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;`">$Preheader</div>")
  $html = [regex]::Replace($html, '(?s)(<h1 style="[^"]*">).*?(</h1>)', "`$1$Heading`$2")
  $html = [regex]::Replace($html, '(?s)(<p style="margin:0 0 18px 0;[^"]*">).*?(</p>)', "`$1$IntroHtml`$2")
  if ($NoLink) {
    $html = [regex]::Replace($html, '(?s)<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 22px 0;">.*?</table>', '')
    $html = [regex]::Replace($html, '(?s)<p style="margin:0 0 22px 0;[^"]*">.*?</p>', '')
  } elseif ($ButtonLabel) {
    $html = $html.Replace('Konto jetzt bestätigen', $ButtonLabel)
  }
  if ($NoteHtml) {
    $html = [regex]::Replace($html, '(?s)<strong style="color:#111827;">Hinweis:</strong>.*?</td>', "<strong style=`"color:#111827;`">Hinweis:</strong> $NoteHtml</td>")
  }
  $path = Join-Path $tpl $Name
  [System.IO.File]::WriteAllText($path, $html, (New-Object System.Text.UTF8Encoding($false)))
  Write-Output "created $Name"
}

New-Variant -Name 'recovery.html' `
  -Title 'Passwort zurücksetzen' `
  -Preheader 'Setzen Sie jetzt ein neues Passwort für Ihr Kontolage-Konto.' `
  -Heading 'Passwort zurücksetzen' `
  -IntroHtml 'Guten Tag,<br /> für Ihr Kontolage-Konto wurde ein neues Passwort angefordert. Über den folgenden Button vergeben Sie ein neues Passwort mit mindestens 12 Zeichen, Buchstaben und Zahlen.' `
  -ButtonLabel 'Neues Passwort vergeben' `
  -NoteHtml 'Der Link ist 60 Minuten gültig. Wenn Sie kein neues Passwort angefordert haben, ist Ihr Konto weiterhin sicher – ändern Sie in diesem Fall vorsorglich Ihr Passwort.'

New-Variant -Name 'magic_link.html' `
  -Title 'Anmeldelink' `
  -Preheader 'Ihr sicherer Anmeldelink für das Kontolage-Kabinett.' `
  -Heading 'Anmeldelink für Ihr Kabinett' `
  -IntroHtml 'Guten Tag,<br /> mit diesem Link melden Sie sich ohne Passwort in Ihrem Kontolage-Konto an. Der Link ist nur kurzzeitig und einmalig gültig.' `
  -ButtonLabel 'Jetzt anmelden' `
  -NoteHtml 'Sollten Sie keinen Anmeldelink angefordert haben, können Sie diese E-Mail ignorieren.'

New-Variant -Name 'email_change.html' `
  -Title 'Neue E-Mail-Adresse bestätigen' `
  -Preheader 'Bitte bestätigen Sie Ihre neue E-Mail-Adresse für Kontolage.' `
  -Heading 'Neue E-Mail-Adresse bestätigen' `
  -IntroHtml 'Guten Tag,<br /> für Ihr Kontolage-Konto wurde eine neue E-Mail-Adresse hinterlegt. Bitte bestätigen Sie diese Änderung, damit Sie sich weiterhin anmelden können.' `
  -ButtonLabel 'Neue Adresse bestätigen' `
  -NoteHtml 'Die Änderung wird erst nach Ihrer Bestätigung wirksam. Falls Sie die Änderung nicht angefordert haben, kontaktieren Sie uns bitte umgehend.'

New-Variant -Name 'invite.html' `
  -Title 'Ihr Zugang zum Kabinett' `
  -Preheader 'Ihr Zugang zum Kontolage-Kabinett ist vorbereitet.' `
  -Heading 'Willkommen im Kabinett' `
  -IntroHtml 'Guten Tag,<br /> für Sie wurde ein Zugang zum Kontolage-Kabinett angelegt. Über den folgenden Button aktivieren Sie Ihr Konto und vergeben dabei Ihr persönliches Passwort.' `
  -ButtonLabel 'Zugang aktivieren' `
  -NoteHtml 'Der Einladungslink ist zeitlich begrenzt gültig. Bei Fragen zur Einladung antworten Sie einfach auf diese E-Mail.'

New-Variant -Name 'password_changed.html' `
  -Title 'Ihr Passwort wurde geändert' `
  -Preheader 'Ihr Kontolage-Passwort wurde erfolgreich geändert.' `
  -Heading 'Passwort geändert' `
  -IntroHtml 'Guten Tag,<br /> das Passwort Ihres Kontolage-Kontos wurde soeben geändert. Sie können sich ab jetzt mit dem neuen Passwort anmelden.' `
  -NoteHtml 'Wenn Sie diese Änderung nicht vorgenommen haben, setzen Sie bitte umgehend über die Anmeldeseite ein neues Passwort zurück und kontaktieren Sie unseren Support.' `
  -NoLink
