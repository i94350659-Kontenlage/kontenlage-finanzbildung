-- Kontolage: production-safe auth and billing hardening.
create table if not exists public.rate_limit_buckets (
  key text primary key,
  window_started_at timestamptz not null default now(),
  hits integer not null default 1
);
alter table public.rate_limit_buckets enable row level security;

create or replace function public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare allowed boolean;
begin
  if p_key is null or p_limit < 1 or p_window_seconds < 1 then return false; end if;
  insert into public.rate_limit_buckets(key, window_started_at, hits)
  values (p_key, now(), 1)
  on conflict (key) do update set
    hits = case when rate_limit_buckets.window_started_at < now() - (p_window_seconds * interval '1 second') then 1 else rate_limit_buckets.hits + 1 end,
    window_started_at = case when rate_limit_buckets.window_started_at < now() - (p_window_seconds * interval '1 second') then now() else rate_limit_buckets.window_started_at end
  returning hits <= p_limit into allowed;
  return coalesce(allowed, false);
end;
$$;
revoke all on function public.consume_rate_limit(text, integer, integer) from public;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

alter table public.stripe_events add column if not exists status text not null default 'processed';
alter table public.stripe_events add column if not exists attempts integer not null default 1;
alter table public.stripe_events add column if not exists last_error text;
alter table public.stripe_events add column if not exists updated_at timestamptz not null default now();
create index if not exists stripe_events_status_idx on public.stripe_events(status, updated_at);
create index if not exists subscriptions_customer_idx on public.subscriptions(stripe_customer_id);
create index if not exists subscriptions_subscription_idx on public.subscriptions(stripe_subscription_id);

create or replace function public.claim_stripe_event(p_event_id text, p_event_type text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare inserted_rows integer; reclaimed boolean;
begin
  insert into public.stripe_events(event_id, event_type, status, attempts, updated_at)
  values (p_event_id, p_event_type, 'processing', 1, now())
  on conflict (event_id) do nothing;
  get diagnostics inserted_rows = row_count;
  if inserted_rows = 1 then return true; end if;
  update public.stripe_events
     set status = 'processing', attempts = attempts + 1, updated_at = now(), last_error = null
   where event_id = p_event_id
     and (status = 'failed' or (status = 'processing' and updated_at < now() - interval '10 minutes'));
  reclaimed := found;
  return reclaimed;
end;
$$;
revoke all on function public.claim_stripe_event(text, text) from public;
grant execute on function public.claim_stripe_event(text, text) to service_role;

create or replace function public.handle_auth_user_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, email) values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;
drop trigger if exists on_auth_user_changed on auth.users;
create trigger on_auth_user_changed
  after insert or update of email on auth.users
  for each row execute function public.handle_auth_user_change();

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own on public.subscriptions
  for select using (auth.uid() = user_id);
drop policy if exists audit_select_own on public.audit_log;
create policy audit_select_own on public.audit_log
  for select using (auth.uid() = user_id);
