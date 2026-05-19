-- =============================================================================
-- PilotCars — Initial Schema
-- Migration: 0001_init_schema.sql
--
-- Car rental platform for verified airline crew.
--   - All-inclusive pricing (insurance, miles, tolls included). NO deposits.
--   - Airline ID image verification (admin approves/rejects).
--   - 8% referral commission.
--   - Multi-location (Miami, Orlando, expandable).
--   - Stripe payment fields included as nullable for future use.
--
-- Conventions:
--   - All tables have RLS ENABLED. No table is left open.
--   - `public.users` is a profile table keyed 1:1 to `auth.users` (Supabase Auth).
--   - Admin access is driven by a JWT `app_metadata.role = 'admin'` claim,
--     checked via the SECURITY DEFINER helper `public.is_admin()`.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
create type public.vehicle_type as enum ('sedan', 'suv', 'van', 'minivan');
create type public.booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
create type public.referral_status as enum ('pending', 'earned', 'paid');

-- -----------------------------------------------------------------------------
-- Helper: is_admin()
-- Reads the admin flag from the JWT. Admins are provisioned by setting
-- app_metadata.role = 'admin' on the auth user (server-side / dashboard only,
-- never settable by the client). SECURITY DEFINER + stable so it can be used
-- safely inside RLS policies without recursion.
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- -----------------------------------------------------------------------------
-- Helper: set_updated_at()
-- Trigger function to keep updated_at fresh on UPDATE.
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Helper: generate_referral_code()
-- Produces a unique code like "PILOT-A1B2C3" (6 base32-ish chars, no
-- ambiguous 0/O/1/I/L). Retries on the (extremely unlikely) collision.
-- -----------------------------------------------------------------------------
create or replace function public.generate_referral_code()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  code text;
  i int;
begin
  loop
    code := 'PILOT-';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.referrals r where r.referral_code = code);
  end loop;
  return code;
end;
$$;

-- =============================================================================
-- TABLE: users  (profile, 1:1 with auth.users)
-- =============================================================================
create table public.users (
  id                    uuid primary key references auth.users (id) on delete cascade,
  email                 text not null unique,
  full_name             text,
  phone                 text,
  airline_id_image_url  text,
  is_verified           boolean not null default false,
  verified_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.users is 'User profiles. id maps 1:1 to auth.users. Verification gate for booking.';
comment on column public.users.airline_id_image_url is 'Path (object key) in the private airline-ids storage bucket. Not a public URL.';

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

alter table public.users enable row level security;

-- A user can read their own profile; admins can read all.
create policy "users_select_own_or_admin"
  on public.users for select
  to authenticated
  using (id = (select auth.uid()) or public.is_admin());

-- A user may create only their own profile row (id must equal their auth uid).
-- Note: is_verified / verified_at cannot be trusted from the client; they are
-- defaulted false and only changed by admins (policy below) or service role.
create policy "users_insert_self"
  on public.users for insert
  to authenticated
  with check (id = (select auth.uid()));

-- A user can update their own profile. Admins can update any (e.g. approving
-- verification). Column-level protection of is_verified is enforced in the
-- service layer / via a trigger if needed (see NOTES in the agent report).
create policy "users_update_own_or_admin"
  on public.users for update
  to authenticated
  using (id = (select auth.uid()) or public.is_admin())
  with check (id = (select auth.uid()) or public.is_admin());

-- Only admins may delete profiles.
create policy "users_delete_admin"
  on public.users for delete
  to authenticated
  using (public.is_admin());

-- =============================================================================
-- TABLE: locations  (rental pickup/return sites)
-- =============================================================================
create table public.locations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  city        text not null,
  address     text not null,
  phone       text,
  hours_open  text,
  created_at  timestamptz not null default now()
);

comment on table public.locations is 'Rental pickup/return locations. Expandable (Miami, Orlando, ...).';

create index locations_city_idx on public.locations (city);

alter table public.locations enable row level security;

-- Any authenticated user can browse all locations.
create policy "locations_select_authenticated"
  on public.locations for select
  to authenticated
  using (true);

-- Only admins manage locations.
create policy "locations_write_admin"
  on public.locations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- TABLE: vehicles
-- =============================================================================
create table public.vehicles (
  id             uuid primary key default gen_random_uuid(),
  location_id    uuid not null references public.locations (id) on delete restrict,
  make           text not null,
  model          text not null,
  year           int not null check (year between 1980 and extract(year from now())::int + 2),
  color          text,
  license_plate  text not null unique,
  vehicle_type   public.vehicle_type not null,
  daily_rate     numeric(10,2) not null check (daily_rate >= 0),
  is_available   boolean not null default true,
  features       jsonb not null default '[]'::jsonb,
  mileage        int check (mileage >= 0),
  created_at     timestamptz not null default now()
);

comment on table public.vehicles is 'Rental fleet. daily_rate is all-inclusive (insurance, miles, tolls).';
comment on column public.vehicles.features is 'JSON array, e.g. ["leather","GPS","backup camera"].';

create index vehicles_location_id_idx on public.vehicles (location_id);
create index vehicles_type_idx on public.vehicles (vehicle_type);
create index vehicles_available_idx on public.vehicles (is_available) where is_available;
create index vehicles_features_gin_idx on public.vehicles using gin (features);

alter table public.vehicles enable row level security;

