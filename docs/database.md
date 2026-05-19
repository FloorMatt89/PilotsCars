# Database

## Status
The booking-platform schema is **designed and migration-ready**. The live marketing
site remains static; this schema activates when the booking app is built.

- Migration: `supabase/migrations/0001_init_schema.sql`
- DB: Supabase Postgres, all tables RLS-enabled
- Admin gate: JWT `app_metadata.role = 'admin'` → helper `public.is_admin()`
- Verification: airline ID image in private `airline-ids` storage bucket; path in `users.airline_id_image_url`; signed URLs only

### Implemented Tables (v1)

**users** (1:1 with `auth.users`)
`id` (uuid PK → auth.users), `email` (unique), `full_name`, `phone`,
`airline_id_image_url` (storage path), `is_verified` (bool, default false),
`verified_at` (timestamptz, null until approved), `created_at`, `updated_at`.
RLS: own row read/insert/update; admins all; admin-only delete.

**locations**
`id` (uuid PK), `name`, `city`, `address`, `phone`, `hours_open`, `created_at`.
RLS: all authenticated users read; admin-only write.

**vehicles**
`id` (uuid PK), `location_id` (FK → locations), `make`, `model`, `year`,
`color`, `license_plate` (unique), `vehicle_type` (enum sedan/suv/van/minivan),
`daily_rate` (numeric, all-inclusive), `is_available` (bool), `features` (jsonb array),
`mileage` (int), `created_at`.
RLS: all authenticated users read; admin-only write.

**bookings**
`id` (uuid PK), `user_id` (FK → users), `vehicle_id` (FK → vehicles),
`location_id` (FK → locations), `pickup_date`, `return_date`, `pickup_time`,
`return_time`, `status` (enum pending/confirmed/completed/cancelled),
`total_price` (numeric), `notes`, `stripe_payment_intent_id` (nullable, future),
`created_at`, `updated_at`. Check: `return_date >= pickup_date`.
RLS: own rows read/update; insert requires `is_verified = true`; admins all; admin-only delete.

**referrals**
`id` (uuid PK), `referrer_id` (FK → users), `referred_user_id` (FK → users, nullable),
`referral_code` (unique, auto `PILOT-XXXXXX`), `booking_id` (FK → bookings, nullable),
`commission_earned` (numeric, 8% of booking total), `status` (enum pending/earned/paid),
`paid_at` (nullable), `created_at`. Check: referrer ≠ referred.
RLS: referrer reads own; admin-only insert-finalize/update/delete.

## Legacy Notes (Earlier Future-Reference Sketch)
Superseded by the implemented tables above. Kept for history:

### Users (Supabase Auth)
```
id (uuid, primary key)
email (string, unique)
role ('crew_member', 'fleet_owner', 'admin')
verified_airline (string) — which airline crew member belongs to
created_at (timestamp)
```

### Vehicles (Future)
```
id (uuid, primary key)
owner_id (uuid, foreign key → users)
make (string)
model (string)
year (integer)
type ('sedan', 'suv', 'mini_van', 'passenger_van', 'cargo_van')
color (string)
price_per_day (decimal)
photo_url (string) — signed Supabase Storage URL
available_from (date)
location (string)
created_at (timestamp)
```

### Bookings (Future)
```
id (uuid, primary key)
vehicle_id (uuid, foreign key → vehicles)
renter_id (uuid, foreign key → users)
owner_id (uuid, foreign key → users)
start_date (date)
end_date (date)
total_price (decimal)
status ('pending', 'confirmed', 'cancelled', 'completed')
created_at (timestamp)
```

### Referrals (Future)
```
id (uuid, primary key)
referrer_id (uuid, foreign key → users)
referred_user_id (uuid, foreign key → users, nullable)
referral_code (string, unique)
tier ('first_officer', 'captain', 'fleet_host')
bonus_earned (decimal)
redeemed_at (timestamp, nullable)
created_at (timestamp)
```

## Supabase Configuration (For Future)
When implementing the above:

### RLS (Row Level Security) Policies
- Users can only view/edit their own profile
- Users can only see vehicles available in their region
- Fleet owners can only manage their own vehicles
- Crew members can only view bookings they created or are involved in
- Referral codes are publicly viewable; bonus tracking is private per user

### Storage Buckets
- `vehicles-photos/` — public read (via signed URLs), authenticated write (fleet owners only)
- `documents/` — private per user (license, insurance, etc.)

### Authentication
- Email/password via Supabase Auth
- Optional: Social login (Google, GitHub) for faster signup

## Current Static Content
All content is **hardcoded in JSX**:
- Vehicle list (name, type, image, price) → in Home and Vehicles pages
- Referral tiers and bonuses → in Referrals page
- Team members → in About page
- FAQ and testimonials → in Referrals page
- Contact channels → in Contact page

## Data Refresh Strategy
Currently: Manual code edit + redeploy to Vercel

Future: Fetch from Supabase or CMS (Contentful, Sanity, etc.)

## Security Notes
- Never expose `service_role` key in frontend
- All sensitive operations go through API routes with RLS enforcement
- Verify user role before allowing fleet management or booking actions
- Signed URLs for all vehicle photo downloads
