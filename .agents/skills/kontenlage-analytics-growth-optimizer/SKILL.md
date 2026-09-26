---
name: kontenlage-analytics-growth-optimizer
description: Überwacht und interpretiert Vercel Web Analytics & Speed Insights, erkennt Abbruchraten bei Rechnern, optimiert Conversion-Rates (CRO) für Pro (9 €) & Executive (29 €) Abos und schlägt datenbasierte A/B-Tests vor.
---

# Kontolage Analytics & Growth Optimizer

## 1. Datenquellen (100% DSGVO-konform ohne Cookies)
- **Vercel Web Analytics**: Seitenaufrufe, Top-Einstiegsseiten, Geolocation (DACH), Verweildauer.
- **Vercel Speed Insights**: Ladezeiten, LCP, INP pro Gerätetyp.
- **Local Interaction Events**: Rechner-Nutzungsfrequenz, Klicks auf „Excel-Vorlagen Download“, Modal-Öffnungen.

## 2. Wachstums- & Conversion-Hebel
1. **Drop-Off Analyse**: Verlassen Nutzer den Rechner vor dem Ergebnis? -> Eingabefelder reduzieren (Standardwerte vorbesetzen).
2. **Pro-Abo Conversion**: Nutzer stoßen an das 3-Berechnungen-Limit im Free-Modell -> Attraktives 9 € Pro-Upgrade-Modal mit Schieberegler-Vorschau.
3. **Executive B2B Conversion**: Nutzer klicken auf Holding/VV-GmbH -> Prominenter Hinweis auf die downloadbaren Excel-Kalkulationstabellen (29 €).

## Betriebsblock (Hermes-Konvention)

- **Zweck**: Messbare Wachstums-Hebel aus Vercel Analytics/Speed Insights ableiten, ohne Cookies und ohne Personenbezug.
- **Trigger**: Wochen-Review (H-04) oder wenn eine Kennzahl 2 Perioden in Folge gegen das Vorziel läuft.
- **Ablauf**: 1) Signale erheben (Seitenaufrufe, Einstiegsseiten, LCP/INP, Rechner-Nutzung) 2) Abweichung gegen Vorziel quantifizieren 3) genau **einen** Hebel priorisieren 4) Experiment mit Hypothese, Messgröße und Abbruchschwelle formulieren 5) Ergebnis ins Wochen-Experiment-Register eintragen.
- **Check**: Jede Empfehlung nennt eine Messgröße und eine Schwelle; keine Aussage ohne Datenstand; keine Nutzer-ID, kein Cookie, kein Fingerprinting.
- **Ausgabe**: Befund-Tabelle (Kennzahl, Ist, Ziel, Abweichung) plus ein priorisiertes Experiment-Objekt mit `hypothesis`, `metric`, `success_criteria`, `stop_condition`, `review_date`.
- **Fail-Verhalten**: Bei fehlender Datengrundlage (Analytics nicht aktiv, Stichprobe zu klein, Zeitraum < 7 Tage) **keine** Hypothese bilden, sondern die Lücke benennen und Messung nachholen. Niemals Korrelation als Ursache ausgeben.
- **Ticket-Kopplung**: P2-06 (Analytics-Anbindung), P2-03 (Funnel-Messung Newsletter), H-04 (Wochen-Experiment).
