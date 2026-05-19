# PilotCars Platform — Setup & Testing Guide

The PilotCars platform is feature-complete on the `agent/web-backend` branch. The following steps are needed to prepare for testing and deployment.

---

## Phase 1: Supabase Setup (Required)

### 1. Create a Supabase Project

1. Go to **https://supabase.com/dashboard**
2. Click **"New Project"**
3. Select organization → enter project name (e.g., "pilotcars-dev")
4. Set a strong database password
5. Select region (e.g., us-east-1)
6. Wait 2–3 minutes for project to initialize

### 2. Configure Environment Variables

1. In Supabase dashboard, go **Settings → API**
2. Copy these three values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)
   - **Service Role Secret** (longer key, **never expose in browser**)

3. Open `.env.local` in your project (already created with template)
4. Paste the values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

5. Save `.env.local` (this file is in `.gitignore` — never commit it)

### 3. Apply Database Migrations

The initial schema is in `supabase/migrations/0001_init_schema.sql`. To apply it:

**Option A: Using Supabase CLI (recommended)**
```bash
npm install -g supabase
supabase link --project-ref xxxxx  # Use your project ID from dashboard
supabase db push
```

**Option B: Manual SQL in Supabase Dashboard**
1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"New Query"**
3. Paste the entire contents of `supabase/migrations/0001_init_schema.sql`
4. Click **"Run"**
5. Repeat for `supabase/migrations/0002_add_vehicle_image_path.sql`

After applying:
- Check that all 5 tables exist: `users`, `locations`, `vehicles`, `bookings`, `referrals`
- Check that the `airline-ids` storage bucket exists

---

## Phase 2: Install Dependencies & Start Dev Server

```bash
# Install npm packages
npm install

# Start the Next.js dev server
npm run dev
```

You should see:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Open **http://localhost:3000** in your browser. You should see:
- ✅ Home page with hero, navigation, and CTAs
- ✅ No console errors (open DevTools → Console tab)

---

## Phase 3: Seed Test Data (Required for Testing)

Open **Supabase Dashboard → SQL Editor** and run this script:

```sql
-- Seed locations
insert into public.locations (id, name, city, address, phone, hours_open) values
  (gen_random_uuid(), 'Miami Airport Rental', 'Miami', '2100 NW 42nd Ave, Miami, FL 33142', '+1-305-555-0100', '6am-11pm'),
  (gen_random_uuid(), 'Downtown Miami', 'Miami', '100 Biscayne Blvd, Miami, FL 33132', '+1-305-555-0101', '7am-9pm'),
  (gen_random_uuid(), 'Orlando Downtown', 'Orlando', '123 Main St, Orlando, FL 32801', '+1-407-555-0200', '7am-10pm');

-- Seed vehicles
insert into public.vehicles (location_id, make, model, year, color, license_plate, vehicle_type, daily_rate, is_available, features, mileage) 
select 
  (select id from locations where city='Miami' limit 1),
  make, model, year, color, license_plate, vehicle_type, daily_rate, true, features, mileage
from (values
  ('Toyota', 'Camry', 2023, 'Silver', 'ABC-1234', 'sedan'::public.vehicle_type, 89.99, '["GPS", "leather", "backup camera"]'::jsonb, 15000),
  ('Toyota', 'Camry', 2023, 'Blue', 'ABC-1235', 'sedan'::public.vehicle_type, 89.99, '["GPS", "leather"]'::jsonb, 14500),
  ('Honda', 'CR-V', 2023, 'Black', 'ABC-1240', 'suv'::public.vehicle_type, 129.99, '["GPS", "backup camera", "bluetooth"]'::jsonb, 10000),
  ('Honda', 'Pilot', 2022, 'White', 'ABC-1241', 'suv'::public.vehicle_type, 149.99, '["GPS", "leather", "backup camera"]'::jsonb, 25000),
  ('Toyota', 'Sienna', 2023, 'Gray', 'ABC-1250', 'van'::public.vehicle_type, 179.99, '["GPS", "bluetooth"]'::jsonb, 8000)
) as vehicles(make, model, year, color, license_plate, vehicle_type, daily_rate, features, mileage);
```

After running, verify:
- ✅ 3 locations created (check in Table Editor)
- ✅ 5 vehicles created in Miami location
- ✅ Daily rates are correct ($89–$179)

---

## Phase 4: Create Test Users (Required for Testing)

In Supabase Dashboard → **Authentication → Users**, create these test accounts:

| Email | Password | Role | is_verified | Purpose |
|-------|----------|------|-------------|---------|
| alice@test.com | alice1234 | User | false | Unverified signup testing |
| bob@test.com | bob1234 | User | true | Verified booking tests |
| charlie@test.com | charlie1234 | User | false | Referral tests |
| admin@test.com | admin1234 | Admin | true | Admin approval testing |

**For the admin user:**
1. Create the account normally
2. Click the 3-dot menu → **Edit User**
3. Under **User Metadata**, set `role` to `admin` in the `app_metadata`
4. Save

---

## Phase 5: Execute Test Plan

The comprehensive test plan is in `docs/test-execution-checklist.md`. It has 4 phases:

1. **Phase 1: Database Integrity** (~30 min)
   - Tests constraints, defaults, triggers
   - Must pass before Phase 2
   - Use Supabase SQL Editor for queries

2. **Phase 2: RLS Enforcement** (~1 hour)
   - Tests security policies
   - Verifies users can't see other users' data
   - Must pass before Phase 3

3. **Phase 3: Core Features** (~2 hours)
   - End-to-end workflows: signup → verify → browse → book → refer
   - Tests all API endpoints
   - All Critical tests must pass

4. **Phase 4: Edge Cases & Performance** (~1.5 hours)
   - Tests error handling and load
   - Optional performance benchmarks

To execute:
1. Open `docs/test-execution-checklist.md`
2. Follow Phase 1 first (database tests)
3. Mark each test as passing or failing
4. If all Phase 1 tests pass, proceed to Phase 2
5. Repeat for Phases 3 and 4

---

## Common Issues & Fixes

### "npm: command not found"
- You need to install Node.js from https://nodejs.org (LTS version recommended)
- After installing, restart your terminal

### ".env.local not found" error
- Create the `.env.local` file manually with the Supabase values
- Restart `npm run dev` after creating it

### "Cannot GET http://localhost:3000"
- Make sure `npm run dev` is running (you should see "ready" in terminal)
- Make sure you're not blocking port 3000 with another app

### "RLS violation" in Supabase queries
- This is expected behavior for non-admin users
- Make sure you're testing with the right user token
- Admin queries should work without RLS blocking

### "Storage bucket not found" when uploading files
- Make sure migration 0002 was applied (creates `airline-ids` bucket)
- Verify in Supabase Dashboard → Storage → you see "airline-ids" bucket

---

## Next Steps After Testing

Once all tests pass:
1. **Merge branches to main** — `git merge agent/web-backend` from the manager session
2. **Deploy to Vercel** — Connect Vercel to your GitHub repo
3. **Set up mobile app** — Create separate team in `~/Documents/dev/repos/PilotCarsApp/`
4. **Implement Stripe** — Future phase (placeholder fields already in schema)

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# View database schema
# (In Supabase Dashboard: SQL Editor → Tables list, or run):
# select table_name from information_schema.tables where table_schema='public';
```

---

## Support

- **Supabase docs:** https://supabase.com/docs
- **Next.js docs:** https://nextjs.org/docs
- **Test plan questions:** See `docs/test-execution-checklist.md` → Test Failure Troubleshooting section
