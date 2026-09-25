-- Kontolage · P2-01 · Rechner-Szenarien im Konto speichern
--
-- Zweck: Rechner-Eingaben und Ergebnisse als benannte Szenarien speichern, damit
-- Nutzer Varianten vergleichen und später fortsetzen können. Bewusst schmal
-- gehalten: ein Szenario pro Zeile, Eingaben als JSONB, keine personenbezogenen
-- Freitexte im Klartext außer dem selbst gewählten Szenarionamen.
--
-- Sicherheit: RLS ist für jede Rolle aktiv; Lesen/Ersetzen/Löschen nur für den
-- eigenen Nutzer (auth.uid()). Einfügen läuft über die Standard-Policy
-- (WITH CHECK auth.uid() = user_id). Kein Zugriff für anon/service_role-Bypass
-- durch Nutzer, da ausschließlich der Client mit dem JWT des Nutzers spricht.
--
-- Spaltenrechte: authenticated darf nur name und updated_at aktualisieren
-- (siehe 202609250004_saved_scenarios_rename.sql). calculator, inputs, results,
-- user_id und created_at bleiben unveränderlich, damit ein manipulierter Client
-- keine Szenarien einem anderen Rechner oder Nutzer zuordnen kann.

create table if not exists public.saved_scenarios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  calculator text not null check (calculator in ('rurup', 'sparerpauschbetrag', 'immobilien', 'depot')),
  name text not null check (char_length(name) between 1 and 60),
  inputs jsonb not null default '{}'::jsonb,
  results jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_scenarios_user_idx
  on public.saved_scenarios (user_id, updated_at desc);

alter table public.saved_scenarios enable row level security;

drop policy if exists "saved_scenarios_select_own" on public.saved_scenarios;
create policy "saved_scenarios_select_own"
  on public.saved_scenarios for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "saved_scenarios_insert_own" on public.saved_scenarios;
create policy "saved_scenarios_insert_own"
  on public.saved_scenarios for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Vollständiges Ersetzen (upsert per id) nur in der eigenen Zeile.
drop policy if exists "saved_scenarios_update_own" on public.saved_scenarios;
create policy "saved_scenarios_update_own"
  on public.saved_scenarios for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "saved_scenarios_delete_own" on public.saved_scenarios;
create policy "saved_scenarios_delete_own"
  on public.saved_scenarios for delete
  to authenticated
  using (auth.uid() = user_id);

-- updated_at ohne Trigger-Pflicht: der Client setzt die Zeit beim Upsert selbst.
-- Bewusst kein Trigger, damit diese Migration ohne zusätzliche Trigger-Logik
-- auskommt und die Zeitbasis clientseitig kontrollierbar bleibt.
