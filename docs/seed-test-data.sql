-- ============================================================================
-- PilotCars Test Data Seeding Script
-- ============================================================================
-- This script creates realistic test data including:
-- - Multiple users with different verification states
-- - Locations and vehicles
-- - Bookings with various statuses (pending, confirmed, completed, cancelled)
-- - Referrals with different commission amounts and statuses
--
-- IMPORTANT: Before running this script, you must create the auth users in
-- Supabase Dashboard → Authentication → Users with these exact emails.
-- Use the UUIDs below as the user IDs when creating them.
-- ============================================================================

-- Step 1: Create test locations (if not already seeded)
INSERT INTO public.locations (id, name, city, address, phone, hours_open)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Miami Airport Rental', 'Miami', '2100 NW 42nd Ave, Miami, FL 33142', '+1-305-555-0100', '6am-11pm'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Downtown Miami', 'Miami', '100 Biscayne Blvd, Miami, FL 33132', '+1-305-555-0101', '7am-9pm'),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Orlando Downtown', 'Orlando', '123 Main St, Orlando, FL 32801', '+1-407-555-0200', '7am-10pm')
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create test vehicles (if not already seeded)
INSERT INTO public.vehicles (id, location_id, make, model, year, color, license_plate, vehicle_type, daily_rate, is_available, features, mileage)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Toyota', 'Camry', 2023, 'Silver', 'ABC-1234', 'sedan'::public.vehicle_type, 89.99, true, '["GPS", "leather", "backup camera"]'::jsonb, 15000),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Honda', 'CR-V', 2023, 'Black', 'ABC-1240', 'suv'::public.vehicle_type, 129.99, true, '["GPS", "backup camera", "bluetooth"]'::jsonb, 10000),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Toyota', 'Sienna', 2023, 'Gray', 'ABC-1250', 'van'::public.vehicle_type, 179.99, true, '["GPS", "bluetooth"]'::jsonb, 8000),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'Honda', 'Pilot', 2022, 'White', 'ABC-1241', 'suv'::public.vehicle_type, 149.99, true, '["GPS", "leather", "backup camera"]'::jsonb, 25000)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Step 3: Create test user profiles
-- ============================================================================
-- IMPORTANT: You must create corresponding auth users in Supabase Dashboard
-- using these exact UUIDs and emails. Go to:
-- Supabase Dashboard → Authentication → Users → Add User
--
-- User 1: alice@test.com (Verified, has 2 completed bookings + 1 referral)
-- User 2: bob@test.com (Verified, has 1 pending booking, earned 8% referral)
-- User 3: charlie@test.com (Unverified, no bookings)
-- User 4: diana@test.com (Verified, has 3 bookings including cancelled)
-- User 5: eve@test.com (Verified, earned 2 referral commissions)
-- ============================================================================

