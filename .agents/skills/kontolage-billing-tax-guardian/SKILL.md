---
name: kontolage-billing-tax-guardian
description: Überwacht und sichert den Geldfluss von Kontolage: Stripe Tax und Umsatzsteuerausweis, Preis-IDs, Webhook-Signatur und -Gesundheit, Abo-Status-Konsistenz, Rechnungsdaten sowie Secret-Hygiene im Bundle. Fail-closed bei Steuer-, Signatur- oder Secret-Verstößen.
---

# Kontolage Billing & Tax Guardian

## Zweck

Diese Fähigkeit stellt sicher, dass jede Zahlung steuerlich korrekt, technisch nachvollziehbar und ohne Sicherheitsleck abläuft. Sie sichert die Tickets P0-05, P0-07, P1-09 und P1-10 ab.

## Trigger

- vor jeder Aktivierung oder Änderung von Preisen
- nach jeder Änderung an Checkout-, Portal- oder Webhook-Code
- wöchentlich im Governance-Lauf (SOP-011)
- bei Auffälligkeiten in `stripe_events`

## Ablauf

1. **Steuer:** Stripe Tax aktiv, Registrierung für Deutschland vorhanden, Rechnungsprofil gepflegt; Secret `STRIPE_AUTOMATIC_TAX=true`; Testrechnung weist Umsatzsteuer aus.
2. **Preise:** jeder Tarif mappt auf genau eine erlaubte Preis-ID (`STRIPE_PRICE_STARTER|PRO|EXECUTIVE`); keine Preis-ID im Frontend, keine Beträge im Code doppelt gepflegt.
3. **Checkout:** `locale=de`, Zahlungsarten Karte und SEPA, `tax_id_collection` für B2B, Adresserfassung verpflichtend, Erfolgs-/Abbruch-URLs auf die eigene Domain.
4. **Webhook:** Endpoint erreichbar, Signaturprüfung aktiv (unsignierter POST ⇒ 400), Idempotenz über `claim_stripe_event`, alle relevanten Events abonniert (`checkout.session.completed`, `customer.subscription.*`, `invoice.paid`, `invoice.payment_failed`).
5. **Status-Konsistenz:** jede aktive Subscription hat `stripe_customer_id`, `stripe_subscription_id` und einen gültigen Status; kein Abo bleibt länger als 24 Stunden auf `pending`.
6. **Secret-Hygiene:** Bundle und Repository auf Muster `sk_live_`, `sk_test_`, `whsec_`, `service_role`, `eyJ` prüfen; Secret-Namen gegen die Soll-Liste abgleichen.
7. **Kundenkommunikation:** Rechnung, Zahlungsbestätigung, Kündigungsbestätigung und Zahlungsfehler-Nachricht müssen ankommen (Ticket P1-09).

## Checks

| Prüfung | Verstoß |
|---|---|
| Steuer inaktiv oder USt. nicht ausgewiesen | Fehler — Preissichtbarkeit sperren |
| Webhook ohne Signaturprüfung oder Signaturfehler | Fehler — sofort eskalieren |
| Preis-ID unbekannt oder doppelt gepflegt | Fehler |
| Abo dauerhaft `pending` nach Checkout | Fehler nach 24 h |
| Secret-Muster in Bundle/Repo/Log | Fehler — Rotation starten |
| Zahlungsfehler-Mail fehlt | Warnung mit Ticket |
| doppelte Events verändern Status erneut | Fehler |

## Ausgabeformat

```json
{
  "decision": "publish | block",
  "confidence_score": 0.0,
  "decision_reason": "…",
  "affected_parameters": ["stripe_tax", "webhook_health", "price_mapping"],
  "stripe_tax_enabled": false,
  "webhook_healthy": false,
  "failed_events": 0,
  "generated_at": "ISO-8601"
}
```

## Fail-Closed

- Steuer nicht korrekt ⇒ Preissichtbarkeit und Checkout-CTA deaktivieren.
- Webhook-Signaturproblem oder Secret-Fund ⇒ sofortiger Stopp, Betreiber informieren, Rotation nach SOP-006.
- Keine manuellen Statusänderungen an Abos — Status entsteht ausschließlich aus Stripe-Events.