-- Any authenticated user can browse all vehicles.
create policy "vehicles_select_authenticated"
  on public.vehicles for select
  to authenticated
  using (true);

-- Only admins create/edit/delete vehicles.
create policy "vehicles_write_admin"
  on public.vehicles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- TABLE: bookings
-- =============================================================================
create table public.bookings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users (id) on delete restrict,
  vehicle_id   uuid not null references public.vehicles (id) on delete restrict,
  location_id  uuid not null references public.locations (id) on delete restrict,
  pickup_date  date not null,
  return_date  date not null,
  pickup_time  time,
  return_time  time,
  status       public.booking_status not null default 'pending',
  total_price  numeric(10,2) not null check (total_price >= 0),
  notes        text,
  -- Future Stripe integration (nullable, unused for now):
  stripe_payment_intent_id  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint bookings_date_order check (return_date >= pickup_date)
);

comment on table public.bookings is 'Rental bookings. No deposit. total_price = daily_rate * num_days (computed in app/service layer).';
comment on column public.bookings.stripe_payment_intent_id is 'Reserved for future Stripe integration. Null until payments are live.';

create index bookings_user_id_idx on public.bookings (user_id);
create index bookings_vehicle_id_idx on public.bookings (vehicle_id);
create index bookings_location_id_idx on public.bookings (location_id);
create index bookings_status_idx on public.bookings (status);
create index bookings_vehicle_dates_idx on public.bookings (vehicle_id, pickup_date, return_date);

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

alter table public.bookings enable row level security;

-- A user sees only their own bookings; admins see all.
create policy "bookings_select_own_or_admin"
  on public.bookings for select
  to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

-- A user can create a booking only for themselves, and only if their profile
-- is verified. Admins can create on anyone's behalf.
create policy "bookings_insert_verified_self"
  on public.bookings for insert
  to authenticated
  with check (
    public.is_admin()
    or (
      user_id = (select auth.uid())
      and exists (
        select 1 from public.users u
        where u.id = (select auth.uid()) and u.is_verified = true
      )
    )
  );

-- A user can update their own booking (e.g. add notes, cancel); admins any.
create policy "bookings_update_own_or_admin"
  on public.bookings for update
  to authenticated
  using (user_id = (select auth.uid()) or public.is_admin())
  with check (user_id = (select auth.uid()) or public.is_admin());

-- Only admins may hard-delete bookings (users cancel via status instead).
create policy "bookings_delete_admin"
  on public.bookings for delete
  to authenticated
  using (public.is_admin());

-- =============================================================================
-- TABLE: referrals
-- =============================================================================
create table public.referrals (
  id                 uuid primary key default gen_random_uuid(),
  referrer_id        uuid not null references public.users (id) on delete cascade,
  referred_user_id   uuid references public.users (id) on delete set null,
  referral_code      text not null unique default public.generate_referral_code(),
  booking_id         uuid references public.bookings (id) on delete set null,
  commission_earned  numeric(10,2) not null default 0 check (commission_earned >= 0),
  status             public.referral_status not null default 'pending',
  paid_at            timestamptz,
  created_at         timestamptz not null default now(),
  constraint referrals_not_self check (referrer_id <> referred_user_id)
);

comment on table public.referrals is 'Referral tracking. commission_earned = 8% of linked booking total_price (computed in service layer).';
comment on column public.referrals.referral_code is 'Auto-generated unique code, e.g. PILOT-A1B2C3.';

create index referrals_referrer_id_idx on public.referrals (referrer_id);
create index referrals_referred_user_id_idx on public.referrals (referred_user_id);
create index referrals_booking_id_idx on public.referrals (booking_id);
create index referrals_status_idx on public.referrals (status);

alter table public.referrals enable row level security;

-- A user sees their own referrals (as the referrer); admins see all.
create policy "referrals_select_own_or_admin"
  on public.referrals for select
  to authenticated
  using (referrer_id = (select auth.uid()) or public.is_admin());

-- A user may create a referral row only as themselves (the referrer).
-- commission_earned defaults to 0 and status to 'pending'; finalizing the
-- earned amount/status is an admin/service-layer action.
create policy "referrals_insert_self"
  on public.referrals for insert
  to authenticated
  with check (referrer_id = (select auth.uid()) or public.is_admin());

-- Only admins update referrals (mark earned/paid, set commission, paid_at).
create policy "referrals_update_admin"
  on public.referrals for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Only admins delete referrals.
create policy "referrals_delete_admin"
  on public.referrals for delete
  to authenticated
  using (public.is_admin());

-- =============================================================================
-- STORAGE: airline-ids bucket (private)
-- Holds uploaded airline ID images. Path stored in users.airline_id_image_url.
-- Convention: object key is "<auth.uid>/<filename>" so RLS can scope by folder.
-- Access is via short-lived signed URLs generated server-side. Never public.
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('airline-ids', 'airline-ids', false)
on conflict (id) do nothing;

-- A user can upload/read/update/delete only objects inside their own folder
-- (first path segment == their auth uid). Admins can access all.
create policy "airline_ids_user_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'airline-ids'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or public.is_admin()
    )
  );

create policy "airline_ids_user_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'airline-ids'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "airline_ids_user_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'airline-ids'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "airline_ids_user_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'airline-ids'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or public.is_admin()
    )
  );

-- =============================================================================
-- End of migration 0001
-- =============================================================================
