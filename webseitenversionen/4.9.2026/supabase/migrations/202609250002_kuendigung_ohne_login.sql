-- Kündigung ohne Login (Button-Lösung § 312k Abs. 1 BGB).
-- Der Kunde muss die Kündigung "in Textform" gegenüber dem Anbieter erklären
-- können. Ein login-geschützter Kündigungsbutton genügt dem nicht zwingend,
-- weil das Passwort zum Kaufzeitpunkt nicht vorhanden sein muss (Gast-Checkout,
-- abgelaufenes Passwort, Mail-only-Konto).
--
-- Deshalb: öffentliches Formular nimmt die beim Checkout verwendete E-Mail
-- entgegen, bestätigt die Zustellung an diese Adresse und widerruft die
-- Fortsetzung zum Periodenende. Der Kunde bleibt Inhaber des Abos; es wird
-- nichts gelöscht, nur nicht verlängert.

create table if not exists public.cancellation_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  user_id uuid references auth.users(id) on delete set null,
  stripe_subscription_id text,
  requested_plan text,
  status text not null default 'received',
  channel text not null default 'web_form',
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists cancellation_requests_email_idx
  on public.cancellation_requests (lower(email));
create index if not exists cancellation_requests_created_idx
  on public.cancellation_requests (created_at desc);

alter table public.cancellation_requests enable row level security;

-- Kein öffentlicher Zugriff: weder anon noch authenticated lesen oder schreiben.
-- Nur service_role (Edge Function) arbeitet mit dieser Tabelle.

comment on table public.cancellation_requests is
  'Nachweise der Kündigungen nach § 312k Abs. 1 BGB. Zugriff ausschließlich über service_role.';
comment on column public.cancellation_requests.status is
  'received = eingegangen, confirmed = an E-Mail bestaetigt, applied = in Stripe umgesetzt, rejected = kein Abo oder Fehler.';

-- Marktwert: Bestandsschutz. Ein Kunde darf nicht unbeabsichtigt gekündigt werden,
-- nur weil jemand seine E-Mail-Adresse kennt. Deshalb erfolgt die Umsetzung in
-- Stripe erst nach Rückmeldung aus dem von uns versendeten Bestätigungsmail.
