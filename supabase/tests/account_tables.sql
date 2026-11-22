-- Run with an administrative connection. Fixtures are synthetic and rolled back.
-- This does not call Auth APIs, create identities, send email or issue tokens.
begin;

do $$
declare
  user_a uuid := gen_random_uuid();
  user_b uuid := gen_random_uuid();
  user_c uuid := gen_random_uuid();
begin
  perform set_config('alba.test_user_a', user_a::text, true);
  perform set_config('alba.test_user_b', user_b::text, true);
  perform set_config('alba.test_user_c', user_c::text, true);
  insert into auth.users (id, email, raw_user_meta_data, created_at, updated_at) values
    (user_a, 'alba-test-a-' || user_a::text || '@example.invalid',
      jsonb_build_object('display_name', 'Estudante A', 'role', 'admin'), now(), now()),
    (user_b, 'alba-test-b-' || user_b::text || '@example.invalid',
      jsonb_build_object('display_name', repeat('B', 120)), now(), now()),
    (user_c, 'alba-test-c-' || user_c::text || '@example.invalid',
      jsonb_build_object('display_name', jsonb_build_object('invalid', true)), now(), now());

  assert (select count(*) from public.profiles where id in (user_a, user_b, user_c)) = 3,
    'Signup trigger must create every profile';
  assert (select count(*) from public.user_preferences where user_id in (user_a, user_b, user_c)) = 3,
    'Signup trigger must create preference rows';
  assert (select display_name from public.profiles where id = user_a) = 'Estudante A';
  assert (select char_length(display_name) from public.profiles where id = user_b) = 80,
    'Long metadata must not break signup';
  assert (select display_name from public.profiles where id = user_c) = '',
    'Unexpected metadata type must not break signup';
  assert (select routine_moments is null from public.user_preferences where user_id = user_a),
    'Unconfigured routine differs from an explicit empty selection';
  insert into public.user_favorites (user_id, service_id) values (user_b, 'notion');
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', current_setting('alba.test_user_a'), true);
select set_config('request.jwt.claims', jsonb_build_object(
  'sub', current_setting('alba.test_user_a'), 'role', 'authenticated'
)::text, true);

do $$
declare
  user_a uuid := current_setting('alba.test_user_a')::uuid;
  user_b uuid := current_setting('alba.test_user_b')::uuid;
  affected integer;
begin
  assert auth.uid() = user_a;
  assert (select count(*) from public.profiles) = 1,
    'Client must only see its own profile, regardless of metadata role';
  assert (select count(*) from public.user_preferences) = 1;
  assert (select count(*) from public.user_favorites) = 0,
    'Another user favorite must not be visible';

  update public.profiles set display_name = 'Nome atualizado' where id = user_a;
  assert (select display_name from public.profiles where id = user_a) = 'Nome atualizado';
  update public.profiles set display_name = 'Forbidden' where id = user_b;
  get diagnostics affected = row_count;
  assert affected = 0, 'Cross-user profile update must affect no rows';

  update public.user_preferences set saved_topics = array['estudo'], routine_moments = '{}'::text[]
    where user_id = user_a;
  assert (select cardinality(routine_moments) = 0 from public.user_preferences where user_id = user_a);
  update public.user_preferences set saved_topics = array['criatividade'] where user_id = user_b;
  get diagnostics affected = row_count;
  assert affected = 0, 'Cross-user preference update must affect no rows';

  begin
    update public.profiles set id = user_b where id = user_a;
    raise exception 'Owner ID must not be writable';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.profiles set created_at = now() where id = user_a;
    raise exception 'Creation timestamp must not be writable';
  exception when insufficient_privilege then null;
  end;
  begin
    select count(*) into affected from auth.users;
    raise exception 'Managed Auth rows must not be exposed';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.user_preferences set saved_topics = array['not-a-topic'] where user_id = user_a;
    raise exception 'Unknown preference IDs must be rejected';
  exception when check_violation then null;
  end;

  insert into public.user_favorites (user_id, service_id) values (user_a, 'github');
  assert (select count(*) from public.user_favorites) = 1;
  begin
    insert into public.user_favorites (user_id, service_id) values (user_a, 'github');
    raise exception 'Duplicate favorites must be rejected';
  exception when unique_violation then null;
  end;
  begin
    insert into public.user_favorites (user_id, service_id) values (user_b, 'github');
    raise exception 'Cross-user favorite insert must be rejected';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.user_favorites (user_id, service_id) values (user_a, 'Invalid Slug');
    raise exception 'Invalid service slugs must be rejected';
  exception when check_violation then null;
  end;
  delete from public.user_favorites where user_id = user_b;
  get diagnostics affected = row_count;
  assert affected = 0, 'Cross-user favorite deletion must affect no rows';
  delete from public.user_favorites where user_id = user_a and service_id = 'github';
  assert (select count(*) from public.user_favorites) = 0;
end;
$$;

reset role;
set local role anon;
do $$
declare
  ignored integer;
begin
  begin
    select count(*) into ignored from public.profiles;
    raise exception 'Anonymous profiles access must be denied';
  exception when insufficient_privilege then null;
  end;
  begin
    select count(*) into ignored from public.user_preferences;
    raise exception 'Anonymous preferences access must be denied';
  exception when insufficient_privilege then null;
  end;
  begin
    select count(*) into ignored from public.user_favorites;
    raise exception 'Anonymous favorites access must be denied';
  exception when insufficient_privilege then null;
  end;
end;
$$;

reset role;
do $$
declare
  user_b uuid := current_setting('alba.test_user_b')::uuid;
begin
  delete from auth.users where id = user_b;
  assert not exists (select 1 from public.profiles where id = user_b);
  assert not exists (select 1 from public.user_preferences where user_id = user_b);
  assert not exists (select 1 from public.user_favorites where user_id = user_b);
  assert not has_function_privilege('authenticated', 'alba_private.bootstrap_auth_user()', 'EXECUTE');
  assert not has_function_privilege('anon', 'alba_private.bootstrap_auth_user()', 'EXECUTE');
  assert has_function_privilege('supabase_auth_admin', 'alba_private.bootstrap_auth_user()', 'EXECUTE');
end;
$$;

rollback;
select 'passed' as account_schema_assertions,
  (select count(*) from auth.users where email like 'alba-test-%@example.invalid') as synthetic_users_remaining;
