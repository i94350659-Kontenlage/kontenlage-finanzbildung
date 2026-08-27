# Kontenlage Hermes Skills v5.2

Vollständiges Übergabepaket. Enthält:

- `ANLEITUNG-FUER-KI.md` — **hier zuerst lesen.** Zweck, Prinzipien, Architektur, Build-Reihenfolge, rechtlicher Rahmen.
- `public/` — 8 Skills der öffentlichen Kontenlage-Pipeline (Research → Scoring → Content → Compliance → Publish → Red-Team).
- `private/` — 3 Skills des Private-Owner-Layers, strikt datentechnisch getrennt vom öffentlichen Pfad (Data Firewall).

## Änderungen gegenüber v5

1. Private Mode wird explizit **nicht** mehr als Regulierungs-Bypass beschrieben.
2. MAR-Prüfung ist zweistufig (Relevanz-Check vor Disclosure-Gate).
3. TTL/Decay ist zentral versioniert statt in jedem Skill hart codiert.
4. Evidence-Quorum ist fit-for-purpose statt starr "≥3 Quellen, 1× Tier 1".
5. Exit-Before-Entry als harte Regel im Private-Platform-Research-Skill.
6. Decision Journal als Pflichtfunktion in Private Investment Intelligence.
7. Regulatorischer Entity-Check (legal_entity → licensed_entity → regulator → scope) vor jeder Regulierungsaussage.
8. Data Firewall Private→Public explizit dokumentiert, inkl. Re-Verify-Pfad.
9. Red-Team-Skill um `privacy_boundary_test` erweitert.
10. **v5.2:** technische Zugriffskontrolle für den Private Layer präzisiert (Auth-Token statt reinem Prompt-Flag), DSGVO-Abschnitt (Rechtsgrundlage, Löschkonzept, Verschlüsselung) ergänzt, `producer`-Feld als verbindliche reale Identität statt Platzhalter, Audit-Log-Aufbewahrung und Kill-Switch-Eskalationsprozess ergänzt. Offene Betreiber-Entscheidungen sind in `ANLEITUNG-FUER-KI.md` §8 gesammelt.

## Rechtsgrundlagen

Die Skills sind technische Governance und keine Rechtsberatung. Für die konkrete Ausgestaltung sind insbesondere die jeweils geltenden WpHG/MiFID-II-Regeln, MAR-Regeln, delegierten Rechtsakte sowie ESMA-/BaFin-Leitlinien zu prüfen.

Vor dem Produktivgang eines personalisierten Profil-/Archetypen-Tools ist eine Prüfung des tatsächlichen User-Flows und der Outputs durch einen auf Kapitalmarktrecht spezialisierten Rechtsanwalt vorgesehen.