INSERT INTO public.users (id, email, full_name, phone, airline_id_image_url, is_verified, verified_at, referral_code)
VALUES
  (
    'aaaaaaaa-bbbb-cccc-dddd-111111111111'::uuid,
    'alice@test.com',
    'Alice Johnson',
    '+1-305-555-1001',
    NULL,
    true,
    now() - interval '30 days',
    'PILOT-ALICE1'
  ),
  (
    'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid,
    'bob@test.com',
    'Bob Smith',
    '+1-305-555-1002',
    NULL,
    true,
    now() - interval '20 days',
    'PILOT-BOB2222'
  ),
  (
    'cccccccc-dddd-eeee-ffff-333333333333'::uuid,
    'charlie@test.com',
    'Charlie Brown',
    '+1-407-555-1003',
    NULL,
    false,
    NULL,
    'PILOT-CHAR03'
  ),
  (
    'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
    'diana@test.com',
    'Diana Prince',
    '+1-305-555-1004',
    NULL,
    true,
    now() - interval '15 days',
    'PILOT-DIANA4'
  ),
  (
    'eeeeeeee-ffff-aaaa-bbbb-555555555555'::uuid,
    'eve@test.com',
    'Eve Wilson',
    '+1-305-555-1005',
    NULL,
    true,
    now() - interval '10 days',
    'PILOT-EVE555'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Step 4: Create test bookings with various statuses
-- ============================================================================

-- Alice's bookings (2 completed)
INSERT INTO public.bookings (id, user_id, vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time, status, total_price, notes)
VALUES
  (
    '11111111-2222-3333-4444-555555555555'::uuid,
    'aaaaaaaa-bbbb-cccc-dddd-111111111111'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    now() - interval '60 days',
    now() - interval '55 days',
    '09:00:00'::time,
    '17:00:00'::time,
    'completed'::public.booking_status,
    449.95,
    'Trip to Miami Beach'
  ),
  (
    '11111111-2222-3333-4444-666666666666'::uuid,
    'aaaaaaaa-bbbb-cccc-dddd-111111111111'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    now() - interval '30 days',
    now() - interval '27 days',
    '10:00:00'::time,
    '18:00:00'::time,
    'completed'::public.booking_status,
    389.97,
    'Airport transport'
  );

-- Bob's bookings (1 pending, 1 confirmed)
INSERT INTO public.bookings (id, user_id, vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time, status, total_price, notes)
VALUES
  (
    '22222222-3333-4444-5555-666666666666'::uuid,
    'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    now() + interval '5 days',
    now() + interval '8 days',
    '08:00:00'::time,
    '16:00:00'::time,
    'pending'::public.booking_status,
    539.97,
    'Upcoming weekend trip'
  ),
  (
    '22222222-3333-4444-5555-777777777777'::uuid,
    'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    now() + interval '20 days',
    now() + interval '25 days',
    '09:00:00'::time,
    '17:00:00'::time,
    'confirmed'::public.booking_status,
    449.95,
    'Business trip'
  );

-- Diana's bookings (2 completed, 1 cancelled)
INSERT INTO public.bookings (id, user_id, vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time, status, total_price, notes)
VALUES
  (
    '33333333-4444-5555-6666-777777777777'::uuid,
    'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    now() - interval '45 days',
    now() - interval '40 days',
    '10:00:00'::time,
    '16:00:00'::time,
    'completed'::public.booking_status,
    749.95,
    'Orlando conference'
  ),
  (
    '33333333-4444-5555-6666-888888888888'::uuid,
    'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    now() - interval '15 days',
    now() - interval '12 days',
    '09:00:00'::time,
    '18:00:00'::time,
    'completed'::public.booking_status,
    389.97,
    'Crew layover'
  ),
  (
    '33333333-4444-5555-6666-999999999999'::uuid,
    'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    now() + interval '10 days',
    now() + interval '12 days',
    '10:00:00'::time,
    '17:00:00'::time,
    'cancelled'::public.booking_status,
    179.98,
    'Cancelled due to flight change'
  );

-- Eve's bookings (1 completed)
INSERT INTO public.bookings (id, user_id, vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time, status, total_price, notes)
VALUES
  (
    '44444444-5555-6666-7777-888888888888'::uuid,
    'eeeeeeee-ffff-aaaa-bbbb-555555555555'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    now() - interval '5 days',
    now() - interval '3 days',
    '07:00:00'::time,
    '19:00:00'::time,
    'completed'::public.booking_status,
    359.98,
    'Short crew rotation'
  );

-- ============================================================================
-- Step 5: Create test referrals with various commission amounts and statuses
-- ============================================================================

-- Alice referred Bob → Bob made booking → commission earned
INSERT INTO public.referrals (id, referrer_id, referred_user_id, referral_code, booking_id, commission_earned, status, paid_at)
VALUES
  (
    '55555555-6666-7777-8888-999999999999'::uuid,
    'aaaaaaaa-bbbb-cccc-dddd-111111111111'::uuid,
    'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid,
    'PILOT-ALICE1',
    '22222222-3333-4444-5555-666666666666'::uuid,
    43.20,  -- 8% of 539.97
    'earned'::public.referral_status,
    now() - interval '2 days'
  );

-- Bob referred Diana → Diana made booking → commission earned
INSERT INTO public.referrals (id, referrer_id, referred_user_id, referral_code, booking_id, commission_earned, status, paid_at)
VALUES
  (
    '66666666-7777-8888-9999-aaaaaaaaaaaa'::uuid,
    'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid,
    'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
    'PILOT-BOB2222',
    '33333333-4444-5555-6666-777777777777'::uuid,
    59.99,  -- 8% of 749.95
    'earned'::public.referral_status,
    now() - interval '5 days'
  );

-- Diana referred Eve → Eve made booking → commission earned and paid
INSERT INTO public.referrals (id, referrer_id, referred_user_id, referral_code, booking_id, commission_earned, status, paid_at)
VALUES
  (
    '77777777-8888-9999-aaaa-bbbbbbbbbbbb'::uuid,
    'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
    'eeeeeeee-ffff-aaaa-bbbb-555555555555'::uuid,
    'PILOT-DIANA4',
    '44444444-5555-6666-7777-888888888888'::uuid,
    28.80,  -- 8% of 359.98
    'paid'::public.referral_status,
    now() - interval '1 day'
  );

-- Eve has a pending referral (referred user hasn't booked yet)
INSERT INTO public.referrals (id, referrer_id, referred_user_id, referral_code, booking_id, commission_earned, status, paid_at)
VALUES
  (
    '88888888-9999-aaaa-bbbb-cccccccccccc'::uuid,
    'eeeeeeee-ffff-aaaa-bbbb-555555555555'::uuid,
    'cccccccc-dddd-eeee-ffff-333333333333'::uuid,
    'PILOT-EVE555',
    NULL,  -- No booking yet, so no commission
    0.00,
    'pending'::public.referral_status,
    NULL
  );

-- ============================================================================
-- VERIFICATION STEPS
-- ============================================================================
-- After running this script, verify the data was created:

-- 1. Check users were created:
-- SELECT id, email, full_name, is_verified FROM public.users;

-- 2. Check bookings exist with correct statuses:
-- SELECT id, user_id, status, total_price FROM public.bookings ORDER BY created_at DESC;

-- 3. Check referrals and commissions:
-- SELECT
--   r.id,
--   u.email as referrer_email,
--   r.commission_earned,
--   r.status,
--   r.paid_at
-- FROM public.referrals r
-- JOIN public.users u ON r.referrer_id = u.id;

-- 4. Verify referral totals (Alice: $43.20, Bob: $59.99, Diana: $28.80, Eve: $0 pending):
-- SELECT
--   u.email,
--   SUM(CASE WHEN r.status = 'earned' THEN r.commission_earned ELSE 0 END) as earned,
--   SUM(CASE WHEN r.status = 'paid' THEN r.commission_earned ELSE 0 END) as paid
-- FROM public.users u
-- LEFT JOIN public.referrals r ON u.id = r.referrer_id
-- GROUP BY u.id, u.email;

-- ============================================================================
-- IMPORTANT: Create the auth users before using this data
-- ============================================================================
-- You must manually create these users in:
-- Supabase Dashboard → Authentication → Users → Add User
--
-- User 1:
--   Email: alice@test.com
--   Password: alice1234 (or your choice)
--   User ID: aaaaaaaa-bbbb-cccc-dddd-111111111111
--
-- User 2:
--   Email: bob@test.com
--   Password: bob1234
--   User ID: bbbbbbbb-cccc-dddd-eeee-222222222222
--
-- User 3 (for testing unverified):
--   Email: charlie@test.com
--   Password: charlie1234
--   User ID: cccccccc-dddd-eeee-ffff-333333333333
--
-- User 4:
--   Email: diana@test.com
--   Password: diana1234
--   User ID: dddddddd-eeee-ffff-aaaa-444444444444
--
-- User 5:
--   Email: eve@test.com
--   Password: eve1234
--   User ID: eeeeeeee-ffff-aaaa-bbbb-555555555555
--
-- Admin user (for testing admin approval):
--   Email: admin@test.com
--   Password: admin1234
--   User ID: ffffffff-ffff-ffff-ffff-ffffffffffff
--   App Metadata: { "role": "admin" }
--
-- To set the User ID when creating auth users:
-- 1. Click "Create new user" in Supabase Dashboard
-- 2. Enter email and password
-- 3. Copy the generated User ID
-- 4. Click the user → Edit → change User ID to match above
-- 5. Save
--
-- OR use Supabase API to create users with specific IDs (requires CLI or scripting)
