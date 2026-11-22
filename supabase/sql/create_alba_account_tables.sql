-- Alba: account data linked to Supabase Auth. Applied through the hosted MCP.
-- Catalog content and anonymous browser preferences remain unchanged.
begin;

create schema alba_private;
revoke all on schema alba_private from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default ''
    constraint profiles_display_name_length check (char_length(display_name) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  saved_topics text[] not null default '{}'::text[]
    constraint user_preferences_saved_topics_valid check (
      saved_topics <@ array['estudo', 'criatividade', 'bem-estar']::text[]
      and cardinality(saved_topics) <= 3
      and array_position(saved_topics, null) is null
    ),
  -- NULL means not configured; an empty array is an explicit empty selection.
  routine_moments text[] default null
    constraint user_preferences_routine_moments_valid check (
      routine_moments is null or (
        routine_moments <@ array['provas-tcc', 'portfolio', 'idiomas-codigo', 'ritmo-foco']::text[]
        and cardinality(routine_moments) <= 4
        and array_position(routine_moments, null) is null
      )
    ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  service_id text not null
    constraint user_favorites_service_id_valid check (
      char_length(service_id) between 1 and 80
      and service_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),
  created_at timestamptz not null default now(),
  primary key (user_id, service_id)
);

comment on table public.profiles is 'Private account profile. Email and credentials stay in managed Supabase Auth.';
comment on table public.user_preferences is 'Account preference storage prepared for future opt-in synchronization. Browser data is not imported automatically.';
comment on table public.user_favorites is 'Unique service bookmarks per account. Service IDs refer to the versioned catalog; frontend sync is not enabled yet.';

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_favorites enable row level security;

revoke all on table public.profiles, public.user_preferences, public.user_favorites from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select on table public.profiles, public.user_preferences, public.user_favorites to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant update (saved_topics, routine_moments) on public.user_preferences to authenticated;
grant insert (user_id, service_id), delete on public.user_favorites to authenticated;
grant select, insert, update, delete on table public.profiles, public.user_preferences, public.user_favorites to service_role;

create policy profiles_select_own on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles
  for update to authenticated using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy user_preferences_select_own on public.user_preferences
  for select to authenticated using ((select auth.uid()) = user_id);
create policy user_preferences_update_own on public.user_preferences
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy user_favorites_select_own on public.user_favorites
  for select to authenticated using ((select auth.uid()) = user_id);
create policy user_favorites_insert_own on public.user_favorites
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy user_favorites_delete_own on public.user_favorites
  for delete to authenticated using ((select auth.uid()) = user_id);

create function alba_private.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function alba_private.touch_updated_at() from public, anon, authenticated;

create trigger profiles_touch_updated_at before update on public.profiles
  for each row execute function alba_private.touch_updated_at();
create trigger user_preferences_touch_updated_at before update on public.user_preferences
  for each row execute function alba_private.touch_updated_at();

-- This definer function is private and only bootstraps a row from an Auth
-- INSERT trigger, before a user JWT exists. It is not a client-facing RPC.
create function alba_private.bootstrap_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  initial_name text := '';
begin
  if tg_table_schema <> 'auth' or tg_table_name <> 'users' or tg_op <> 'INSERT' then
    raise exception 'Invalid account bootstrap trigger context';
  end if;
  if jsonb_typeof(new.raw_user_meta_data -> 'display_name') = 'string' then
    initial_name := left(btrim(new.raw_user_meta_data ->> 'display_name'), 80);
  end if;
  insert into public.profiles (id, display_name) values (new.id, initial_name)
    on conflict (id) do nothing;
  insert into public.user_preferences (user_id) values (new.id)
    on conflict (user_id) do nothing;
  return new;
end;
$$;
revoke all on function alba_private.bootstrap_auth_user() from public, anon, authenticated, service_role;
grant usage on schema alba_private to supabase_auth_admin;
grant execute on function alba_private.bootstrap_auth_user() to supabase_auth_admin;

create trigger on_auth_user_created_alba after insert on auth.users
  for each row execute function alba_private.bootstrap_auth_user();

-- Backfill only missing application rows, without modifying Auth or existing names.
insert into public.profiles (id, display_name)
select id, case when jsonb_typeof(raw_user_meta_data -> 'display_name') = 'string'
  then left(btrim(raw_user_meta_data ->> 'display_name'), 80) else '' end
from auth.users on conflict (id) do nothing;
insert into public.user_preferences (user_id)
select id from auth.users on conflict (user_id) do nothing;

commit;
