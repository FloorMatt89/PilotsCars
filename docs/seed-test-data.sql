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
-- NOTE: Using unique license plates to avoid conflicts with existing data
INSERT INTO public.vehicles (location_id, make, model, year, color, license_plate, vehicle_type, daily_rate, is_available, features, mileage)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Toyota', 'Corolla', 2023, 'White', 'XYZ-9001', 'sedan'::public.vehicle_type, 79.99, true, '["GPS", "bluetooth"]'::jsonb, 5000),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Honda', 'Civic', 2023, 'Blue', 'XYZ-9002', 'sedan'::public.vehicle_type, 79.99, true, '["GPS", "backup camera"]'::jsonb, 8000),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Mazda', 'CX-5', 2023, 'Red', 'XYZ-9003', 'suv'::public.vehicle_type, 119.99, true, '["GPS", "leather", "bluetooth"]'::jsonb, 12000),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Toyota', 'Highlander', 2022, 'Silver', 'XYZ-9004', 'suv'::public.vehicle_type, 139.99, true, '["GPS", "leather", "backup camera"]'::jsonb, 20000)
ON CONFLICT (license_plate) DO NOTHING;

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

INSERT INTO public.users (id, email, full_name, phone, airline_id_image_url, is_verified, verified_at)
VALUES
  (
    'aaaaaaaa-bbbb-cccc-dddd-111111111111'::uuid,
    'alice@test.com',
    'Alice Johnson',
    '+1-305-555-1001',
    NULL,
    true,
    now() - interval '30 days'
  ),
  (
    'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid,
    'bob@test.com',
    'Bob Smith',
    '+1-305-555-1002',
    NULL,
    true,
    now() - interval '20 days'
  ),
  (
    'cccccccc-dddd-eeee-ffff-333333333333'::uuid,
    'charlie@test.com',
    'Charlie Brown',
    '+1-407-555-1003',
    NULL,
    false,
    NULL
  ),
  (
    'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
    'diana@test.com',
    'Diana Prince',
    '+1-305-555-1004',
    NULL,
    true,
    now() - interval '15 days'
  ),
  (
    'eeeeeeee-ffff-aaaa-bbbb-555555555555'::uuid,
    'eve@test.com',
    'Eve Wilson',
    '+1-305-555-1005',
    NULL,
    true,
    now() - interval '10 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Step 4: Create test bookings with various statuses
-- ============================================================================

-- Alice's bookings (2 completed)
INSERT INTO public.bookings (user_id, vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time, status, total_price, notes)
SELECT
  'aaaaaaaa-bbbb-cccc-dddd-111111111111'::uuid,
  (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9001' LIMIT 1),
  '11111111-1111-1111-1111-111111111111'::uuid,
  now() - interval '60 days',
  now() - interval '55 days',
  '09:00:00'::time,
  '17:00:00'::time,
  'completed'::public.booking_status,
  449.95,
  'Trip to Miami Beach'
UNION ALL
SELECT
  'aaaaaaaa-bbbb-cccc-dddd-111111111111'::uuid,
  (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9002' LIMIT 1),
  '11111111-1111-1111-1111-111111111111'::uuid,
  now() - interval '30 days',
  now() - interval '27 days',
  '10:00:00'::time,
  '18:00:00'::time,
  'completed'::public.booking_status,
  389.97,
  'Airport transport';

-- Bob's bookings (1 pending, 1 confirmed)
INSERT INTO public.bookings (user_id, vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time, status, total_price, notes)
SELECT
  'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid,
  (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9003' LIMIT 1),
  '11111111-1111-1111-1111-111111111111'::uuid,
  now() + interval '5 days',
  now() + interval '8 days',
  '08:00:00'::time,
  '16:00:00'::time,
  'pending'::public.booking_status,
  359.97,
  'Upcoming weekend trip'
UNION ALL
SELECT
  'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid,
  (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9001' LIMIT 1),
  '11111111-1111-1111-1111-111111111111'::uuid,
  now() + interval '20 days',
  now() + interval '25 days',
  '09:00:00'::time,
  '17:00:00'::time,
  'confirmed'::public.booking_status,
  399.95,
  'Business trip';

-- Diana's bookings (2 completed, 1 cancelled)
INSERT INTO public.bookings (user_id, vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time, status, total_price, notes)
SELECT
  'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
  (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9004' LIMIT 1),
  '33333333-3333-3333-3333-333333333333'::uuid,
  now() - interval '45 days',
  now() - interval '40 days',
  '10:00:00'::time,
  '16:00:00'::time,
  'completed'::public.booking_status,
  699.95,
  'Orlando conference'
UNION ALL
SELECT
  'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
  (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9002' LIMIT 1),
  '11111111-1111-1111-1111-111111111111'::uuid,
  now() - interval '15 days',
  now() - interval '12 days',
  '09:00:00'::time,
  '18:00:00'::time,
  'completed'::public.booking_status,
  239.97,
  'Crew layover'
UNION ALL
SELECT
  'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
  (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9001' LIMIT 1),
  '11111111-1111-1111-1111-111111111111'::uuid,
  now() + interval '10 days',
  now() + interval '12 days',
  '10:00:00'::time,
  '17:00:00'::time,
  'cancelled'::public.booking_status,
  159.98,
  'Cancelled due to flight change';

-- Eve's bookings (1 completed)
INSERT INTO public.bookings (user_id, vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time, status, total_price, notes)
SELECT
  'eeeeeeee-ffff-aaaa-bbbb-555555555555'::uuid,
  (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9003' LIMIT 1),
  '11111111-1111-1111-1111-111111111111'::uuid,
  now() - interval '5 days',
  now() - interval '3 days',
  '07:00:00'::time,
  '19:00:00'::time,
  'completed'::public.booking_status,
  239.98,
  'Short crew rotation';

-- ============================================================================
-- Step 5: Create test referrals with various commission amounts and statuses
-- ============================================================================
-- NOTE: Referral codes are auto-generated by the database function
-- We only set commission_earned based on the associated booking's total_price * 0.08

-- Alice referred Bob → Bob made booking → commission earned
INSERT INTO public.referrals (referrer_id, referred_user_id, booking_id, commission_earned, status, paid_at)
SELECT
  'aaaaaaaa-bbbb-cccc-dddd-111111111111'::uuid,
  'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid,
  b.id,
  b.total_price * 0.08,
  'earned'::public.referral_status,
  now() - interval '2 days'
FROM public.bookings b
WHERE b.user_id = 'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid
  AND b.status = 'pending'::public.booking_status
LIMIT 1;

-- Bob referred Diana → Diana made booking → commission earned
INSERT INTO public.referrals (referrer_id, referred_user_id, booking_id, commission_earned, status, paid_at)
SELECT
  'bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid,
  'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
  b.id,
  b.total_price * 0.08,
  'earned'::public.referral_status,
  now() - interval '5 days'
FROM public.bookings b
WHERE b.user_id = 'dddddddd-eeee-ffff-aaaa-444444444444'::uuid
  AND b.status = 'completed'::public.booking_status
LIMIT 1;

-- Diana referred Eve → Eve made booking → commission earned and paid
INSERT INTO public.referrals (referrer_id, referred_user_id, booking_id, commission_earned, status, paid_at)
SELECT
  'dddddddd-eeee-ffff-aaaa-444444444444'::uuid,
  'eeeeeeee-ffff-aaaa-bbbb-555555555555'::uuid,
  b.id,
  b.total_price * 0.08,
  'paid'::public.referral_status,
  now() - interval '1 day'
FROM public.bookings b
WHERE b.user_id = 'eeeeeeee-ffff-aaaa-bbbb-555555555555'::uuid
  AND b.status = 'completed'::public.booking_status
LIMIT 1;

-- Eve has a pending referral (referred user hasn't booked yet)
INSERT INTO public.referrals (referrer_id, referred_user_id, booking_id, commission_earned, status, paid_at)
VALUES
  (
    'eeeeeeee-ffff-aaaa-bbbb-555555555555'::uuid,
    'cccccccc-dddd-eeee-ffff-333333333333'::uuid,
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
