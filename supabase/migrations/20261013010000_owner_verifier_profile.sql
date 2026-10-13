-- PawMatch: let a dog owner add a vet / breeder profile to the same account.
--
-- Supabase allows one login per email, so an owner who is also a veterinarian or
-- breeder keeps their account and gets a verifiers row next to their owners row.
-- The profile starts unapproved and goes through the admin review queue
-- (verifiers_notify_admins fires on the insert). Verifying one's own dogs is
-- already blocked by verifier_submissions_before_insert.

create or replace function public.add_verifier_profile(p_verifier_role text, p_clinic text, p_license_number text)
returns public.verifiers
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v public.verifiers;
begin
  select * into v_user from public.users where id = auth.uid();
  if not found then
    raise exception 'Not signed in';
  end if;
  if exists (select 1 from public.verifiers where user_id = v_user.id) then
    raise exception 'This account already has a vet or breeder profile';
  end if;
  if length(trim(coalesce(p_clinic, ''))) < 2 then
    raise exception 'Enter your clinic or kennel';
  end if;
  if length(trim(coalesce(p_license_number, ''))) < 3 then
    raise exception 'Enter your PRC license or certification number';
  end if;

  insert into public.verifiers (user_id, name, role, clinic, license_number)
  values (
    v_user.id,
    v_user.full_name,
    case when p_verifier_role = 'Certified Breeder' then 'Certified Breeder' else 'Licensed Veterinarian' end,
    trim(p_clinic),
    trim(p_license_number)
  )
  returning * into v;

  return v;
end;
$$;

grant execute on function public.add_verifier_profile(text, text, text) to authenticated;
