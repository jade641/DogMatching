-- PawMatch: in-app review of veterinarian / breeder applications by administrators.
--
-- Admins are users with users.role = 'admin' (granted with `npm run admin:grant -- email`).
-- An application is pending while approved = false and reviewed_at is null,
-- and rejected while approved = false and reviewed_at is set.

alter table public.verifiers
  add column reviewed_at timestamptz,
  add column reviewed_by uuid references public.users (id) on delete set null,
  add column review_notes text;

alter table public.notifications drop constraint notifications_type_check;
alter table public.notifications add constraint notifications_type_check check (type in (
  'match_request', 'request_update', 'message', 'verification_request',
  'verification_result', 'review', 'match_alert', 'system',
  'verifier_application', 'verifier_review'
));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

-- Approval is granted for a specific license number; changing it sends the account
-- back to the queue, which is also how a rejected applicant re-submits.
create or replace function public.verifiers_before_update()
returns trigger
language plpgsql
as $$
begin
  if new.license_number is distinct from old.license_number and new.approved is not distinct from old.approved then
    new.approved := false;
    new.reviewed_at := null;
    new.reviewed_by := null;
    new.review_notes := null;
  end if;
  return new;
end;
$$;

create trigger verifiers_before_update
  before update on public.verifiers
  for each row execute function public.verifiers_before_update();

-- Tell every admin when an application arrives or is re-submitted.
create or replace function public.verifiers_notify_admins()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.approved or new.reviewed_at is not null then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.reviewed_at is null and not old.approved then
    return new;  -- already in the queue
  end if;

  perform public.notify(
    u.id,
    'verifier_application',
    case when tg_op = 'INSERT' then 'New ' else 'Updated ' end || lower(new.role) || ' application',
    new.name || coalesce(nullif(' · ' || new.clinic, ' · '), '') || ' is waiting for approval.',
    jsonb_build_object('verifier_id', new.id)
  )
  from public.users u
  where u.role = 'admin' and u.id <> new.user_id;
  return new;
end;
$$;

create trigger verifiers_notify_admins
  after insert or update on public.verifiers
  for each row execute function public.verifiers_notify_admins();

-- Applications with contact details, for the admin review screens.
create or replace function public.admin_list_verifiers()
returns table (
  id uuid,
  user_id uuid,
  name text,
  role text,
  clinic text,
  license_number text,
  approved boolean,
  reviewed_at timestamptz,
  review_notes text,
  reviewer_name text,
  created_at timestamptz,
  email text,
  phone text,
  location text,
  documents_reviewed bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only PawMatch administrators can view applications';
  end if;
  return query
    select v.id, v.user_id, v.name, v.role, v.clinic, v.license_number, v.approved,
           v.reviewed_at, v.review_notes, r.full_name, v.created_at, u.email, u.phone, u.location,
           (select count(*) from public.verifier_submissions s
             where s.verifier_user_id = v.user_id and s.status <> 'owner_submitted')
      from public.verifiers v
      join public.users u on u.id = v.user_id
      left join public.users r on r.id = v.reviewed_by
     order by v.created_at desc;
end;
$$;

-- p_decision: 'approve', or 'reject' (also revokes an approved account; remarks required).
create or replace function public.admin_review_verifier(p_verifier_id uuid, p_decision text, p_notes text default null)
returns public.verifiers
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.verifiers;
  v_was_approved boolean;
begin
  if not public.is_admin() then
    raise exception 'Only PawMatch administrators can review applications';
  end if;

  select * into v from public.verifiers where id = p_verifier_id for update;
  if not found then
    raise exception 'Application not found';
  end if;
  if v.user_id = auth.uid() then
    raise exception 'You can''t review your own application';
  end if;
  v_was_approved := v.approved;

  if p_decision = 'approve' then
    if v.approved then
      raise exception 'This account is already approved';
    end if;
  elsif p_decision = 'reject' then
    if coalesce(trim(p_notes), '') = '' then
      raise exception 'Please add remarks explaining why the application was not approved';
    end if;
    if not v.approved and v.reviewed_at is not null then
      raise exception 'This application has already been rejected';
    end if;
  else
    raise exception 'Decision must be approve or reject';
  end if;

  update public.verifiers
     set approved = (p_decision = 'approve'),
         reviewed_at = now(),
         reviewed_by = auth.uid(),
         review_notes = nullif(trim(coalesce(p_notes, '')), '')
   where id = v.id
  returning * into v;

  perform public.notify(
    v.user_id,
    'verifier_review',
    case
      when v.approved then 'Your account is approved'
      when v_was_approved then 'Your verifier approval was revoked'
      else 'Your application was not approved'
    end,
    case
      when v.approved then 'Owners can now choose you to verify their dogs'' documents.'
      else v.review_notes
    end,
    jsonb_build_object('verifier_id', v.id, 'approved', v.approved)
  );

  return v;
end;
$$;

revoke all on function public.verifiers_notify_admins() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.admin_list_verifiers() to authenticated;
grant execute on function public.admin_review_verifier(uuid, text, text) to authenticated;
