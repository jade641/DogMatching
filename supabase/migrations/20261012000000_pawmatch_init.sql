-- ============================================================================
-- PawMatch Mobile — initial schema
--
-- Implements the Entity Relationship Diagram (Figure 6) and Data Dictionary
-- (Tables 18–22) of the PawMatch Mobile paper:
--   users, owners, verifiers, dogs, match_requests, verifier_submissions
-- plus the supporting tables required by the specific objectives:
--   messages        (FR7  secure in-app messaging)
--   reviews         (1.3.2.4 feedback & ratings / reputation history)
--   notifications   (1.3.2.3 / 1.3.2.4 real-time alert notifications)
--   audit_logs      (verification badges and audit trail)
--
-- Run this once in the Supabase SQL editor (or `supabase db push`).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.doc_label(t text)
returns text
language sql
immutable
as $$
  select case t
    when 'vaccination' then 'Vaccination Card'
    when 'health_clearance' then 'Veterinary Health Clearance'
    when 'pedigree' then 'Pedigree Certificate'
    when 'dna' then 'DNA / Genetic Test Result'
    else t
  end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Table 18. Users — shared identity source, one row per Supabase auth user.
create table public.users (
  id uuid primary key,
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  avatar_url text,
  location text not null default 'Davao City',
  role text not null default 'owner' check (role in ('owner', 'verifier', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table 19. Owners — public profile of a dog owner.
create table public.owners (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references public.users (id) on delete cascade,
  display_name text not null,
  location text not null default 'Davao City',
  avatar_url text,
  rating numeric(3, 2) not null default 0,
  review_count int not null default 0,
  completed_matches int not null default 0,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table 18 (Verifiers) — licensed veterinarians / certified breeders.
-- `approved` must be set by an administrator before the verifier is listed.
create table public.verifiers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  name text not null,
  role text not null default 'Licensed Veterinarian'
    check (role in ('Licensed Veterinarian', 'Certified Breeder')),
  clinic text not null default '',
  license_number text not null default '',
  rating numeric(3, 2) not null default 0,
  available boolean not null default true,
  approved boolean not null default false,
  avatar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table 22. Dogs — structured dog profiles used by the compatibility algorithm.
create table public.dogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.owners (user_id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 40),
  breed text not null check (char_length(trim(breed)) between 1 and 60),
  age numeric(4, 1) not null check (age >= 0 and age <= 25),
  sex text not null check (sex in ('male', 'female')),
  size text not null check (size in ('small', 'medium', 'large')),
  color text not null default '',
  temperament text[] not null default '{}',
  description text not null default '' check (char_length(description) <= 1000),
  -- Trust score (0–100): 25 points per veterinarian-verified document type.
  score int not null default 0,
  verified boolean not null default false,
  -- Verification tier: 0 none, 1 vaccination, 2 + health clearance, 3 + pedigree/DNA.
  tier int not null default 0 check (tier between 0 and 3),
  verified_docs text[] not null default '{}',
  img text,
  photos text[] not null default '{}',
  rating numeric(3, 2) not null default 0,
  reviews int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dogs_owner_idx on public.dogs (owner_id);
create index dogs_sex_idx on public.dogs (sex);

-- Table 20. Match_Request — breeding partner requests.
create table public.match_requests (
  id bigint generated always as identity primary key,
  dog_id uuid not null references public.dogs (id) on delete cascade,
  requester_dog_id uuid references public.dogs (id) on delete set null,
  requester_name text not null default '',
  requester_email text not null default '',
  requester_user_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  recipient_user_id uuid not null references public.users (id) on delete cascade,
  message text not null default '' check (char_length(message) <= 2000),
  compatibility_score int check (compatibility_score between 0 and 100),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index match_requests_requester_idx on public.match_requests (requester_user_id);
create index match_requests_recipient_idx on public.match_requests (recipient_user_id);
create unique index match_requests_one_active_idx
  on public.match_requests (dog_id, requester_dog_id)
  where status in ('pending', 'accepted');

-- In-app messages, threaded per match request.
create table public.messages (
  id bigint generated always as identity primary key,
  match_request_id bigint not null references public.match_requests (id) on delete cascade,
  sender_id uuid not null default auth.uid() references public.users (id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index messages_thread_idx on public.messages (match_request_id, created_at);

-- Table 21. Verifier_Submissions — multi-tier verification workflow.
create table public.verifier_submissions (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid not null references public.dogs (id) on delete cascade,
  owner_id uuid not null references public.users (id) on delete cascade,
  verifier_user_id uuid not null references public.users (id),
  verifier_name text not null default '',
  submission_type text not null
    check (submission_type in ('vaccination', 'health_clearance', 'pedigree', 'dna')),
  document_url text not null,
  notes text,
  status text not null default 'owner_submitted'
    check (status in ('owner_submitted', 'vet_verified', 'verification_failed')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index verifier_submissions_dog_idx on public.verifier_submissions (dog_id);
create index verifier_submissions_verifier_idx on public.verifier_submissions (verifier_user_id, status);

-- Feedback and ratings exchanged after an accepted/completed match.
create table public.reviews (
  id bigint generated always as identity primary key,
  match_request_id bigint not null references public.match_requests (id) on delete cascade,
  reviewer_id uuid not null default auth.uid() references public.owners (user_id) on delete cascade,
  reviewee_id uuid not null references public.owners (user_id) on delete cascade,
  dog_id uuid references public.dogs (id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text not null default '' check (char_length(comment) <= 1000),
  created_at timestamptz not null default now(),
  unique (match_request_id, reviewer_id)
);
create index reviews_reviewee_idx on public.reviews (reviewee_id, created_at desc);

-- Real-time alert notifications.
create table public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.users (id) on delete cascade,
  type text not null check (type in (
    'match_request', 'request_update', 'message', 'verification_request',
    'verification_result', 'review', 'match_alert', 'system'
  )),
  title text not null,
  body text not null default '',
  data jsonb not null default '{}'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

-- Verification audit trail.
create table public.audit_logs (
  id bigint generated always as identity primary key,
  dog_id uuid references public.dogs (id) on delete cascade,
  submission_id uuid references public.verifier_submissions (id) on delete set null,
  actor_id uuid references public.users (id) on delete set null,
  actor_name text not null default '',
  action text not null check (action in ('submitted', 'approved', 'rejected', 'tier_changed')),
  details text not null default '',
  created_at timestamptz not null default now()
);
create index audit_logs_dog_idx on public.audit_logs (dog_id, created_at desc);

-- updated_at maintenance
create trigger users_updated_at before update on public.users
  for each row execute function public.set_updated_at();
create trigger owners_updated_at before update on public.owners
  for each row execute function public.set_updated_at();
create trigger verifiers_updated_at before update on public.verifiers
  for each row execute function public.set_updated_at();
create trigger dogs_updated_at before update on public.dogs
  for each row execute function public.set_updated_at();
create trigger match_requests_updated_at before update on public.match_requests
  for each row execute function public.set_updated_at();
create trigger verifier_submissions_updated_at before update on public.verifier_submissions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Notifications helper (internal; only callable from security-definer code)
-- ---------------------------------------------------------------------------
create or replace function public.notify(
  p_user uuid, p_type text, p_title text, p_body text, p_data jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notifications (user_id, type, title, body, data)
  values (p_user, p_type, p_title, coalesce(p_body, ''), coalesce(p_data, '{}'::jsonb));
$$;

-- ---------------------------------------------------------------------------
-- Account provisioning: auth.users -> users + owners | verifiers
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_role text := case when meta ->> 'role' = 'verifier' then 'verifier' else 'owner' end;
  v_name text := coalesce(
    nullif(trim(meta ->> 'full_name'), ''),
    nullif(trim(meta ->> 'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'PawMatch user'
  );
  v_location text := coalesce(nullif(trim(meta ->> 'location'), ''), 'Davao City');
begin
  insert into public.users (id, auth_user_id, full_name, email, phone, location, role)
  values (new.id, new.id, v_name, coalesce(new.email, ''), nullif(trim(meta ->> 'phone'), ''), v_location, v_role);

  if v_role = 'verifier' then
    insert into public.verifiers (user_id, name, role, clinic, license_number)
    values (
      new.id,
      v_name,
      case when meta ->> 'verifier_role' = 'Certified Breeder' then 'Certified Breeder' else 'Licensed Veterinarian' end,
      coalesce(trim(meta ->> 'clinic'), ''),
      coalesce(trim(meta ->> 'license_number'), '')
    );
  else
    insert into public.owners (user_id, display_name, location)
    values (new.id, v_name, v_location);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profile edits keep users / owners / verifiers in sync.
create or replace function public.update_my_profile(p_full_name text, p_phone text, p_location text)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  if coalesce(trim(p_full_name), '') = '' then
    raise exception 'Name is required';
  end if;

  update public.users
     set full_name = trim(p_full_name),
         phone = nullif(trim(coalesce(p_phone, '')), ''),
         location = coalesce(nullif(trim(coalesce(p_location, '')), ''), location)
   where id = auth.uid()
  returning * into v_user;

  update public.owners
     set display_name = v_user.full_name, location = v_user.location
   where user_id = v_user.id;
  update public.verifiers
     set name = v_user.full_name
   where user_id = v_user.id;

  return v_user;
end;
$$;

-- ---------------------------------------------------------------------------
-- Match requests
-- ---------------------------------------------------------------------------
create or replace function public.match_requests_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target public.dogs;
  v_mine public.dogs;
  v_user public.users;
begin
  select * into v_target from public.dogs where id = new.dog_id;
  if not found then
    raise exception 'Dog not found';
  end if;
  if v_target.owner_id = new.requester_user_id then
    raise exception 'You cannot send a breeding request to your own dog';
  end if;

  if new.requester_dog_id is not null then
    select * into v_mine from public.dogs where id = new.requester_dog_id;
    if not found or v_mine.owner_id <> new.requester_user_id then
      raise exception 'The requesting dog must belong to you';
    end if;
    if v_mine.sex = v_target.sex then
      raise exception 'Breeding partners must be of the opposite sex';
    end if;
  end if;

  select * into v_user from public.users where id = new.requester_user_id;
  new.requester_name := coalesce(v_user.full_name, '');
  new.requester_email := coalesce(v_user.email, '');
  new.recipient_user_id := v_target.owner_id;
  new.status := 'pending';
  return new;
end;
$$;

create trigger match_requests_before_insert
  before insert on public.match_requests
  for each row execute function public.match_requests_before_insert();

create or replace function public.match_requests_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dog_name text;
begin
  select name into v_dog_name from public.dogs where id = new.dog_id;

  if coalesce(trim(new.message), '') <> '' then
    insert into public.messages (match_request_id, sender_id, body)
    values (new.id, new.requester_user_id, trim(new.message));
  end if;

  perform public.notify(
    new.recipient_user_id,
    'match_request',
    'New breeding request for ' || coalesce(v_dog_name, 'your dog'),
    new.requester_name || ' wants to pair with ' || coalesce(v_dog_name, 'your dog')
      || coalesce(' (' || new.compatibility_score || '% compatible)', '') || '.',
    jsonb_build_object('match_request_id', new.id, 'dog_id', new.dog_id)
  );
  return new;
end;
$$;

create trigger match_requests_after_insert
  after insert on public.match_requests
  for each row execute function public.match_requests_after_insert();

-- Status transitions: accept / decline (recipient), cancel (requester),
-- complete (either party, once accepted).
create or replace function public.respond_match_request(p_request_id bigint, p_action text)
returns public.match_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.match_requests;
  v_actor uuid := auth.uid();
  v_new text;
  v_other uuid;
  v_actor_name text;
  v_dog_name text;
begin
  select * into r from public.match_requests where id = p_request_id for update;
  if not found then
    raise exception 'Request not found';
  end if;
  if v_actor is null or v_actor not in (r.requester_user_id, r.recipient_user_id) then
    raise exception 'You are not part of this request';
  end if;

  if p_action in ('accept', 'decline') then
    if v_actor <> r.recipient_user_id then
      raise exception 'Only the owner of the requested dog can % this request', p_action;
    end if;
    if r.status <> 'pending' then
      raise exception 'This request is no longer pending';
    end if;
    v_new := case p_action when 'accept' then 'accepted' else 'declined' end;
  elsif p_action = 'cancel' then
    if v_actor <> r.requester_user_id then
      raise exception 'Only the requester can cancel this request';
    end if;
    if r.status not in ('pending', 'accepted') then
      raise exception 'This request can no longer be cancelled';
    end if;
    v_new := 'cancelled';
  elsif p_action = 'complete' then
    if r.status <> 'accepted' then
      raise exception 'Only accepted requests can be marked as completed';
    end if;
    v_new := 'completed';
  else
    raise exception 'Unknown action: %', p_action;
  end if;

  update public.match_requests set status = v_new where id = r.id returning * into r;

  if v_new = 'completed' then
    update public.owners
       set completed_matches = completed_matches + 1
     where user_id in (r.requester_user_id, r.recipient_user_id);
  end if;

  v_other := case when v_actor = r.requester_user_id then r.recipient_user_id else r.requester_user_id end;
  select full_name into v_actor_name from public.users where id = v_actor;
  select name into v_dog_name from public.dogs where id = r.dog_id;

  perform public.notify(
    v_other,
    'request_update',
    'Breeding request ' || v_new,
    coalesce(v_actor_name, 'The other owner') || ' marked the request for '
      || coalesce(v_dog_name, 'the dog') || ' as ' || v_new || '.',
    jsonb_build_object('match_request_id', r.id, 'status', v_new)
  );

  return r;
end;
$$;

-- ---------------------------------------------------------------------------
-- Messages
-- ---------------------------------------------------------------------------
create or replace function public.messages_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.match_requests;
  v_sender text;
  v_other uuid;
begin
  select * into r from public.match_requests where id = new.match_request_id;
  -- The opening message of a request is already announced by the request notification.
  if r.message is not null and trim(r.message) = new.body and new.sender_id = r.requester_user_id
     and not exists (select 1 from public.messages m where m.match_request_id = r.id and m.id < new.id) then
    return new;
  end if;

  select full_name into v_sender from public.users where id = new.sender_id;
  v_other := case when new.sender_id = r.requester_user_id then r.recipient_user_id else r.requester_user_id end;

  perform public.notify(
    v_other,
    'message',
    'New message from ' || coalesce(v_sender, 'a PawMatch owner'),
    left(new.body, 140),
    jsonb_build_object('match_request_id', r.id)
  );
  return new;
end;
$$;

create trigger messages_after_insert
  after insert on public.messages
  for each row execute function public.messages_after_insert();

-- ---------------------------------------------------------------------------
-- Multi-tier verification workflow
-- ---------------------------------------------------------------------------
create or replace function public.recompute_dog_verification(p_dog uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old public.dogs;
  v_docs text[];
  v_tier int;
begin
  select * into v_old from public.dogs where id = p_dog;
  if not found then
    return;
  end if;

  select coalesce(array_agg(distinct submission_type order by submission_type), '{}')
    into v_docs
    from public.verifier_submissions
   where dog_id = p_dog and status = 'vet_verified';

  v_tier := case
    when 'vaccination' = any (v_docs) and 'health_clearance' = any (v_docs)
         and ('pedigree' = any (v_docs) or 'dna' = any (v_docs)) then 3
    when 'vaccination' = any (v_docs) and 'health_clearance' = any (v_docs) then 2
    when 'vaccination' = any (v_docs) then 1
    else 0
  end;

  update public.dogs
     set verified_docs = v_docs,
         tier = v_tier,
         verified = v_tier >= 1,
         score = least(100, coalesce(cardinality(v_docs), 0) * 25)
   where id = p_dog;

  if v_tier <> v_old.tier then
    insert into public.audit_logs (dog_id, actor_name, action, details)
    values (p_dog, 'PawMatch', 'tier_changed', 'Tier ' || v_old.tier || ' → Tier ' || v_tier);
  end if;

  if v_tier >= 1 then
    update public.owners set verified_at = coalesce(verified_at, now()) where user_id = v_old.owner_id;
  end if;
end;
$$;

create or replace function public.verifier_submissions_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dog public.dogs;
  v_ver public.verifiers;
begin
  select * into v_dog from public.dogs where id = new.dog_id;
  if not found then
    raise exception 'Dog not found';
  end if;

  select * into v_ver from public.verifiers where user_id = new.verifier_user_id;
  if not found or not v_ver.approved then
    raise exception 'The selected verifier is not an approved veterinarian or breeder';
  end if;
  if new.verifier_user_id = v_dog.owner_id then
    raise exception 'You cannot verify your own dog';
  end if;
  if split_part(new.document_url, '/', 1) <> v_dog.owner_id::text then
    raise exception 'Document must be uploaded to your own documents folder';
  end if;

  new.owner_id := v_dog.owner_id;
  new.verifier_name := v_ver.name;
  new.status := 'owner_submitted';
  new.notes := null;
  new.reviewed_at := null;
  return new;
end;
$$;

create trigger verifier_submissions_before_insert
  before insert on public.verifier_submissions
  for each row execute function public.verifier_submissions_before_insert();

create or replace function public.verifier_submissions_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner text;
  v_dog text;
begin
  select full_name into v_owner from public.users where id = new.owner_id;
  select name into v_dog from public.dogs where id = new.dog_id;

  insert into public.audit_logs (dog_id, submission_id, actor_id, actor_name, action, details)
  values (new.dog_id, new.id, new.owner_id, coalesce(v_owner, ''), 'submitted',
          public.doc_label(new.submission_type) || ' sent to ' || new.verifier_name);

  perform public.notify(
    new.verifier_user_id,
    'verification_request',
    'New document to review',
    coalesce(v_owner, 'An owner') || ' submitted a ' || public.doc_label(new.submission_type)
      || ' for ' || coalesce(v_dog, 'their dog') || '.',
    jsonb_build_object('submission_id', new.id, 'dog_id', new.dog_id)
  );
  return new;
end;
$$;

create trigger verifier_submissions_after_insert
  after insert on public.verifier_submissions
  for each row execute function public.verifier_submissions_after_insert();

create or replace function public.review_submission(p_submission_id uuid, p_decision text, p_notes text default null)
returns public.verifier_submissions
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.verifier_submissions;
  v_ver public.verifiers;
  v_status text;
  v_dog text;
begin
  select * into s from public.verifier_submissions where id = p_submission_id for update;
  if not found then
    raise exception 'Submission not found';
  end if;
  if auth.uid() is null or s.verifier_user_id <> auth.uid() then
    raise exception 'Only the assigned verifier can review this submission';
  end if;

  select * into v_ver from public.verifiers where user_id = auth.uid();
  if not found or not v_ver.approved then
    raise exception 'Your verifier account has not been approved yet';
  end if;
  if s.status <> 'owner_submitted' then
    raise exception 'This submission has already been reviewed';
  end if;

  if p_decision = 'approve' then
    v_status := 'vet_verified';
  elsif p_decision = 'reject' then
    if coalesce(trim(p_notes), '') = '' then
      raise exception 'Please add remarks explaining why the document was rejected';
    end if;
    v_status := 'verification_failed';
  else
    raise exception 'Decision must be approve or reject';
  end if;

  update public.verifier_submissions
     set status = v_status,
         notes = nullif(trim(coalesce(p_notes, '')), ''),
         reviewed_at = now()
   where id = s.id
  returning * into s;

  insert into public.audit_logs (dog_id, submission_id, actor_id, actor_name, action, details)
  values (s.dog_id, s.id, auth.uid(), v_ver.name,
          case when v_status = 'vet_verified' then 'approved' else 'rejected' end,
          public.doc_label(s.submission_type));

  perform public.recompute_dog_verification(s.dog_id);

  select name into v_dog from public.dogs where id = s.dog_id;
  perform public.notify(
    s.owner_id,
    'verification_result',
    case when v_status = 'vet_verified'
      then public.doc_label(s.submission_type) || ' verified'
      else public.doc_label(s.submission_type) || ' was not approved' end,
    case when v_status = 'vet_verified'
      then v_ver.name || ' verified ' || coalesce(v_dog, 'your dog') || '''s document.'
      else v_ver.name || ': ' || s.notes end,
    jsonb_build_object('submission_id', s.id, 'dog_id', s.dog_id, 'status', v_status)
  );

  return s;
end;
$$;

-- ---------------------------------------------------------------------------
-- Reviews and reputation
-- ---------------------------------------------------------------------------
create or replace function public.recompute_reputation(p_user uuid, p_dog uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user is not null then
    update public.owners o
       set rating = coalesce((select round(avg(rating)::numeric, 2) from public.reviews where reviewee_id = p_user), 0),
           review_count = (select count(*) from public.reviews where reviewee_id = p_user)
     where o.user_id = p_user;
  end if;
  if p_dog is not null then
    update public.dogs d
       set rating = coalesce((select round(avg(rating)::numeric, 2) from public.reviews where dog_id = p_dog), 0),
           reviews = (select count(*) from public.reviews where dog_id = p_dog)
     where d.id = p_dog;
  end if;
end;
$$;

create or replace function public.reviews_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.match_requests;
begin
  select * into r from public.match_requests where id = new.match_request_id;
  if not found then
    raise exception 'Request not found';
  end if;
  if new.reviewer_id not in (r.requester_user_id, r.recipient_user_id) then
    raise exception 'Only owners involved in this match can leave a review';
  end if;
  if r.status not in ('accepted', 'completed') then
    raise exception 'Reviews can be left once a request has been accepted';
  end if;

  if new.reviewer_id = r.requester_user_id then
    new.reviewee_id := r.recipient_user_id;
    new.dog_id := r.dog_id;
  else
    new.reviewee_id := r.requester_user_id;
    new.dog_id := r.requester_dog_id;
  end if;
  new.comment := trim(coalesce(new.comment, ''));
  return new;
end;
$$;

create trigger reviews_before_insert
  before insert on public.reviews
  for each row execute function public.reviews_before_insert();

create or replace function public.reviews_after_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reviewer text;
begin
  if tg_op = 'DELETE' then
    perform public.recompute_reputation(old.reviewee_id, old.dog_id);
    return old;
  end if;

  perform public.recompute_reputation(new.reviewee_id, new.dog_id);
  select full_name into v_reviewer from public.users where id = new.reviewer_id;
  perform public.notify(
    new.reviewee_id,
    'review',
    'You received a ' || new.rating || '-star review',
    coalesce(v_reviewer, 'An owner') || coalesce(': "' || nullif(left(new.comment, 120), '') || '"', '.'),
    jsonb_build_object('review_id', new.id, 'match_request_id', new.match_request_id)
  );
  return new;
end;
$$;

create trigger reviews_after_change
  after insert or delete on public.reviews
  for each row execute function public.reviews_after_change();

-- ---------------------------------------------------------------------------
-- Privileges. Writes that must follow business rules go through the
-- security-definer RPCs above; direct table writes are limited to the
-- columns a user may legitimately set.
-- ---------------------------------------------------------------------------
revoke all on function public.notify(uuid, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.recompute_dog_verification(uuid) from public, anon, authenticated;
revoke all on function public.recompute_reputation(uuid, uuid) from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

grant execute on function public.update_my_profile(text, text, text) to authenticated;
grant execute on function public.respond_match_request(bigint, text) to authenticated;
grant execute on function public.review_submission(uuid, text, text) to authenticated;

revoke insert, update, delete on public.users from anon, authenticated;
revoke insert, update, delete on public.owners from anon, authenticated;

revoke insert, update, delete on public.verifiers from anon, authenticated;
grant update (available, clinic, license_number, avatar) on public.verifiers to authenticated;

revoke insert, update on public.dogs from anon, authenticated;
grant insert (owner_id, name, breed, age, sex, size, color, temperament, description, img, photos)
  on public.dogs to authenticated;
grant update (name, breed, age, sex, size, color, temperament, description, img, photos)
  on public.dogs to authenticated;

revoke insert, update, delete on public.match_requests from anon, authenticated;
grant insert (dog_id, requester_dog_id, requester_user_id, message, compatibility_score)
  on public.match_requests to authenticated;

revoke insert, update, delete on public.messages from anon, authenticated;
grant insert (match_request_id, sender_id, body) on public.messages to authenticated;

revoke insert, update, delete on public.verifier_submissions from anon, authenticated;
grant insert (dog_id, verifier_user_id, submission_type, document_url)
  on public.verifier_submissions to authenticated;

revoke insert, update, delete on public.reviews from anon, authenticated;
grant insert (match_request_id, reviewer_id, rating, comment) on public.reviews to authenticated;

revoke insert, update on public.notifications from anon, authenticated;
grant update (read) on public.notifications to authenticated;

revoke insert, update, delete on public.audit_logs from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.owners enable row level security;
alter table public.verifiers enable row level security;
alter table public.dogs enable row level security;
alter table public.match_requests enable row level security;
alter table public.messages enable row level security;
alter table public.verifier_submissions enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "users: read own" on public.users
  for select to authenticated using (id = auth.uid());

create policy "owners: read all" on public.owners
  for select to authenticated using (true);

create policy "verifiers: read approved or own" on public.verifiers
  for select to authenticated using (approved or user_id = auth.uid());
create policy "verifiers: update own" on public.verifiers
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "dogs: read all" on public.dogs
  for select to authenticated using (true);
create policy "dogs: insert own" on public.dogs
  for insert to authenticated
  with check (owner_id = auth.uid() and exists (select 1 from public.owners o where o.user_id = auth.uid()));
create policy "dogs: update own" on public.dogs
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "dogs: delete own" on public.dogs
  for delete to authenticated using (owner_id = auth.uid());

create policy "match_requests: parties read" on public.match_requests
  for select to authenticated using (auth.uid() in (requester_user_id, recipient_user_id));
create policy "match_requests: owners create" on public.match_requests
  for insert to authenticated
  with check (requester_user_id = auth.uid() and exists (select 1 from public.owners o where o.user_id = auth.uid()));

create policy "messages: parties read" on public.messages
  for select to authenticated
  using (exists (
    select 1 from public.match_requests r
     where r.id = match_request_id and auth.uid() in (r.requester_user_id, r.recipient_user_id)
  ));
create policy "messages: parties send" on public.messages
  for insert to authenticated
  with check (
    sender_id = auth.uid() and exists (
      select 1 from public.match_requests r
       where r.id = match_request_id
         and auth.uid() in (r.requester_user_id, r.recipient_user_id)
         and r.status in ('pending', 'accepted', 'completed')
    )
  );

create policy "verifier_submissions: owner or verifier read" on public.verifier_submissions
  for select to authenticated using (auth.uid() in (owner_id, verifier_user_id));
create policy "verifier_submissions: owner submits" on public.verifier_submissions
  for insert to authenticated with check (owner_id = auth.uid());

create policy "reviews: read all" on public.reviews
  for select to authenticated using (true);
create policy "reviews: parties write" on public.reviews
  for insert to authenticated with check (reviewer_id = auth.uid());

create policy "notifications: read own" on public.notifications
  for select to authenticated using (user_id = auth.uid());
create policy "notifications: update own" on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications: delete own" on public.notifications
  for delete to authenticated using (user_id = auth.uid());

create policy "audit_logs: read all" on public.audit_logs
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Storage: public dog photos, private verification documents.
-- Objects are stored under "<auth uid>/<file>".
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('dog-photos', 'dog-photos', true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']),
  ('documents', 'documents', false, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'])
on conflict (id) do nothing;

create policy "dog-photos: owner uploads" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'dog-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "dog-photos: owner updates" on storage.objects
  for update to authenticated
  using (bucket_id = 'dog-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "dog-photos: owner deletes" on storage.objects
  for delete to authenticated
  using (bucket_id = 'dog-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "documents: owner uploads" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "documents: owner reads" on storage.objects
  for select to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "documents: assigned verifier reads" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'documents' and exists (
      select 1 from public.verifier_submissions s
       where s.document_url = storage.objects.name and s.verifier_user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Supabase Realtime (live alerts, chat, request and verification status)
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table
  public.notifications, public.messages, public.match_requests, public.verifier_submissions;
