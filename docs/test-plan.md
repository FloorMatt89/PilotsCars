# Comprehensive Test Plan — PilotCars Booking Platform

## Overview

This test plan covers input validation, database constraints, Row Level Security (RLS) enforcement, and end-to-end workflows for the PilotCars booking platform. The goal is to verify that:

1. **Business rules are enforced** (verified users only, no overlapping bookings, 8% commission calculation)
2. **Database integrity is maintained** (unique constraints, foreign keys, default values)
3. **Security is tight** (RLS blocks unauthorized access, images are signed-URL-only)
4. **User data is isolated** (users cannot see or modify other users' data)

---

## Test Categories

Each test is labeled with its type:
- **Unit** — isolated function/constraint test
- **Integration** — multiple systems working together (API + DB)
- **E2E** — full user workflow from signup to booking

---

## 1. USER SIGNUP & VERIFICATION

### 1.1 Valid Email Signup
- **Type:** Integration
- **Priority:** Critical
- **Setup:** Fresh test database
- **Test:** User signs up with valid email (e.g., `test@example.com`)
- **Expected:** 
  - `auth.users` row created
  - `public.users` profile created with `id` matching auth.users
  - `is_verified = false` (default)
  - Unique `referral_code` generated (e.g., `PILOT-A1B2C3`)
- **Validates:** Correct signup flow, referral code generation, default values
- **Notes:** Requires Supabase Auth setup and API route for profile creation

### 1.2 Duplicate Email Rejection
- **Type:** Unit (DB constraint)
- **Priority:** Critical
- **Setup:** User 1 exists with email `alice@example.com`
- **Test:** Attempt to create User 2 with same email
- **Expected:** 
  - Unique constraint violation on `users.email`
  - Database rejects the insert
  - API returns 409 Conflict or similar
- **Validates:** Email uniqueness enforced at DB level
- **Notes:** Supabase Auth also prevents duplicate emails; this tests the backup DB constraint

### 1.3 Phone Number Validation
- **Type:** Unit (API layer)
- **Priority:** Medium
- **Test Cases:**
  - Valid: `+1-305-555-0123`, `(305) 555-0123`, `3055550123`
  - Invalid: empty string (allowed, optional), `123`, `abc-def-ghij`
- **Expected:** 
  - Valid formats accepted
  - Invalid formats rejected with clear error message
- **Validates:** Phone number format validation in API route
- **Notes:** Phone is optional; nulls are allowed

### 1.4 Airline ID Image Upload — File Type Validation
- **Type:** Integration (API + Storage)
- **Priority:** Critical
- **Setup:** Authenticated user, verified=false
- **Test Cases:**
  - Valid: `.jpg`, `.jpeg`, `.png`, `.pdf` (4MB max)
  - Invalid: `.txt`, `.exe`, `.mov` (wrong type)
  - Invalid: `.jpg` file >4MB (size limit)
- **Expected:**
  - Valid files accepted, object stored in `airline-ids/[user-id]/[filename]`
  - Invalid files rejected with error code (e.g., "Invalid file type")
  - File path stored in `users.airline_id_image_url`
- **Validates:** File type and size validation at API boundary
- **Security:** Ensures only documents are uploaded, prevents executable uploads

### 1.5 Airline ID Image Upload — Storage Access Control
- **Type:** Integration (RLS + Storage)
- **Priority:** Critical
- **Setup:** User A and User B both authenticated
- **Test:**
  - User A uploads image to `airline-ids/[user-a-id]/driver-license.jpg`
  - User A can read their own file
  - User B attempts to read User A's file
- **Expected:**
  - User A: read succeeds
  - User B: read fails (403 Forbidden)
  - Admin: read succeeds
- **Validates:** Storage RLS policy (foldername check)
- **Notes:** Policy checks `(storage.foldername(name))[1] = auth.uid()`

### 1.6 Unverified Users Cannot Book (RLS Enforces)
- **Type:** Integration (RLS + API)
- **Priority:** Critical
- **Setup:** 
  - User A: verified=false
  - Vehicle exists, available
- **Test:** User A attempts to create a booking
- **Expected:** 
  - Insert fails with RLS violation (23000 or similar)
  - API catches error and returns 403 Forbidden
  - Booking row not created
- **Validates:** `bookings_insert_verified_self` policy blocks unverified users
- **Notes:** Policy checks `exists (select 1 from users u where u.id = auth.uid() and u.is_verified = true)`

### 1.7 Admin Approves Airline ID → is_verified Flips to True
- **Type:** Integration (API + RLS)
- **Priority:** Critical
- **Setup:** 
  - User A: verified=false, airline_id_image_url set
  - Admin user (app_metadata.role='admin')
- **Test:** Admin updates User A's profile, sets `is_verified = true` and `verified_at = now()`
- **Expected:**
  - Update succeeds (admin has write permission via RLS)
  - `is_verified` changes to true
  - `verified_at` timestamp recorded
- **Validates:** Admin can update user verification, RLS allows admin write
- **Notes:** API should prevent regular users from setting is_verified themselves (separate admin-only endpoint)

### 1.8 Verified User Can Now Create Bookings
- **Type:** E2E
- **Priority:** Critical
- **Setup:** User A: verified=true, vehicle exists
- **Test:** User A creates booking
- **Expected:**
  - Booking created successfully
  - `status = 'pending'`, `created_at` recorded
  - Booking appears in User A's booking list (RLS allows)
- **Validates:** Happy path after verification
- **Notes:** Builds on test 1.7; user must be verified before proceeding

---

## 2. VEHICLE BROWSING

### 2.1 Authenticated Users Can See All Vehicles
- **Type:** Integration (RLS + API)
- **Priority:** High
- **Setup:** Authenticated User A, 10 vehicles in DB
- **Test:** User A fetches `/api/vehicles` or queries vehicles table
- **Expected:** 
  - Returns all 10 vehicles (location, make, model, type, rate, features, availability)
  - No filtering applied (all rows returned)
- **Validates:** `vehicles_select_authenticated` RLS policy
- **Notes:** Policy uses `to authenticated using (true)` → all auth users see all vehicles

### 2.2 Unauthenticated Users Cannot See Vehicles
- **Type:** Integration (RLS)
- **Priority:** High
- **Setup:** Unauthenticated session, vehicles in DB
- **Test:** Attempt to fetch vehicles without auth header/token
- **Expected:**
  - RLS denies access (403 Forbidden or empty result)
  - No vehicle data leaked
- **Validates:** RLS prevents anonymous access
- **Notes:** RLS policies only apply to `to authenticated`; unauthenticated requests fail

### 2.3 Filter by Location (Miami, Orlando)
- **Type:** Integration (API logic + DB)
- **Priority:** High
- **Setup:** 5 vehicles in Miami, 3 in Orlando
- **Test:** User queries `/api/vehicles?location=Miami`
- **Expected:**
  - Returns 5 vehicles (Miami only)
  - Uses `locations.city` index for fast lookup
- **Validates:** Location filter works, index used
- **Notes:** Filter applied in API layer before returning to client; RLS doesn't filter by location

### 2.4 Filter by Vehicle Type (Sedan, SUV, Van)
- **Type:** Integration (API logic + DB)
- **Priority:** High
- **Setup:** 3 sedans, 4 SUVs, 2 vans
- **Test:** User queries `/api/vehicles?type=sedan`
- **Expected:**
  - Returns 3 sedans
  - Uses `vehicles.vehicle_type` index
- **Validates:** Type filter works, index used
- **Notes:** Filter applied in API layer; RLS doesn't filter by type

### 2.5 Availability Flag Reflects Real-Time Bookings
- **Type:** Integration (API logic + bookings table)
- **Priority:** High
- **Setup:** Vehicle V with 1 pending booking (5/20–5/25)
- **Test Cases:**
  - Before booking: `is_available = true`
  - After booking created: API recalculates and reflects unavailability
  - User searches for vehicles 5/21–5/24: V should not appear (overlaps booking)
- **Expected:**
  - Vehicle shows unavailable for overlapping dates
  - Dates outside booking window show available
- **Validates:** Real-time availability calculation
- **Notes:** `is_available` flag is static; real-time checks use booking table overlap logic

---

## 3. BOOKING CREATION

### 3.1 Valid Booking (Pickup < Return Date)
- **Type:** Integration (API + RLS)
- **Priority:** Critical
- **Setup:** 
  - User A: verified=true
  - Vehicle V: available
  - Dates: pickup=5/20, return=5/25 (5 days, no overlap)
- **Test:** User A creates booking
- **Expected:**
  - Booking created with `status = 'pending'`
  - `total_price = 100 * 5 = 500` (daily_rate * num_days)
  - User A can see booking (RLS allows)
- **Validates:** Happy path, price calculation, RLS
- **Notes:** API must calculate `num_days = (return_date - pickup_date).days`

### 3.2 Invalid Dates (Return Before Pickup)
- **Type:** Unit (DB constraint)
- **Priority:** Critical
- **Setup:** Booking attempt with return=5/20, pickup=5/25
- **Test:** Create booking with invalid date order
- **Expected:**
  - Check constraint violation: `return_date >= pickup_date`
  - Database rejects insert
  - API returns 400 Bad Request with error
- **Validates:** Date order constraint enforced
- **Notes:** Also validate at API layer before hitting DB

### 3.3 Overlapping Bookings (Same Vehicle, Overlapping Dates)
- **Type:** Integration (DB + API)
- **Priority:** Critical
- **Setup:**
  - Booking 1: Vehicle V, 5/20–5/25, status=confirmed
  - Attempt Booking 2: Vehicle V, 5/23–5/28 (overlaps 5/23–5/25)
- **Test:** Create Booking 2
- **Expected:**
  - Insert fails with custom error
  - Database query detects overlap via booking overlap check
  - API returns 409 Conflict: "Vehicle unavailable for selected dates"
- **Validates:** Prevents double-booking
- **Notes:** Overlap check: `return_date >= pickup_date AND pickup_date <= other_return_date`; composite index on `(vehicle_id, pickup_date, return_date)` helps performance

### 3.4 Unverified Users Cannot Book (RLS Enforces)
- **Type:** Integration (RLS)
- **Priority:** Critical
- **Setup:** User A: verified=false
- **Test:** User A creates booking
- **Expected:** RLS policy blocks (see test 1.6)
- **Validates:** Verification gate works
- **Notes:** Retest from section 1 in full context; confirms gate persists

### 3.5 total_price Calculated Correctly
- **Type:** Unit (API logic)
- **Priority:** High
- **Setup:** 
  - Vehicle: daily_rate = 89.99
  - Booking: 5/20–5/27 (7 days)
- **Test Cases:**
  - 7 days: total = 89.99 * 7 = 629.93
  - 1 day (same-day return): total = 89.99 * 1 = 89.99
  - 14 days: total = 89.99 * 14 = 1259.86
- **Expected:** Total matches calculation
- **Validates:** Price calculation logic
- **Notes:** API must handle edge case: same pickup/return day = 1 day rental (not 0)

### 3.6 Users Can Only Create Bookings for Themselves (RLS Enforces)
- **Type:** Integration (RLS)
- **Priority:** Critical
- **Setup:** 
  - User A (verified)
  - User B (verified)
  - User A attempts to create booking with `user_id = User B's id`
- **Test:** Create booking for User B while logged in as User A
- **Expected:**
  - RLS policy blocks (user_id check fails)
  - Insert fails with 23000 or constraint violation
  - API returns 403 Forbidden
- **Validates:** `bookings_insert_verified_self` policy: `user_id = auth.uid()`
- **Notes:** Policy uses WITH CHECK clause on insert

### 3.7 Admins Can Create Bookings on Anyone's Behalf
- **Type:** Integration (RLS + Admin)
- **Priority:** High
- **Setup:**
  - Admin user (app_metadata.role='admin')
  - User B (may or may not be verified)
  - Admin creates booking for User B
- **Test:** Admin creates booking with `user_id = User B id`
- **Expected:**
  - Booking created (RLS allows admin)
  - Even if User B is unverified, booking succeeds (admin override)
- **Validates:** `public.is_admin()` bypasses verification check
- **Notes:** Policy: `public.is_admin() or (user_id = auth.uid() and is_verified)`

### 3.8 Cancelled Bookings Don't Block Vehicle Availability
- **Type:** Integration (API logic)
- **Priority:** High
- **Setup:**
  - Booking 1: Vehicle V, 5/20–5/25, status=cancelled
  - Attempt Booking 2: Vehicle V, 5/21–5/24
- **Test:** Create Booking 2
- **Expected:**
  - Booking 2 succeeds (cancelled doesn't block)
  - Only active statuses (pending, confirmed, completed) block availability
- **Validates:** Booking status logic
- **Notes:** Overlap check must exclude cancelled bookings

---

## 4. REFERRAL PROGRAM

### 4.1 User Gets Unique referral_code on Signup
- **Type:** Unit (DB function)
- **Priority:** High
- **Setup:** Fresh user signup
- **Test:** Check `public.referrals` table for new user
- **Expected:**
  - Row created with referrer_id = new user id
  - `referral_code` matches pattern `PILOT-[6 chars from base32]` (e.g., `PILOT-A1B2C3`)
  - Code is unique (no duplicates across table)
- **Validates:** `generate_referral_code()` function works, auto-generates on insert
- **Notes:** Function uses alphabet `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (no 0/O/1/I/L); retries on collision

### 4.2 referral_code is Shareable and Unique
- **Type:** Unit (DB constraint)
- **Priority:** High
- **Setup:** User A's code = `PILOT-ABC123`
- **Test Cases:**
  - Two users try to signup with User A's code
  - Query `select count(*) from referrals where referral_code = 'PILOT-ABC123'`
  - Try to manually insert duplicate code
- **Expected:**
  - Only 1 row per code in referrals table
  - Unique constraint on `referral_code` blocks duplicates
  - Both signups can proceed (code lookup is read-only)
- **Validates:** Unique constraint, code is sharable
- **Notes:** Referenced by referred users but not modified; only one row per code

### 4.3 When a Referred User Books, referrals Row is Created
- **Type:** Integration (API + DB triggers/logic)
- **Priority:** High
- **Setup:**
  - User A (referrer): referral_code = `PILOT-ABC123`
  - User B signs up using code `PILOT-ABC123`
  - User B (now verified) creates booking
- **Test:** Check if new row created in referrals table
- **Expected:**
  - After booking creation, API checks for referral code
  - If User B was referred, create row in referrals:
    - `referrer_id = User A id`
    - `referred_user_id = User B id`
    - `booking_id = new booking id`
    - `commission_earned = 0` (pending approval)
    - `status = 'pending'`
- **Validates:** Referral tracking on booking
- **Notes:** Referral code stored during signup (in `referral_user_id` or inferred); API must link on booking

### 4.4 Commission (8% of total_price) is Calculated Correctly
- **Type:** Unit (API logic)
- **Priority:** High
- **Setup:** 
  - Booking total_price = 500
  - Referral commission = 8% = 0.08 * 500 = 40
- **Test Cases:**
  - $500 booking → $40 commission
  - $1000 booking → $80 commission
  - $99.99 booking → $7.9992 ≈ $7.99 or $8.00 (rounding)
- **Expected:** Commission matches 8% calculation
- **Validates:** Commission math
- **Notes:** API calculates on booking; rounding should be handled (banker's rounding or ceil)

### 4.5 Referral Status Flow: Pending → Earned → Paid
- **Type:** Integration (Admin workflow)
- **Priority:** High
- **Setup:** Referral row exists with status=pending, commission_earned=0
- **Test:**
  1. Admin reviews referral
  2. Admin approves: sets status=earned, commission_earned=40
  3. Admin marks paid: status=paid, paid_at=now()
- **Expected:**
  - Each transition succeeds
  - Fields updated correctly
  - Timestamps recorded
- **Validates:** Referral lifecycle, admin permissions
- **Notes:** Only admins can update referrals (RLS policy)

### 4.6 Users Can Only See Their Own Referrals (RLS Enforces)
- **Type:** Integration (RLS)
- **Priority:** Critical
- **Setup:**
  - User A: referrer with 3 referrals (commission earned)
  - User B: different referrer
  - User A queries `/api/referrals`
- **Test:** User A views referral list
- **Expected:**
  - Only User A's 3 referrals returned (where referrer_id = User A id)
  - User B's referrals not visible
  - RLS policy blocks
- **Validates:** `referrals_select_own_or_admin` policy
- **Notes:** Policy: `referrer_id = auth.uid() or is_admin()`

### 4.7 Admins Can See All Referrals
- **Type:** Integration (RLS + Admin)
- **Priority:** High
- **Setup:** Admin user, 100+ referrals from different referrers
- **Test:** Admin queries `/api/referrals`
- **Expected:**
  - All 100+ referrals returned (no filtering by referrer_id)
  - Includes all statuses (pending, earned, paid)
- **Validates:** Admin bypass in RLS
- **Notes:** Policy: `public.is_admin()` returns true → all rows visible

---

## 5. RLS ENFORCEMENT (Critical Security Tests)

### 5.1 User A Cannot See User B's Profile
- **Type:** Integration (RLS)
- **Priority:** Critical
- **Setup:** 
  - User A (auth.uid = uuid-a)
  - User B (auth.uid = uuid-b)
  - User A queries users table or `/api/users/[uuid-b]`
- **Test:** Attempt to read User B's profile while logged in as User A
- **Expected:**
  - Query returns empty result or 403 Forbidden
  - No data leakage (email, phone, verification status hidden)
- **Validates:** `users_select_own_or_admin` policy: `id = auth.uid()`
- **Notes:** Use Supabase PostgREST API with auth token to test RLS directly

### 5.2 User A Cannot See User B's Bookings
- **Type:** Integration (RLS)
- **Priority:** Critical
- **Setup:**
  - User A (uuid-a) with 1 booking
  - User B (uuid-b) with 3 bookings
  - User A queries bookings table
- **Test:** User A lists all bookings
- **Expected:**
  - Only User A's 1 booking returned
  - User B's 3 bookings not visible
- **Validates:** `bookings_select_own_or_admin` policy
- **Notes:** Policy: `user_id = auth.uid() or is_admin()`

### 5.3 User A Cannot See User B's Referrals
- **Type:** Integration (RLS)
- **Priority:** Critical
- **Setup:**
  - User A: referrer
  - User B: different referrer
  - User A queries referrals table
- **Test:** User A lists referrals
- **Expected:**
  - Only User A's referrals returned
  - User B's referral earnings hidden
- **Validates:** `referrals_select_own_or_admin` policy
- **Notes:** Privacy of earnings protected by RLS

### 5.4 User A Cannot Update User B's Profile
- **Type:** Integration (RLS)
- **Priority:** Critical
- **Setup:**
  - User A attempts to update User B's `full_name` or `email`
- **Test:** Execute UPDATE query on User B's row while logged in as User A
- **Expected:**
  - RLS blocks update (0 rows affected)
  - No error message (silent failure or 403)
- **Validates:** `users_update_own_or_admin` policy WITH CHECK clause
- **Notes:** Policy: `id = auth.uid() or is_admin()` on both USING and WITH CHECK

### 5.5 User A Cannot Update User B's Bookings
- **Type:** Integration (RLS)
- **Priority:** Critical
- **Setup:**
  - User A attempts to update User B's booking (e.g., change status to cancelled)
- **Test:** Execute UPDATE booking SET status='cancelled' WHERE id=user-b-booking
- **Expected:**
  - RLS blocks (0 rows affected or 403)
- **Validates:** `bookings_update_own_or_admin` policy
- **Notes:** Protects booking integrity and prevents unauthorized cancellations

### 5.6 User A Cannot Mark Their Own Airline ID as Verified
- **Type:** Integration (API + RLS + trigger)
- **Priority:** Critical
- **Setup:** User A attempts to directly update `is_verified = true` on their profile
- **Test Cases:**
  - API layer rejects (401)
  - DB trigger/constraint blocks (if API layer is bypassed)
- **Expected:**
  - Update fails at API layer (only admin endpoint allows)
  - If API check is missing, DB should block via trigger or separate admin-only logic
- **Validates:** Users cannot self-verify
- **Notes:** Currently enforced by API layer (RLS allows users to update own row, but API must gate `is_verified` field); consider adding DB trigger for defense-in-depth

### 5.7 Only Admins Can Approve Airline IDs
- **Type:** Integration (API + RLS)
- **Priority:** Critical
- **Setup:**
  - Admin user (app_metadata.role='admin')
  - Regular user
  - Both attempt to update user.is_verified
- **Test:**
  - Admin: update allowed
  - Regular user: update blocked at API layer
- **Expected:**
  - Admin succeeds
  - Regular user gets 403 Forbidden
- **Validates:** Approval workflow restricted to admins
- **Notes:** Separate API endpoint `/api/admin/users/[id]/approve-verification` with admin check

---

## 6. DATABASE INTEGRITY

### 6.1 Foreign Key Cascades Work (Delete User → Delete Bookings/Referrals)
- **Type:** Unit (DB constraint)
- **Priority:** High
- **Setup:**
  - User A with 2 bookings and 3 referrals
  - User B referred by User A (referral row)
- **Test:** Delete User A's row from auth.users
- **Expected:**
  - User A's profile row deleted (cascade)
  - User A's 2 bookings deleted (cascade from users→bookings FK)
  - User A's referrals where referrer_id=User A deleted (cascade)
  - User B's referral.referred_user_id set to NULL (on delete set null)
- **Validates:** Cascading deletes, orphan handling
- **Notes:** Schema: users FK → bookings, referrals.referrer_id → users (cascade); referrals.referred_user_id (set null on delete)

### 6.2 Duplicate License Plates Rejected
- **Type:** Unit (DB constraint)
- **Priority:** High
- **Setup:** Vehicle 1 with license_plate = `ABC-1234`
- **Test:** Insert Vehicle 2 with license_plate = `ABC-1234`
- **Expected:**
  - Unique constraint violation on vehicles.license_plate
  - Database rejects insert
- **Validates:** License plate uniqueness
- **Notes:** Prevents vehicle duplication

### 6.3 Duplicate Email Addresses Rejected
- **Type:** Unit (DB constraint)
- **Priority:** Critical
- **Setup:** User A with email = `test@example.com`
- **Test:** Insert User B with email = `test@example.com`
- **Expected:**
  - Unique constraint violation on users.email
  - Database rejects
- **Validates:** Email uniqueness
- **Notes:** Also enforced by Supabase Auth; this tests DB-layer backup

### 6.4 Default Values Applied (is_verified=false, booking_status=pending, referral_status=pending)
- **Type:** Unit (DB defaults)
- **Priority:** High
- **Setup:** Insert rows without specifying defaults
- **Test Cases:**
  1. Insert user without `is_verified` → should default to false
  2. Insert booking without `status` → should default to 'pending'
  3. Insert referral without `status` → should default to 'pending'
- **Expected:**
  - All defaults applied correctly
  - Rows have expected values
- **Validates:** DB defaults work
- **Notes:** Schema: `is_verified boolean not null default false`, etc.

### 6.5 updated_at Timestamp is Maintained Automatically
- **Type:** Unit (DB trigger)
- **Priority:** Medium
- **Setup:** 
  - User profile created at T1
  - Wait 1 second
  - Update user's `full_name` at T2
- **Test:** Check `updated_at` value
- **Expected:**
  - Initial: `updated_at = T1` (created_at)
  - After update: `updated_at = T2` (current time)
  - Difference = ~1 second (or more)
- **Validates:** `set_updated_at()` trigger works
- **Notes:** Trigger on BEFORE UPDATE updates new.updated_at = now()

---

## 7. EDGE CASES & ERROR HANDLING

### 7.1 Booking with Nonexistent Vehicle ID (FK Fails)
- **Type:** Unit (DB constraint)
- **Priority:** High
- **Setup:** Vehicle ID `00000000-0000-0000-0000-000000000000` doesn't exist
- **Test:** Create booking with nonexistent vehicle_id
- **Expected:**
  - Foreign key constraint violation
  - Database rejects insert
  - API returns 400 Bad Request: "Vehicle not found"
- **Validates:** FK constraint on bookings.vehicle_id
- **Notes:** Prevents orphan bookings

### 7.2 Booking with Nonexistent Location ID (FK Fails)
- **Type:** Unit (DB constraint)
- **Priority:** High
- **Setup:** Location ID doesn't exist
- **Test:** Create booking with invalid location_id
- **Expected:**
  - FK constraint violation
  - Database rejects
- **Validates:** FK on bookings.location_id
- **Notes:** Similar to 7.1

### 7.3 Referral with Nonexistent Referrer or Referred User (Handles Gracefully)
- **Type:** Integration (Error handling)
- **Priority:** Medium
- **Setup:** Attempt to create referral with invalid user IDs
- **Test:** Insert referral with referrer_id or referred_user_id pointing to deleted user
- **Expected:**
  - FK constraint violation on referrer_id (not nullable)
  - If referred_user_id is null (allowed), insert succeeds
  - API returns 400 Bad Request if referrer invalid
- **Validates:** FK and null handling
- **Notes:** referrer_id is NOT NULL; referred_user_id is nullable (set null on delete)

### 7.4 Double-Booking Same Vehicle (EXCLUDE Constraint Prevents)
- **Type:** Unit (DB constraint)
- **Priority:** Critical
- **Setup:**
  - Booking 1: Vehicle V, 5/20–5/25, status=confirmed
  - Attempt Booking 2: Vehicle V, 5/22–5/27
- **Test:** Insert Booking 2
- **Expected:**
  - Overlap detected and rejected
  - Database prevents (via application-layer overlap check or constraint)
- **Validates:** Overlap prevention
- **Notes:** Note: PostgreSQL EXCLUDE constraint is powerful but not currently in schema; schema relies on application-layer overlap check. Verify this in API layer.

### 7.5 Admin Can Override Constraints (Special Role)
- **Type:** Integration (API + RLS)
- **Priority:** Medium
- **Setup:** Admin creates booking for unverified user or with invalid dates
- **Test Cases:**
  1. Admin creates booking for unverified user
  2. Admin creates booking with return < pickup
  3. Admin creates duplicate booking on same vehicle
- **Expected:**
  - Admin bypass enabled (RLS allows is_admin())
  - Check constraint still blocks invalid dates (DB-level)
  - Overlap check still applies (no double-booking)
  - Unverified gate may be bypassed by admin
- **Validates:** Admin power and safety boundaries
- **Notes:** Admins bypass RLS policy, but DB checks (date order, FKs) still apply

### 7.6 Image Upload with Invalid File Type (Handled by API Layer)
- **Type:** Integration (API validation)
- **Priority:** High
- **Setup:** User uploads `.exe` file as airline ID
- **Test:** POST to `/api/upload-airline-id` with exe file
- **Expected:**
  - API validates file type before uploading
  - Returns 400 Bad Request: "Invalid file type. Allowed: jpg, jpeg, png, pdf"
  - File not stored in bucket
- **Validates:** API-layer file validation
- **Notes:** Also set MIME type whitelist in Supabase Storage if possible

### 7.7 Image Storage Access (Only User's Own Images Accessible)
- **Type:** Integration (Storage RLS)
- **Priority:** Critical
- **Setup:**
  - User A uploads `airline-ids/[user-a-id]/id.jpg`
  - User B and Admin try to access
- **Test:**
  - User A: can read (signed URL works)
  - User B: cannot read (signed URL denied or empty)
  - Admin: can read
- **Expected:**
  - User A: 200 OK
  - User B: 403 Forbidden
  - Admin: 200 OK
- **Validates:** Storage RLS policy
- **Notes:** Policy checks `(storage.foldername(name))[1]` matches auth.uid()

---

## 8. PERFORMANCE & LOAD

### 8.1 Listing 1000+ Vehicles Performs Well (Index on location_id, vehicle_type)
- **Type:** Performance
- **Priority:** Medium
- **Setup:** Seed 1000 vehicles across multiple locations and types
- **Test:** Query all vehicles (no filters), measure query time
- **Expected:**
  - Query completes in <500ms
  - Execution plan uses sequential scan or index on location_id/vehicle_type
  - No full table scans
- **Validates:** Index presence and effectiveness
- **Notes:** Schema has: `create index vehicles_location_id_idx on public.vehicles (location_id);` and `create index vehicles_type_idx on public.vehicles (vehicle_type);`

### 8.2 Booking Overlap Check is Efficient (Composite Index on vehicle_id, dates)
- **Type:** Performance
- **Priority:** Medium
- **Setup:** Seed 1000 bookings on 100 vehicles
- **Test:** Check for overlaps on a popular vehicle with 50+ bookings
- **Expected:**
  - Overlap check completes in <100ms
  - Uses composite index on `(vehicle_id, pickup_date, return_date)`
- **Validates:** Index design
- **Notes:** Schema has: `create index bookings_vehicle_dates_idx on public.bookings (vehicle_id, pickup_date, return_date);`

### 8.3 JSON Features Search (@>) Uses GIN Index
- **Type:** Performance
- **Priority:** Low
- **Setup:** 1000 vehicles, each with features like `["GPS", "leather", "bluetooth"]`
- **Test:** Query vehicles where features @> '["GPS"]'
- **Expected:**
  - Query completes in <200ms
  - Uses GIN index on features
- **Validates:** GIN index on JSONB
- **Notes:** Schema has: `create index vehicles_features_gin_idx on public.vehicles using gin (features);`

### 8.4 Referral Code Lookup is Instant (Unique Constraint)
- **Type:** Performance
- **Priority:** Low
- **Setup:** 10,000 referrals with unique codes
- **Test:** Query referral by code: `select * from referrals where referral_code = 'PILOT-ABC123'`
- **Expected:**
  - Query completes in <10ms
  - Uses unique constraint as implicit index
- **Validates:** Unique constraint performance
- **Notes:** Schema: `referral_code text not null unique` → creates implicit index

---

## Test Execution Strategy

### Phase 1: Database Integrity (Unit Tests)
Run first to verify schema is sound before higher-level tests.
- Tests: 6.1–6.5, 7.1–7.4
- Tools: SQL client (e.g., pgAdmin, psql, or Supabase SQL Editor)
- Time: ~30 minutes

### Phase 2: RLS Enforcement (Integration Tests)
Run after Phase 1; critical for security.
- Tests: 5.1–5.7
- Tools: Supabase PostgREST API with different auth tokens
- Time: ~1 hour

### Phase 3: Core Features (E2E Tests)
Build up user workflows: signup → verify → browse → book → refer.
- Tests: 1.1–4.7
- Tools: Next.js API routes + browser + Supabase client
- Time: ~2 hours

### Phase 4: Edge Cases & Performance (Integration + Performance)
Verify error handling and scalability.
- Tests: 7.5–8.4
- Tools: API load testing (k6, JMeter), SQL EXPLAIN ANALYZE
- Time: ~1.5 hours

### Total Estimated Time: 4.5–5 hours for comprehensive coverage

---

## Testing Tools & Setup

### Required
- **Supabase SQL Editor** — Run DB tests directly
- **Supabase Dashboard** — View data, manage auth users, inspect RLS
- **PostgREST API** — Test RLS with curl or Postman
- **Next.js Dev Server** — Test API routes and full workflows
- **Browser DevTools** — Check console errors, network requests
- **psql or Supabase CLI** — Run migrations, seed test data

### Optional
- **Postman** — API testing with saved requests
- **k6 or JMeter** — Load testing for performance tests
- **pgAdmin** — Visual DB inspection
- **Supabase Studio** — Table inspection

### Test Data Seeding

Create a seed script `seed-test-data.sql` to populate:
1. Test users (verified and unverified)
2. Admin user (with app_metadata.role='admin')
3. Locations (Miami, Orlando)
4. Vehicles (mix of types, locations, rates)
5. Bookings (overlapping, future, past)
6. Referrals (various statuses)

Example snippet:
```sql
-- Insert locations
insert into public.locations (id, name, city, address) values
  (gen_random_uuid(), 'Miami Airport', 'Miami', '2100 NW 42nd Ave, Miami, FL 33142'),
  (gen_random_uuid(), 'Orlando Downtown', 'Orlando', '123 Main St, Orlando, FL 32801');

-- Insert vehicles
insert into public.vehicles (location_id, make, model, year, color, license_plate, vehicle_type, daily_rate, features) values
  ((select id from locations where city='Miami'), 'Toyota', 'Camry', 2023, 'Silver', 'ABC-1234', 'sedan', 89.99, '["GPS", "leather"]'),
  ((select id from locations where city='Miami'), 'Honda', 'CR-V', 2023, 'Black', 'ABC-1235', 'suv', 129.99, '["GPS", "backup camera"]');
```

---

## Known Limitations & Caveats

1. **File uploads:** Testing requires valid image files; mock file uploads may not fully test storage RLS.
2. **Email verification:** Supabase Auth handles email uniqueness; schema backup constraint also prevents duplicates.
3. **Admin provisioning:** Testing admins requires manual JWT modification or Supabase CLI to set `app_metadata.role='admin'`.
4. **Overlap detection:** Currently relies on application-layer logic; no DB EXCLUDE constraint yet. Verify overlap logic is bulletproof.
5. **Timezone handling:** Dates and times should be stored/compared in UTC; test with multiple timezones.
6. **Concurrency:** Double-booking prevention must handle concurrent inserts; test with simultaneous requests.

---

## Regression Testing Checklist

After schema changes or API updates, re-run these critical tests:
- [ ] 1.6: Unverified users blocked from booking
- [ ] 3.3: Overlapping bookings prevented
- [ ] 3.6: Users can't book for others
- [ ] 5.1–5.7: All RLS policies intact
- [ ] 6.1–6.3: Cascades and constraints work

---

## Sign-Off

Once all tests pass:
- [ ] Database schema is secure (RLS enforced)
- [ ] Business rules are enforced (verification, overlap, commission)
- [ ] User data is isolated (RLS + API layer)
- [ ] Edge cases handled gracefully (error messages, foreign keys)
- [ ] Performance is acceptable (indexes in place, queries fast)
- [ ] Ready for feature development and production deployment

