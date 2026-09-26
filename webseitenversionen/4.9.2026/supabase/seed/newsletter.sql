-- Seed fuer die gesperrten Kontolage-Ausgaben (tier pro / executive).
--
-- Diese Texte stehen bewusst NICHT im Repository: gesperrte Ausgaben duerfen nicht
-- im JS-Bundle oder im prerenderten HTML liegen. Deshalb liegen sie ausschliesslich
-- in dieser Datei und werden direkt in der Datenbank eingetragen.
--
-- Anwendung:  supabase db execute --file supabase/seed/newsletter.sql
-- oder ueber den SQL-Editor des Projekts tberfzrzfkwoytgqlpij.
--
-- Freie Ausgaben werden NICHT hier eingetragen, sondern in content/newsletter.json
-- (siehe .agents/skills/kontolage-newsletter-editor).

insert into public.newsletter_issues
  (slug, title, teaser, body, tier, category, as_of, published_on, sources, rechner_href, read_time, status)
values
  (
    'pro-ruecklage-in-zeiten-der-kapitalmarktflucht',
    'Pro-Ausgabe: Liquiditätsreserve nach Branchenschwankungen',
    'Wie viel Rücklage trägt ein Unternehmen, wenn Umsatz und Marktpreis gleichzeitig einbrechen — mit Rechenweg statt Faustregel.',
    '[{"heading":"Warum eine Jahreszahl als Rücklage zu wenig ist","body":"Eine Reserve, die sich am Vorjahresumsatz orientiert, bildet einen Brancheneinbruch nicht ab: Der Umsatz bricht zuerst ein, der Personalabbau folgt mit Verzögerung. Der Liquiditätsbedarf entsteht in diesem Zeitfenster, nicht im laufenden Jahr."},{"heading":"Drei Monatszahlen statt einer Jahreszahl","body":"Die übliche Empfehlung lautet, drei Monatsumsätze Liquidität zu halten. In Branchen mit stark saisonaler Nachfrage reicht das in Umsatzspitzen nicht, weil Personal- und Lagerkosten vor der Umsatzrealisierung fällig werden. Rechenweg: Fixkosten je Monat aus dem Vorjahr zuzüglich Deckungsbeitrag der Spitzenmonate."},{"heading":"Was das für die Besteuerung bedeutet","body":"Eine Rücklage, die tatsächlich dem Geschäftsrisiko dient, ist Betriebsausgabe. Voraussetzung ist die ernsthafte Prüfung im Einzelfall; § 6 EStG beziehungsweise die Vorgaben der handels- und steuerrechtlichen Vorschriften müssen eingehalten werden. Eine nicht erforderliche Rücklage erhöht den zu versteuernden Gewinn."}]'::jsonb,
    'pro',
    'Unternehmen',
    '2026-09-25',
    '2026-09-25',
    '[{"label":"Einkommensteuergesetz (EStG) § 6 Aufwendungen","url":"https://www.gesetze-im-internet.de/estg/","jurisdiction":"DE","asOf":"2026-09-25"},{"label":"Handelsgesetzbuch (HGB) § 255 Aufstellung","url":"https://www.gesetze-im-internet.de/hgb/","jurisdiction":"DE","asOf":"2026-09-25"}]'::jsonb,
    '/holding',
    '6 Min.',
    'published'
  ),
  (
    'executive-gesellschaftsstruktur-im-internationalen-vergleich',
    'Executive-Ausgabe: Gesellschaftsstruktur im internationalen Vergleich',
    'GmbH, Aktiengesellschaft und Zweigniederlassung gegen die jeweiligen Strukturen in Nachbarstaaten — Kosten, Steuereffekt und Verwaltungsaufwand nebeneinander.',
    '[{"heading":"Entscheidungskriterien vor der Strukturfahrt","body":"Vor jeder grenzüberschreitenden Struktur stehen drei Größen: die Ausschüttung im Betriebsvermögen, die spätere Verwertung und die laufenden Verwaltungskosten. Eine Struktur, die nur einen dieser drei Punkte verbessert, taugt nicht."},{"heading":"Kosten der laufenden Struktur","body":"Jede zusätzliche Gesellschaft verursacht Fixkosten für Register, Buchhaltung und Abschlüsse. Diese laufen unabhängig vom Gewerbeergebnis und sind deshalb vor der Strukturentscheidung zu beziffern, nicht hinterher."},{"heading":"Vermischung von betrieblichen und privaten Anteilen","body":"Wer Betriebsvermögen privat verwertet oder privates Vermögen in die Gesellschaft einbringt, löst steuerliche Folgen aus, die häufig den Strukturvorteil übersteigen. Die Trennung muss dokumentiert und im Voraus bewertet sein."}]'::jsonb,
    'executive',
    'Unternehmen',
    '2026-09-25',
    '2026-09-25',
    '[{"label":"Einkommensteuergesetz (EStG) §§ 4, 6, 17","url":"https://www.gesetze-im-internet.de/estg/","jurisdiction":"DE","asOf":"2026-09-25"},{"label":"Körperschaftsteuergesetz (KStG) § 8b","url":"https://www.gesetze-im-internet.de/kstg/","jurisdiction":"DE","asOf":"2026-09-25"}]'::jsonb,
    '/holding',
    '7 Min.',
    'published'
  )
on conflict (slug) do update set
  title = excluded.title,
  teaser = excluded.teaser,
  body = excluded.body,
  tier = excluded.tier,
  category = excluded.category,
  as_of = excluded.as_of,
  published_on = excluded.published_on,
  sources = excluded.sources,
  rechner_href = excluded.rechner_href,
  read_time = excluded.read_time,
  status = excluded.status,
  updated_at = now();
