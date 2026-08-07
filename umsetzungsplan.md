# Umsetzungsplan: Finanzbildungs-Plattform (Abo + später Tippgeber)

Geschäftsmodell in einem Satz: Eine Abo-Plattform mit allgemeinen, nicht-personalisierten Finanzbildungsinhalten und Rechnern, finanziert über Abonnements — ohne Erlaubnispflicht, weil keine persönliche Empfehlung stattfindet.

Rechtlicher Grundsatz, der den ganzen Plan durchzieht: **generisch = einfach, personalisiert + Provision = reguliert.** Alles, was unten als "Phase 1" markiert ist, brauchst du keine Finanzdienstleistungserlaubnis für. Alles unter "Phase 2 (später)" braucht Verträge und ggf. Lizenzen — deshalb wird nur Phase 1 jetzt deployt.

---

## Phase 1 — Rechtlich einfach, JETZT umsetzbar

### 1.1 Gewerbe anmelden
- Zuständig: Gewerbeamt deiner Stadt/Gemeinde (meist online möglich)
- Tätigkeitsbeschreibung möglichst genau formulieren, z. B.: "Betrieb einer Online-Plattform für allgemeine Finanzbildung und redaktionelle Inhalte; Verkauf von Abonnements; **keine** Anlageberatung, keine Anlagevermittlung, keine Versicherungsvermittlung"
- Diese präzise Formulierung schützt dich doppelt: dem Gewerbeamt ist sofort klar, dass du keine 34f/34d-Erlaubnis brauchst, und du selbst hast schriftlich dokumentiert, wo deine Grenze liegt
- Kosten: ca. 20–60 € je nach Kommune
- Danach automatisch: Finanzamt meldet sich wegen steuerlicher Erfassung (Fragebogen zur steuerlichen Erfassung, online über ELSTER möglich)

### 1.2 Content-Leitplanken festlegen (schriftlich für dich selbst)
Damit du nie versehentlich in Richtung Anlageberatung rutschst:
- Alle Rechner zeigen **Szenarien**, nie "für dich am besten": "Bei 3.000 € brutto ergibt sich rechnerisch folgendes Bild" statt "Du solltest..."
- Keine konkreten Produktnamen/Anbieter mit Kaufaufforderung ("Schließe X ab")
- Immer sichtbarer Disclaimer: "Allgemeine Informationen, keine Anlage-, Steuer- oder Rechtsberatung"
- Quellen transparent machen (Gesetzestexte, offizielle Stellen)

### 1.3 Content produzieren (Startbestand vor Launch)
Ziel: 8–12 Artikel/Erklärstücke vor dem Start, damit die Plattform nicht leer wirkt. Themenvorschläge:
1. Sparerpauschbetrag einfach erklärt
2. Rürup-Rente: für wen lohnt sie sich rechnerisch
3. bAV: Gehaltsumwandlung Schritt für Schritt
4. Haushaltsnahe Dienstleistungen richtig absetzen
5. ETF-Sparplan und Steuern: Vorabpauschale erklärt
6. Steuerklassen-Grundlagen
7. Freibeträge im Überblick (Jahresrückblick, jährlich aktualisieren!)
8. Häufige Irrtümer bei "Steuersparimmobilien" (dein ursprüngliches Thema — gutes SEO-Thema)

### 1.4 Technik aufsetzen (siehe gelieferte Website)
- Landingpage mit Rechner-Demo, Content-Teaser, Newsletter-Anmeldung, Abo-Bereich — liegt bereits als `index.html` bei
- Hosting: z. B. Netlify, Vercel oder GitHub Pages (kostenlos für den Start, keine eigene Serververwaltung nötig)
- Domain registrieren (~10 €/Jahr)
- Newsletter-Tool anbinden (z. B. Brevo oder Mailchimp — beide haben kostenlose Startpläne, DSGVO-konform mit Double-Opt-In einstellen)
- Zahlungsanbieter für Abos: Stripe Checkout (Stripe-Account kostenlos anlegen, Gebühr nur pro Transaktion) — Platzhalter im Code ist vorbereitet, du musst nur deinen Stripe Public Key und eine Price-ID eintragen
- Impressum + Datenschutzerklärung erstellen (Pflicht in Deutschland ab dem ersten Tag online — Generator z. B. über die IHK oder e-recht24, danach von einem Anwalt kurz gegenchecken lassen)

### 1.5 Launch-Checkliste
- [ ] Gewerbe angemeldet
- [ ] Impressum & Datenschutzerklärung online
- [ ] 8+ Artikel veröffentlicht
- [ ] Newsletter-Anmeldung funktioniert (Double-Opt-In getestet)
- [ ] Stripe-Abo getestet (Testkarte durchklicken)
- [ ] Rechner-Ergebnisse noch mal auf "klingt das nach Empfehlung?" geprüft

---

## Phase 2 — Später, NICHT jetzt deployen (braucht Verträge/ggf. Lizenz)

Diese Bausteine bringen mehr Umsatz, aber jeder einzelne braucht vorher ein unterschriebenes Dokument oder eine Prüfung — deshalb bewusst NICHT im aktuellen Website-Scaffold enthalten:

- **Tippgeber-Kooperationen**: Erst Vertrag mit der Bank/dem Versicherer unterschreiben (schriftliche Abgrenzung: keine Beratung, keine Abschlussvermittlung, nur Kontaktweitergabe mit Einwilligung), dann erst den Link/Button auf der Website freischalten
- **Affiliate-Links zu Vergleichsportalen**: rechtlich unkritischer als Tippgeber, aber trotzdem erst Partnerprogramm anmelden (z. B. bei Check24/Verivox), dann einbauen
- **Eigene 34f/34d-Erlaubnis**: nur nötig, falls du selbst konkrete, personalisierte Produktempfehlungen geben willst — separates Projekt, eigene Zeitschiene, siehe Ressourcenliste

Faustregel für dich: Sobald neuer Umsatzbaustein dazukommt, erst die Frage stellen "Berate oder vermittle ich hier gerade?" — wenn ja, erst Vertrag/Lizenz, dann Code.

---

## Ressourcen (kostenlos, offiziell)

- Gewerbeanmeldung & Businessplan: https://www.existenzgruendungsportal.de
- Businessplan-Software kostenlos: https://gruenderplattform.de/businessplan
- Gesetzestext GewO (§34f/34d): https://www.gesetze-im-internet.de/gewo/
- Tippgeber-Abgrenzung im Detail: https://zacherlegal.de/wp-content/uploads/2021/09/Der-Tippgeber.pdf
- Verbraucher-Infoblatt Finanzanlagenvermittlung: https://www.ihk-muenchen.de/ihk/documents/Gewerbeerlaubnisse-Internet/Finanzanlagenvermittler/merkblatt_34fh_verbraucher.pdf

## Letzter Hinweis

Ich bin kein Anwalt. Die Content-Leitplanken und die "generisch statt personalisiert"-Regel sind eine solide, gut belegte Faustregel, aber vor dem Live-Gang lohnt sich eine einmalige, günstige Prüfung deines Impressums, deiner AGB und deiner Rechner-Formulierungen durch einen Anwalt für IT-/Kapitalmarktrecht — danach läuft der Rest wie oben beschrieben ohne laufende Regulierungslast.
