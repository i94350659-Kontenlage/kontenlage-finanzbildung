-- Kontolage Ausgaben (Newsletter) — Tarif-Stufen, Abo-Ausgaben.
--
-- Sicherheitsmodell: Der Text einer bezahlten Ausgabe darf NICHT im öffentlichen
-- Bundle bzw. im prerenderten HTML liegen. Deshalb liegen alle Ausgaben in dieser
-- Tabelle; freie Ausgaben werden zusätzlich (redundant, für SEO/Prerender) in
-- content/newsletter.json gepflegt. Die Auslieferung gesperrter Ausgaben
-- erfolgt ausschließlich über die Edge Function "newsletter" nach Tarifprüfung.
--
-- Grundlage: src/pages/Abo.tsx (planKey) und src/pages/Account.tsx (catalog).
create table if not exists public.newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  teaser text not null,
  body jsonb not null default '[]'::jsonb,
  tier text not null default 'free' check (tier in ('free', 'pro', 'executive')),
  category text,
  as_of date not null,
  published_on date not null,
  sources jsonb not null default '[]'::jsonb,
  rechner_href text,
  read_time text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_issues_published_idx
  on public.newsletter_issues (published_on desc)
  where status = 'published';

-- Rangfolge der Tarife. 'free' ist für alle lesbar, danach steigt der Anspruch.
create or replace function public.newsletter_tier_rank(tier text)
returns integer
language sql
immutable
as $$
  select case tier
    when 'free' then 0
    when 'pro' then 1
    when 'executive' then 2
    else 0
  end;
$$;

-- Aktiver Tarif des angemeldeten Nutzers; '' wenn kein bezahltes Abo besteht.
-- Läuft als SECURITY DEFINER, weil RLS auf subscriptions sonst rekursiv würde.
create or replace function public.newsletter_active_plan()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select s.plan
      from public.subscriptions s
      where s.user_id = auth.uid()
        and s.plan is not null
        and s.status in ('active', 'trialing', 'canceling', 'past_due')
      limit 1
    ),
    ''
  );
$$;

revoke all on function public.newsletter_active_plan() from public;
grant execute on function public.newsletter_active_plan() to authenticated, anon;

alter table public.newsletter_issues enable row level security;

-- Leserechte: veröffentlicht UND (frei ODER Tarif des Nutzers deckt die Stufe ab).
create policy "newsletter_read_eligible"
  on public.newsletter_issues
  for select
  using (
    status = 'published'
    and public.newsletter_tier_rank(tier) <= public.newsletter_tier_rank(public.newsletter_active_plan())
  );

-- Schreiben bleibt der Service-Edge-Function vorbehalten (service_role umgeht RLS).
-- Explizit keine insert/update/delete-Policy für angemeldete Nutzer.
