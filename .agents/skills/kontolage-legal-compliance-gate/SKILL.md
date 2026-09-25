---
name: kontolage-legal-compliance-gate
description: Fail-closed Freigabe-Gate für alles, was die Kaufstrecke berührt. Prüft AGB, Widerrufsbelehrung, Kündigungsbutton (§ 312k BGB), Button-Lösung (§ 312j BGB), Endpreise inkl. MwSt. (PAngV), Impressumspflichten (§ 5 DDG) und Datenschutz-Angaben. Ohne grünes Gate keine Preissichtbarkeit.
---

# Kontolage Legal Compliance Gate

## Zweck

Dieses Gate entscheidet nicht, ob ein Preis „gut" ist. Es entscheidet ausschließlich: Darf diese Kaufstrecke in dieser Form veröffentlicht werden? Es ist die Absicherung der Tickets P0-03, P0-04 und P0-05 und arbeitet fail-closed.

## Trigger

- vor der ersten Freischaltung von Preisen oder Checkout
- nach jeder Änderung an `/abo`, AGB, Widerruf, Impressum, Datenschutz oder an den Checkout-Parametern
- vor jedem Deploy, der Preisdarstellung oder Kauf-CTA betrifft

## Ablauf

1. **Strukturprüfung:** Routen `/agb`, `/widerruf`, `/datenschutz`, `/impressum` erreichbar und im Footer verlinkt; Kündigungsbutton ohne Login erreichbar.
2. **Vertragstexte:** AGB enthalten Regelungen zu Laufzeit, Kündigung, Preisen, digitalen Inhalten, Haftung; Widerrufsbelehrung enthält Belehrung, Folgen, Ausschlussgründe und Muster-Widerrufsformular.
3. **Button-Lösung:** CTA benennt Zahlungspflicht und Endpreis („Zahlungspflichtig bestellen – 9,00 €/Monat inkl. 19 % MwSt."); AGB/Widerruf sind vor dem Kaufabschluss verlinkt und der Nutzer bestätigt die Kenntnisnahme.
4. **Preisdarstellung:** alle Preise als Bruttoendpreise inkl. MwSt. mit Zeitraum; keine Lockpreise; keine „ab"-Angaben ohne Erklärung.
5. **Kündigung:** Anbieter-Kündigung mindestens so einfach wie der Abschluss; Bestätigungs-E-Mail mit Datum, Laufzeitende und Widerrufsmöglichkeit.
6. **Impressum:** vollständige Anbieterkennzeichnung ohne Platzhalter, verantwortliche Person für Inhalte benannt.
7. **Datenschutz:** Empfänger (Supabase, Stripe, Vercel), Rechtsgrundlagen, Speicherdauer, Widerrufs-/Auskunftsrechte, korrekte Beschreibung der genutzten Speichertechniken (u. a. `localStorage`).
8. **Zahlungsfluss:** korrekte Steuerbehandlung aktiv (Stripe Tax mit Registrierung DE), Rechnung enthält Pflichtangaben.

## Checks

| Prüfung | Blocker bei Verstoß |
|---|---|
| AGB oder Widerruf fehlt/ nicht verlinkt | ja |
| kein Kündigungsbutton oder Kündigung nur mit Login | ja |
| CTA ohne Zahlungspflicht-/Preisangabe | ja |
| Preis ohne MwSt.-Ausweis für Verbraucher | ja |
| Impressum mit Platzhaltern | ja |
| Datenschutz nennt Verarbeiter nicht | ja |
| Steuer nicht korrekt aktiv | ja |
| Formulierungen, die wie Beratung wirken („Sie sollten kaufen") | ja |
| Preisänderung bei aktiven Abos ohne Mitteilung | Warnung mit Eskalation |

## Ausgabeformat

```json
{
  "decision": "publish | block",
  "reason_codes": ["missing_widerruf", "no_cancellation_button"],
  "compliance_class": "A–F",
  "confidence_score": 0.0,
  "affected_parameters": ["pricing_display", "checkout_params"],
  "generated_at": "ISO-8601"
}
```

## Fail-Closed

- Fehlt ein Pflichtelement, ist die Kaufstrecke gesperrt: keine Preissichtbarkeit, kein Checkout-CTA, kein Deploy.
- Es gibt keine Ausnahme „für den Test" — Tests laufen mit deaktivierter Preisdarstellung oder im geschützten Preview.
- Dieses Gate darf sich nicht selbst bestätigen (Anwendung, die das Gate ausführt, ist nie die Instanz, die freigibt).
- Juristische Freigabe bleibt eine menschliche Entscheidung; das Gate prüft nur Vollständigkeit und Konsistenz.
