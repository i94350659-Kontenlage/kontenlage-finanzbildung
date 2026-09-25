import { LegalHero, LegalSection, LegalClause, LegalParagraph, ReviewNotice, LegalFooterNote } from "../components/Legal";

export default function Agb() {
  return (
    <>
      <LegalHero
        eyebrow="Rechtliches"
        title="Allgemeine Geschäftsbedingungen"
        intro="Regeln für die Nutzung von Kontolage und den Abschluss kostenpflichtiger Abonnements (Grundlage: §§ 305 ff. BGB, § 312k BGB)."
      />

      <LegalSection>
        <LegalClause heading="§ 1 Geltungsbereich und Vertragsschluss">
          <LegalParagraph>
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über die Nutzung des Online-Angebots
            kontolage.de (nachfolgend „Angebot“) gegenüber Verbrauchern und Unternehmern im Sinne des § 13 BGB.
          </LegalParagraph>
          <LegalParagraph>
            Der Vertrag über ein kostenpflichtiges Abonnement kommt durch die Bestellung im Checkout und der
            erfolgreichen Zahlungsbestätigung zustande. Maßgeblich ist der im Checkout ausgewiesene Tarif. Die
            zahlungspflichtige Handlung wird ausdrücklich und eindeutig gekennzeichnet (§ 312j BGB).
          </LegalParagraph>
          <LegalParagraph>
            Die Nutzung des kostenlosen Basisbereichs setzt keine Zahlung voraus und begründet kein Abonnement. Es
            findet keine automatische Umwandlung in ein kostenpflichtiges Angebot statt.
          </LegalParagraph>
        </LegalClause>

        <LegalClause heading="§ 2 Leistungen">
          <LegalParagraph>
            Das Angebot umfasst den Zugang zu Steuer-Rechnern, Fachartikeln und — je nach gebuchtem Tarif — weiteren
            Inhalten im geschützten Bereich „Kabinett“.
          </LegalParagraph>
          <LegalParagraph>
            Alle Berechnungen und Inhalte dienen der allgemeinen Information und Finanzbildung. Sie stellen keine
            Anlageberatung, Steuerberatung oder sonstige Finanzdienstleistung im Sinne des § 2 Abs. 8 WpHG dar.
          </LegalParagraph>
          <LegalParagraph>
            Inhalte werden mit der jeweils aktuellen Rechtslage erstellt. Für das Vertragsverhältnis ist die zum
            Zeitpunkt der Nutzung veröffentlichte Fassung maßgeblich; eine Korrektur früherer Inhalte bleibt vorbehalten.
          </LegalParagraph>
        </LegalClause>

        <LegalClause heading="§ 3 Preise und Zahlung">
          <LegalParagraph>
            Es gelten die im Checkout ausgewiesenen Endpreise. Preise sind Endpreise und enthalten die gesetzliche
            Umsatzsteuer, soweit der Anbieter umsatzsteuerpflichtig ist.
          </LegalParagraph>
          <LegalParagraph>
            Alle Preisangaben auf dieser Website sind Endpreise. Bei kostenpflichtigen Abonnements wird die
            Umsatzsteuer über Stripe Tax berechnet und auf der Rechnung ausgewiesen.
          </LegalParagraph>
          <LegalParagraph>
            Die Zahlung erfolgt über den Dienstleister Stripe. Zahlungsmittel, Laufzeit und Preiserhöhungen ergeben
            sich aus der jeweiligen Tarifbeschreibung.
          </LegalParagraph>
        </LegalClause>

        <LegalClause heading="§ 4 Laufzeit, Verlängerung und Kündigung">
          <LegalParagraph>
            Abonnements haben eine Laufzeit von einem Monat und verlängern sich automatisch um jeweils einen weiteren
            Monat, sofern nicht fristgerecht gekündigt wird (§ 313 BGB). Eine Mindestlaufzeit besteht nicht.
          </LegalParagraph>
          <LegalParagraph>
            Eine Kündigung ist jederzeit mit Wirkung zum Ende der aktuellen Laufzeit möglich. Maßgeblich ist der Zugang
            der Kündigung beim Anbieter. Der Eingang wird unverzüglich in Textform bestätigt (§ 312k Abs. 2 BGB).
          </LegalParagraph>
          <LegalParagraph>
            Der Kündigungsbutton und die Kontaktmöglichkeit zur Kündigung finden Sie in Ihrem Kontobereich und auf der
            Abo-Seite. Nach wirksamer Kündigung endet der Zugang mit Ablauf der bezahlten Laufzeit; es erfolgt keine
            automatische Überführung in ein anderes Produkt.
          </LegalParagraph>
        </LegalClause>

        <LegalClause heading="§ 5 Nutzungsrechte und Pflichten">
          <LegalParagraph>
            Sie erhalten ein einfaches, zeitlich auf die Laufzeit begrenztes, nicht übertragbares Recht zur Nutzung des
            gebuchten Angebots für private beziehungsweise berufliche Zwecke.
          </LegalParagraph>
          <LegalParagraph>
            Eine Weitergabe, Vervielfältigung, öffentliche Bereitstellung oder automatisierte Auslesung der Inhalte —
            insbesondere durch Scraper, KI-Trainingsdaten oder Datenbanken — ist ohne vorherige schriftliche Zustimmung
            nicht gestattet.
          </LegalParagraph>
          <LegalParagraph>
            Sie sind für die Sicherheit Ihrer Zugangsdaten verantwortlich und dürfen diese nicht an Dritte weitergeben.
          </LegalParagraph>
        </LegalClause>

        <LegalClause heading="§ 6 Gewährleistung und Haftung">
          <LegalParagraph>
            Es gilt das gesetzliche Mängelhaftungsrecht. Für die Richtigkeit der Inhalte wird keine Gewähr übernommen,
            soweit dem Anbieter kein Fahrlässigkeitsvorwurf trifft.
          </LegalParagraph>
          <LegalParagraph>
            Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen. Die Haftung für Verletzung von Leben, Körper
            oder Gesundheit sowie für grob fahrlässig begangene Pflichtverletzungen bleibt unberührt.
          </LegalParagraph>
        </LegalClause>

        <LegalClause heading="§ 7 Schlussbestimmungen">
          <LegalParagraph>
            Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Ist der Kunde Verbraucher, gilt der
            Gerichtsstandsvorbehalt nicht, soweit er entgegen § 38 ZPO unzulässig ist.
          </LegalParagraph>
          <LegalParagraph>
            Sollte eine Bestimmung unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
          </LegalParagraph>
        </LegalClause>

        <ReviewNotice text="Diese Arbeitsfassung muss vor dem ersten echten Zahlungsvorgang von einer Rechtsanwältin oder einem Rechtsanwalt geprüft und freigegeben werden. Offen sind insbesondere Betreiberangaben (Firma, Register, USt-IdNr.) und die Frage der Umsatzsteuerpflicht nach § 19 UStG." />
        <LegalFooterNote updated="25.09.2026" />
      </LegalSection>
    </>
  );
}
