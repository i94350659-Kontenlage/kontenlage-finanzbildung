import { LegalHero, LegalSection, LegalClause, LegalParagraph, ReviewNotice, LegalFooterNote } from "../components/Legal";

export default function Widerruf() {
  return (
    <>
      <LegalHero
        eyebrow="Rechtliches"
        title="Widerrufsbelehrung"
        intro="Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen (Grundlage: §§ 355, 356 BGB, Art. 9 Abs. 2 lit. a der Richtlinie (EU) 2022/1228)."
      />

      <LegalSection>
        <LegalClause heading="§ 1 Widerrufsfrist">
          <LegalParagraph>
            Die Widerrufsfrist beträgt 14 Tage ab dem Tag des Vertragsschlusses (§ 355 Abs. 1 BGB). Zur Wahrung der
            Frist genügt es, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist
            absenden.
          </LegalParagraph>
          <LegalParagraph>
            Bei einem Vertrag über die Lieferung von nicht an ein physisches Medium gebundenen digitalen Inhalten, die
            nicht im Voraus ausdrücklich als vor dem Widerrufsbeginn vertraglich zugesichert wurden, erlischt das
            Widerrufsrecht nach § 356 Abs. 5 BGB, sobald der Anbieter die Leistung vollzogen hat. Kontolage beginnt mit
            der Freischaltung des Zugangs nicht vor Ihrer ausdrücklichen Zustimmung.
          </LegalParagraph>
        </LegalClause>

        <LegalClause heading="§ 2 Ausübung des Widerrufsrechts">
          <LegalParagraph>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie dem Anbieter mittels einer eindeutigen Erklärung (zum Beispiel per
            Brief, E-Mail oder über den Kündigungsbutton im Kontobereich) Ihren Entschluss, diesen Vertrag zu widerrufen,
            mitteilen.
          </LegalParagraph>
          <LegalParagraph>
            Sie können hierfür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
            Zur Wahrung der Frist ist es ausreichend, dass Sie die Widerrufserklärung vor Ablauf der Widerrufsfrist
            absenden.
          </LegalParagraph>
        </LegalClause>

        <LegalClause heading="§ 3 Muster-Widerrufsformular">
          <LegalParagraph>
            Wenn Sie den Vertrag widerrufen wollen, füllen Sie dieses Formular aus und senden Sie es zurück:
          </LegalParagraph>
          <div
            style={{
              margin: "16px 0 24px",
              padding: "20px 22px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
            }}
          >
            <p style={{ fontSize: 13, color: "#cdc6be", lineHeight: 1.9, margin: "0 0 8px", fontWeight: 600 }}>
              An Kontolage, [Firma], [Anschrift]
            </p>
            <p style={{ fontSize: 13, color: "#a89f94", lineHeight: 1.9, margin: 0 }}>
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Nutzung des
              Abonnements „[Tarif]“.
              <br />
              Name: ____________________
              <br />
              Anschrift: ____________________
              <br />
              E-Mail: ____________________
              <br />
              Datum, Unterschrift: ____________________
            </p>
            <p style={{ fontSize: 12, color: "#7d766d", lineHeight: 1.7, margin: "12px 0 0" }}>
              (*) Unzutreffendes streichen.
            </p>
          </div>
        </LegalClause>

        <LegalClause heading="§ 4 Folgen des Widerrufs">
          <LegalParagraph>
            Bei einem wirksamen Widerruf erstatten wir alle erhaltenen Zahlungen unverzüglich, spätestens binnen 14 Tagen
            ab dem Tag, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. In der Praxis
            wird die Rückzahlung über den Zahlungsdienstleister des Abbuchungswegs abgewickelt.
          </LegalParagraph>
          <LegalParagraph>
            Für diese Rückzahlung verwenden wir nach Möglichkeit dasselbe Zahlungsmittel, mit dem Sie die ursprüngliche
            Zahlung geleistet haben. Es entstehen Ihnen wegen dieser Rückzahlung keine zusätzlichen Gebühren.
          </LegalParagraph>
        </LegalClause>

        <LegalClause heading="§ 5 Kündigung nach Ablauf der Widerrufsfrist">
          <LegalParagraph>
            Nach Ende der Widerrufsfrist berechtigt der Vertrag weiterhin zur Kündigung mit Wirkung zum Ende der jeweils
            aktuellen Laufzeit. Die Kündigung bedarf der Textform und ist im Kontobereich oder per E-Mail an
            service@kontolage.de möglich. Näheres regelt § 4 der Allgemeinen Geschäftsbedingungen.
          </LegalParagraph>
        </LegalClause>

        <ReviewNotice text="Diese Arbeitsfassung muss vor dem ersten echten Zahlungsvorgang juristisch geprüft und freigegeben werden. Vor Livegang zu ersetzen sind: vollständige Firma und Anschrift des Betreibers, die Bestätigungs-E-Mail-Frist nach § 312k BGB sowie die Frage, ob und wie eine Umsatzsteuer auf Erstattungen anfällt." />
        <LegalFooterNote updated="25.09.2026" />
      </LegalSection>
    </>
  );
}
