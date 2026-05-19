-- ============================================================================
-- PilotCars — Seed Bookings and Referrals (Assumes Users Exist)
-- ============================================================================
-- This script seeds bookings and referrals using the existing user profiles.
-- Run this AFTER users exist in the public.users table.
--
-- Usage:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy this entire script
-- 3. Paste and run
--
-- Expected: 8 bookings created, 4 referrals created
-- ============================================================================

-- Step 1: Create completed bookings for users (past dates)
INSERT INTO public.bookings (user_id, vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time, status, total_price, notes)
VALUES
  ((SELECT id FROM public.users WHERE email = 'alice@test.com' LIMIT 1),
   (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9001' LIMIT 1),
   (SELECT id FROM public.locations WHERE city = 'Miami' LIMIT 1),
   CURRENT_DATE - 60, CURRENT_DATE - 55, '09:00:00', '17:00:00', 'completed'::public.booking_status, 449.95, 'Trip to Miami Beach'),

  ((SELECT id FROM public.users WHERE email = 'alice@test.com' LIMIT 1),
   (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9002' LIMIT 1),
   (SELECT id FROM public.locations WHERE city = 'Miami' LIMIT 1),
   CURRENT_DATE - 30, CURRENT_DATE - 27, '10:00:00', '18:00:00', 'completed'::public.booking_status, 239.97, 'Airport transport'),

  ((SELECT id FROM public.users WHERE email = 'bob@test.com' LIMIT 1),
   (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9003' LIMIT 1),
   (SELECT id FROM public.locations WHERE city = 'Miami' LIMIT 1),
   CURRENT_DATE - 15, CURRENT_DATE - 10, '08:00:00', '16:00:00', 'completed'::public.booking_status, 359.97, 'Crew rotation'),

  ((SELECT id FROM public.users WHERE email = 'diana@test.com' LIMIT 1),
   (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9004' LIMIT 1),
   (SELECT id FROM public.locations WHERE city = 'Orlando' LIMIT 1),
   CURRENT_DATE - 45, CURRENT_DATE - 40, '10:00:00', '16:00:00', 'completed'::public.booking_status, 699.95, 'Orlando conference'),

  ((SELECT id FROM public.users WHERE email = 'diana@test.com' LIMIT 1),
   (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9002' LIMIT 1),
   (SELECT id FROM public.locations WHERE city = 'Miami' LIMIT 1),
   CURRENT_DATE - 15, CURRENT_DATE - 12, '09:00:00', '18:00:00', 'completed'::public.booking_status, 239.97, 'Crew layover'),

  ((SELECT id FROM public.users WHERE email = 'eve@test.com' LIMIT 1),
   (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9003' LIMIT 1),
   (SELECT id FROM public.locations WHERE city = 'Miami' LIMIT 1),
   CURRENT_DATE - 5, CURRENT_DATE - 3, '07:00:00', '19:00:00', 'completed'::public.booking_status, 239.98, 'Short crew rotation')
ON CONFLICT DO NOTHING;

-- Step 2: Create pending/confirmed bookings (future dates)
INSERT INTO public.bookings (user_id, vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time, status, total_price, notes)
VALUES
  ((SELECT id FROM public.users WHERE email = 'bob@test.com' LIMIT 1),
   (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9003' LIMIT 1),
   (SELECT id FROM public.locations WHERE city = 'Miami' LIMIT 1),
   CURRENT_DATE + 5, CURRENT_DATE + 8, '08:00:00', '16:00:00', 'pending'::public.booking_status, 359.97, 'Upcoming weekend trip'),

  ((SELECT id FROM public.users WHERE email = 'bob@test.com' LIMIT 1),
   (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9001' LIMIT 1),
   (SELECT id FROM public.locations WHERE city = 'Miami' LIMIT 1),
   CURRENT_DATE + 20, CURRENT_DATE + 25, '09:00:00', '17:00:00', 'confirmed'::public.booking_status, 399.95, 'Business trip'),

  ((SELECT id FROM public.users WHERE email = 'diana@test.com' LIMIT 1),
   (SELECT id FROM public.vehicles WHERE license_plate = 'XYZ-9001' LIMIT 1),
   (SELECT id FROM public.locations WHERE city = 'Miami' LIMIT 1),
   CURRENT_DATE + 10, CURRENT_DATE + 12, '10:00:00', '17:00:00', 'cancelled'::public.booking_status, 159.98, 'Cancelled due to flight change')
ON CONFLICT DO NOTHING;

-- Step 3: Create referrals (Alice → Bob → Diana → Eve → Charlie)
INSERT INTO public.referrals (referrer_id, referred_user_id, commission_earned, status, paid_at)
VALUES
  ((SELECT id FROM public.users WHERE email = 'alice@test.com' LIMIT 1),
   (SELECT id FROM public.users WHERE email = 'bob@test.com' LIMIT 1),
   43.20, 'earned'::public.referral_status, NOW() - interval '2 days'),

  ((SELECT id FROM public.users WHERE email = 'bob@test.com' LIMIT 1),
   (SELECT id FROM public.users WHERE email = 'diana@test.com' LIMIT 1),
   59.99, 'earned'::public.referral_status, NOW() - interval '5 days'),

  ((SELECT id FROM public.users WHERE email = 'diana@test.com' LIMIT 1),
   (SELECT id FROM public.users WHERE email = 'eve@test.com' LIMIT 1),
   28.80, 'paid'::public.referral_status, NOW() - interval '1 day'),

  ((SELECT id FROM public.users WHERE email = 'eve@test.com' LIMIT 1),
   (SELECT id FROM public.users WHERE email = 'charlie@test.com' LIMIT 1),
   0, 'pending'::public.referral_status, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION — Run these to confirm data was created
-- ============================================================================

SELECT '=== BOOKINGS ===' as section;
SELECT
  u.email,
  COUNT(*) as booking_count,
  SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
  SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
FROM public.bookings b
JOIN public.users u ON b.user_id = u.id
GROUP BY u.id, u.email
ORDER BY u.email;

SELECT '=== REFERRAL COMMISSIONS ===' as section;
SELECT
  u.email,
  COUNT(*) as referral_count,
  ROUND(SUM(CASE WHEN r.status = 'earned' THEN r.commission_earned ELSE 0 END)::numeric, 2) as earned_amount,
  ROUND(SUM(CASE WHEN r.status = 'paid' THEN r.commission_earned ELSE 0 END)::numeric, 2) as paid_amount
FROM public.referrals r
JOIN public.users u ON r.referrer_id = u.id
GROUP BY u.id, u.email
ORDER BY u.email;
