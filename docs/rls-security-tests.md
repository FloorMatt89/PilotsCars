# RLS & Security Test Suite — PilotCars

Detailed security and Row Level Security (RLS) tests. Run these tests with Supabase PostgREST API using different auth tokens to verify that RLS policies are correctly enforced.

---

## Prerequisites

### Test Users
Create these test users in Supabase Dashboard → Authentication (or via signup API):

```
User Type | Email              | UUID              | JWT Claims              | Notes
----------|--------------------|--------------------|-------------------------|----------
Regular   | alice@test.com     | uuid-alice        | role=user (default)     | Standard crew member
Regular   | bob@test.com       | uuid-bob          | role=user (default)     | Another crew member
Admin     | admin@test.com     | uuid-admin        | role='admin'            | Dashboard user
Unauth    | (none)             | null               | (no token)              | Anonymous visitor
```

### How to Set Admin Role
In Supabase Dashboard:
1. Go to Authentication → Users
2. Find admin@test.com
3. Click the three dots menu → "Edit user"
4. Find "App Metadata" section
5. Paste: `{"role":"admin"}`
6. Save

### Test Tools
- **Supabase PostgREST API:** `https://[project-id].supabase.co/rest/v1/`
- **Authorization Header:** `Authorization: Bearer [JWT_TOKEN]`
- **curl example:**
  ```bash
  curl -H "Authorization: Bearer $JWT_TOKEN" \
    https://[project-id].supabase.co/rest/v1/users?select=id,email,is_verified
  ```

---

## RLS Policy Reference

### Table: users
| Policy | Target | Condition |
|--------|--------|-----------|
| users_select_own_or_admin | SELECT | `id = auth.uid() OR is_admin()` |
| users_insert_self | INSERT | `id = auth.uid()` |
| users_update_own_or_admin | UPDATE | `id = auth.uid() OR is_admin()` |
| users_delete_admin | DELETE | `is_admin()` |

### Table: bookings
| Policy | Target | Condition |
|--------|--------|-----------|
| bookings_select_own_or_admin | SELECT | `user_id = auth.uid() OR is_admin()` |
| bookings_insert_verified_self | INSERT | `is_admin() OR (user_id = auth.uid() AND user.is_verified = true)` |
| bookings_update_own_or_admin | UPDATE | `user_id = auth.uid() OR is_admin()` |
| bookings_delete_admin | DELETE | `is_admin()` |

### Table: referrals
| Policy | Target | Condition |
|--------|--------|-----------|
| referrals_select_own_or_admin | SELECT | `referrer_id = auth.uid() OR is_admin()` |
| referrals_insert_self | INSERT | `referrer_id = auth.uid() OR is_admin()` |
| referrals_update_admin | UPDATE | `is_admin()` |
| referrals_delete_admin | DELETE | `is_admin()` |

### Table: vehicles (public read)
| Policy | Target | Condition |
|--------|--------|-----------|
| vehicles_select_authenticated | SELECT | `true` (all auth users) |
| vehicles_write_admin | INSERT/UPDATE/DELETE | `is_admin()` |

### Table: locations (public read)
| Policy | Target | Condition |
|--------|--------|-----------|
| locations_select_authenticated | SELECT | `true` (all auth users) |
| locations_write_admin | INSERT/UPDATE/DELETE | `is_admin()` |

### Storage: airline-ids bucket (private)
| Policy | Target | Condition |
|--------|--------|-----------|
| airline_ids_user_select | SELECT | Folder matches auth.uid() OR is_admin() |
| airline_ids_user_insert | INSERT | Folder matches auth.uid() |
| airline_ids_user_update | UPDATE | Folder matches auth.uid() |
| airline_ids_user_delete | DELETE | Folder matches auth.uid() OR is_admin() |

---

## Test Suite

### TEST GROUP 1: USER PROFILE ISOLATION

#### TEST 1.1: User Cannot Read Another User's Profile
```
Actor:     Alice (uuid-alice)
Action:    SELECT * FROM users WHERE id = uuid-bob
Expected:  Empty result (0 rows)
Validates: users_select_own_or_admin policy
```

**Curl Test:**
```bash
JWT_ALICE="eyJhbGc..." # Alice's JWT token
curl -H "Authorization: Bearer $JWT_ALICE" \
  'https://project.supabase.co/rest/v1/users?id=eq.uuid-bob'
# Expected: 200 OK, body: []
```

**Expected Response:**
```json
[]
```

**Failure Mode:**
If returns `[{id, email, phone, is_verified, ...}]` → RLS policy is not working

---

#### TEST 1.2: User Can Read Own Profile
```
Actor:     Alice (uuid-alice)
Action:    SELECT * FROM users WHERE id = uuid-alice
Expected:  1 row with Alice's data
Validates: users_select_own_or_admin policy (own side)
```

**Curl Test:**
```bash
curl -H "Authorization: Bearer $JWT_ALICE" \
  'https://project.supabase.co/rest/v1/users?id=eq.uuid-alice'
# Expected: 200 OK, body: [{id: uuid-alice, email: alice@test.com, ...}]
```

**Expected Response:**
```json
[
  {
    "id": "uuid-alice",
    "email": "alice@test.com",
    "full_name": "Alice",
    "phone": null,
    "airline_id_image_url": null,
    "is_verified": false,
    "verified_at": null,
    "created_at": "2025-02-15T10:00:00Z",
    "updated_at": "2025-02-15T10:00:00Z"
  }
]
```

---

#### TEST 1.3: Admin Can Read Any User's Profile
```
Actor:     Admin (uuid-admin, role='admin')
Action:    SELECT * FROM users
Expected:  All users returned
Validates: users_select_own_or_admin policy (admin side)
```

**Curl Test:**
```bash
curl -H "Authorization: Bearer $JWT_ADMIN" \
  'https://project.supabase.co/rest/v1/users'
# Expected: 200 OK, body: [{...alice}, {...bob}, ...]
```

**Expected Response:**
```json
[
  {
    "id": "uuid-alice",
    "email": "alice@test.com",
    "is_verified": false,
    ...
  },
  {
    "id": "uuid-bob",
    "email": "bob@test.com",
    "is_verified": true,
    ...
  },
  {
    "id": "uuid-admin",
    "email": "admin@test.com",
    "is_verified": true,
    ...
  }
]
```

---

#### TEST 1.4: Unauthenticated User Cannot Read Any Profile
```
Actor:     (no token)
Action:    SELECT * FROM users
Expected:  401 Unauthorized or empty result
Validates: RLS denies unauthenticated access
```

**Curl Test:**
```bash
curl 'https://project.supabase.co/rest/v1/users'
# Expected: 401 Unauthorized
```

**Expected Response:**
```json
{
  "code": "PGRST301",
  "details": "Insufficient privileges to access the requested resource.",
  "hint": null,
  "message": "Insufficient privileges to access the requested resource."
}
```

---

### TEST GROUP 2: PROFILE UPDATE ISOLATION

#### TEST 2.1: User Cannot Update Another User's Profile
```
Actor:     Alice (uuid-alice)
Action:    UPDATE users SET full_name='Hacker' WHERE id = uuid-bob
Expected:  0 rows affected (silent failure)
Validates: users_update_own_or_admin policy (WITH CHECK clause)
```

**Curl Test:**
```bash
curl -X PATCH \
  -H "Authorization: Bearer $JWT_ALICE" \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Hacker"}' \
  'https://project.supabase.co/rest/v1/users?id=eq.uuid-bob'
# Expected: 200 OK, but 0 rows affected in response
```

**Expected Response:**
```
200 OK (no body, or empty update response)
```

**Verification:**
Query Bob's profile afterward:
```bash
curl -H "Authorization: Bearer $JWT_BOB" \
  'https://project.supabase.co/rest/v1/users?id=eq.uuid-bob'
# Expected: full_name is still original value
```

---

#### TEST 2.2: User Can Update Own Profile
```
Actor:     Alice (uuid-alice)
Action:    UPDATE users SET full_name='Alice Updated' WHERE id = uuid-alice
Expected:  1 row affected, full_name changed
Validates: users_update_own_or_admin policy (success case)
```

**Curl Test:**
```bash
curl -X PATCH \
  -H "Authorization: Bearer $JWT_ALICE" \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Alice Updated"}' \
  'https://project.supabase.co/rest/v1/users?id=eq.uuid-alice'
# Expected: 200 OK, 1 row updated
```

---

#### TEST 2.3: User Cannot Update is_verified Field (API Layer)
```
Actor:     Alice (uuid-alice)
Action:    UPDATE users SET is_verified=true WHERE id = uuid-alice
Expected:  Blocked at API layer (401/403) OR DB trigger blocks
Validates: Defense-in-depth (API prevents, DB may also prevent)
```

**Curl Test:**
```bash
curl -X PATCH \
  -H "Authorization: Bearer $JWT_ALICE" \
  -H "Content-Type: application/json" \
  -d '{"is_verified": true}' \
  'https://project.supabase.co/rest/v1/users?id=eq.uuid-alice'
# Expected: 403 Forbidden (API rejects) OR 200 with no change
```

**Note:** This should be blocked by the API layer (not directly by RLS). If API allows it through, the DB should have a trigger to prevent it.

---

#### TEST 2.4: Admin Can Update Any User's is_verified
```
Actor:     Admin (uuid-admin, role='admin')
Action:    UPDATE users SET is_verified=true, verified_at=now() WHERE id = uuid-alice
Expected:  1 row affected, fields updated
Validates: Admin approval workflow
```

**Curl Test:**
```bash
curl -X PATCH \
  -H "Authorization: Bearer $JWT_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"is_verified": true, "verified_at": "2025-02-15T10:30:00Z"}' \
  'https://project.supabase.co/rest/v1/users?id=eq.uuid-alice'
# Expected: 200 OK, 1 row updated
```

---

### TEST GROUP 3: BOOKING ISOLATION

#### TEST 3.1: User Cannot Read Another User's Bookings
```
Actor:     Alice (uuid-alice)
Action:    SELECT * FROM bookings WHERE user_id = uuid-bob
Expected:  Empty result (0 rows)
Validates: bookings_select_own_or_admin policy
```

**Curl Test:**
```bash
curl -H "Authorization: Bearer $JWT_ALICE" \
  'https://project.supabase.co/rest/v1/bookings?user_id=eq.uuid-bob'
# Expected: 200 OK, body: []
```

---

#### TEST 3.2: User Can See Own Bookings
```
Actor:     Bob (uuid-bob)
Action:    SELECT * FROM bookings WHERE user_id = uuid-bob
Expected:  All of Bob's bookings returned
Validates: bookings_select_own_or_admin policy (own side)
```

**Setup:** Bob must have at least one booking

**Curl Test:**
```bash
curl -H "Authorization: Bearer $JWT_BOB" \
  'https://project.supabase.co/rest/v1/bookings?user_id=eq.uuid-bob'
# Expected: 200 OK, body: [bob's bookings]
```

---

#### TEST 3.3: User Cannot Create Booking for Another User
```
Actor:     Alice (uuid-alice, verified=true)
Action:    INSERT INTO bookings (user_id=uuid-bob, vehicle_id=..., ...)
Expected:  Insert fails with RLS violation
Validates: bookings_insert_verified_self policy
```

**Setup:**
- Alice: verified=true
- Bob: exists
- Vehicle exists

**Curl Test:**
```bash
curl -X POST \
  -H "Authorization: Bearer $JWT_ALICE" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-bob",
    "vehicle_id": "vehicle-uuid",
    "location_id": "location-uuid",
    "pickup_date": "2025-03-01",
    "return_date": "2025-03-05",
    "total_price": 500
  }' \
  'https://project.supabase.co/rest/v1/bookings'
# Expected: 403 Forbidden or constraint error
```

---

#### TEST 3.4: Unverified User Cannot Create Booking (RLS Gate)
```
Actor:     Alice (uuid-alice, verified=false)
Action:    INSERT INTO bookings (user_id=uuid-alice, ...)
Expected:  Insert fails with RLS violation
Validates: bookings_insert_verified_self policy (verification check)
```

**Curl Test:**
```bash
curl -X POST \
  -H "Authorization: Bearer $JWT_ALICE" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-alice",
    "vehicle_id": "vehicle-uuid",
    "location_id": "location-uuid",
    "pickup_date": "2025-03-01",
    "return_date": "2025-03-05",
    "total_price": 500
  }' \
  'https://project.supabase.co/rest/v1/bookings'
# Expected: 403 Forbidden (exists check fails in RLS policy)
```

---

#### TEST 3.5: Verified User Can Create Booking for Self
```
Actor:     Bob (uuid-bob, verified=true)
Action:    INSERT INTO bookings (user_id=uuid-bob, ...)
Expected:  Insert succeeds, booking created
Validates: bookings_insert_verified_self policy (happy path)
```

**Curl Test:**
```bash
curl -X POST \
  -H "Authorization: Bearer $JWT_BOB" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-bob",
    "vehicle_id": "vehicle-uuid",
    "location_id": "location-uuid",
    "pickup_date": "2025-03-01",
    "return_date": "2025-03-05",
    "total_price": 500
  }' \
  'https://project.supabase.co/rest/v1/bookings'
# Expected: 201 Created, booking row returned
```

---

#### TEST 3.6: User Cannot Update Another User's Booking
```
Actor:     Alice (uuid-alice)
Action:    UPDATE bookings SET status='cancelled' WHERE user_id = uuid-bob
Expected:  0 rows affected
Validates: bookings_update_own_or_admin policy
```

**Curl Test:**
```bash
curl -X PATCH \
  -H "Authorization: Bearer $JWT_ALICE" \
  -H "Content-Type: application/json" \
  -d '{"status": "cancelled"}' \
  'https://project.supabase.co/rest/v1/bookings?user_id=eq.uuid-bob'
# Expected: 200 OK, but 0 rows affected
```

---

#### TEST 3.7: Admin Can Create Booking for Any User
```
Actor:     Admin (role='admin')
Action:    INSERT INTO bookings (user_id=uuid-alice, ...) [Alice unverified]
Expected:  Insert succeeds (admin bypass)
Validates: bookings_insert_verified_self policy (admin side)
```

**Curl Test:**
```bash
curl -X POST \
  -H "Authorization: Bearer $JWT_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-alice",
    "vehicle_id": "vehicle-uuid",
    "location_id": "location-uuid",
    "pickup_date": "2025-03-01",
    "return_date": "2025-03-05",
    "total_price": 500
  }' \
  'https://project.supabase.co/rest/v1/bookings'
# Expected: 201 Created (admin bypass verified check)
```

---

### TEST GROUP 4: REFERRAL ISOLATION

#### TEST 4.1: User Cannot See Another User's Referrals
```
Actor:     Alice (uuid-alice)
Action:    SELECT * FROM referrals WHERE referrer_id = uuid-bob
Expected:  Empty result (0 rows)
Validates: referrals_select_own_or_admin policy
```

**Curl Test:**
```bash
curl -H "Authorization: Bearer $JWT_ALICE" \
  'https://project.supabase.co/rest/v1/referrals?referrer_id=eq.uuid-bob'
# Expected: 200 OK, body: []
```

---

#### TEST 4.2: User Can See Own Referrals
```
Actor:     Bob (uuid-bob)
Action:    SELECT * FROM referrals WHERE referrer_id = uuid-bob
Expected:  All of Bob's referrals returned
Validates: referrals_select_own_or_admin policy
```

**Setup:** Bob must have at least one referral

**Curl Test:**
```bash
curl -H "Authorization: Bearer $JWT_BOB" \
  'https://project.supabase.co/rest/v1/referrals?referrer_id=eq.uuid-bob'
# Expected: 200 OK, body: [bob's referrals]
```

---

#### TEST 4.3: Admin Can See All Referrals
```
Actor:     Admin (role='admin')
Action:    SELECT * FROM referrals
Expected:  All referrals returned (no filtering)
Validates: referrals_select_own_or_admin policy (admin side)
```

**Curl Test:**
```bash
curl -H "Authorization: Bearer $JWT_ADMIN" \
  'https://project.supabase.co/rest/v1/referrals'
# Expected: 200 OK, body: [all referrals from all users]
```

---

#### TEST 4.4: User Cannot Update Referral Status
```
Actor:     Alice (uuid-alice, referrer_id=uuid-alice)
Action:    UPDATE referrals SET status='paid' WHERE referrer_id = uuid-alice
Expected:  0 rows affected (or 403)
Validates: referrals_update_admin policy (admin-only)
```

**Curl Test:**
```bash
curl -X PATCH \
  -H "Authorization: Bearer $JWT_ALICE" \
  -H "Content-Type: application/json" \
  -d '{"status": "paid"}' \
  'https://project.supabase.co/rest/v1/referrals?referrer_id=eq.uuid-alice'
# Expected: 200 OK but 0 rows affected (or 403 Forbidden)
```

---

#### TEST 4.5: Admin Can Update Referral Status
```
Actor:     Admin (role='admin')
Action:    UPDATE referrals SET status='paid', commission_earned=40
Expected:  1 row affected
Validates: referrals_update_admin policy
```

**Curl Test:**
```bash
curl -X PATCH \
  -H "Authorization: Bearer $JWT_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"status": "paid", "commission_earned": 40}' \
  'https://project.supabase.co/rest/v1/referrals?referrer_id=eq.uuid-alice'
# Expected: 200 OK, 1 row affected
```

---

### TEST GROUP 5: VEHICLE & LOCATION BROWSING

#### TEST 5.1: Authenticated Users See All Vehicles
```
Actor:     Alice (authenticated)
Action:    SELECT * FROM vehicles
Expected:  All vehicles returned
Validates: vehicles_select_authenticated policy (true for all auth users)
```

**Curl Test:**
```bash
curl -H "Authorization: Bearer $JWT_ALICE" \
  'https://project.supabase.co/rest/v1/vehicles'
# Expected: 200 OK, all vehicle rows
```

---

#### TEST 5.2: Unauthenticated Users Cannot See Vehicles
```
Actor:     (no token)
Action:    SELECT * FROM vehicles
Expected:  401 Unauthorized or empty result
Validates: RLS denies unauthenticated access
```

**Curl Test:**
```bash
curl 'https://project.supabase.co/rest/v1/vehicles'
# Expected: 401 Unauthorized
```

---

#### TEST 5.3: Only Admin Can Create Vehicle
```
Actor:     Alice (user)
Action:    INSERT INTO vehicles (...)
Expected:  Insert fails (403)
Validates: vehicles_write_admin policy
```

**Curl Test:**
```bash
curl -X POST \
  -H "Authorization: Bearer $JWT_ALICE" \
  -H "Content-Type: application/json" \
  -d '{
    "location_id": "location-uuid",
    "make": "Tesla",
    "model": "Model 3",
    "year": 2024,
    "license_plate": "XYZ-9999",
    "vehicle_type": "sedan",
    "daily_rate": 199.99,
    "features": ["GPS", "autopilot"]
  }' \
  'https://project.supabase.co/rest/v1/vehicles'
# Expected: 403 Forbidden
```

---

#### TEST 5.4: Admin Can Create Vehicle
```
Actor:     Admin (role='admin')
Action:    INSERT INTO vehicles (...)
Expected:  Insert succeeds
Validates: vehicles_write_admin policy
```

**Curl Test:**
```bash
curl -X POST \
  -H "Authorization: Bearer $JWT_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "location_id": "location-uuid",
    "make": "Tesla",
    "model": "Model 3",
    "year": 2024,
    "license_plate": "XYZ-9999",
    "vehicle_type": "sedan",
    "daily_rate": 199.99,
    "features": ["GPS", "autopilot"]
  }' \
  'https://project.supabase.co/rest/v1/vehicles'
# Expected: 201 Created
```

---

### TEST GROUP 6: STORAGE (AIRLINE ID IMAGES)

#### TEST 6.1: User Can Upload to Own Folder
```
Actor:     Alice (uuid-alice)
Action:    PUT airline-ids/uuid-alice/license.jpg
Expected:  Upload succeeds (200 or 201)
Validates: airline_ids_user_insert policy
```

**Curl Test (using signed upload URL or Supabase SDK):**
```bash
# Using Supabase CLI/SDK to upload
supabase storage upload airline-ids/uuid-alice/license.jpg ./license.jpg --token $JWT_ALICE
# Expected: File uploaded successfully
```

---

#### TEST 6.2: User Cannot Upload to Another User's Folder
```
Actor:     Alice (uuid-alice)
Action:    PUT airline-ids/uuid-bob/license.jpg
Expected:  Upload fails (403)
Validates: airline_ids_user_insert policy
```

**Curl Test:**
```bash
# Using Supabase SDK
supabase storage upload airline-ids/uuid-bob/license.jpg ./license.jpg --token $JWT_ALICE
# Expected: 403 Forbidden
```

---

#### TEST 6.3: User Can Read Own Files
```
Actor:     Alice (uuid-alice)
Action:    GET airline-ids/uuid-alice/license.jpg (via signed URL)
Expected:  File returned (200 OK)
Validates: airline_ids_user_select policy
```

**Signed URL generation (via API/SDK):**
```bash
# API creates signed URL server-side
POST /api/get-airline-id-url
  { "bucket": "airline-ids", "path": "uuid-alice/license.jpg" }
# Returns: signed URL valid for 1 hour
# Client fetches: curl [signed-url]
# Expected: 200 OK, file content
```

---

#### TEST 6.4: User Cannot Read Another User's Files
```
Actor:     Alice (uuid-alice)
Action:    GET airline-ids/uuid-bob/license.jpg
Expected:  403 Forbidden
Validates: airline_ids_user_select policy
```

**Curl Test:**
```bash
# Alice tries to generate signed URL for Bob's file
POST /api/get-airline-id-url --header "Authorization: Bearer $JWT_ALICE"
  { "bucket": "airline-ids", "path": "uuid-bob/license.jpg" }
# Expected: 403 Forbidden (API layer blocks)

# Or directly:
curl "https://project.supabase.co/storage/v1/object/airline-ids/uuid-bob/license.jpg?token=$ALICE_TOKEN"
# Expected: 403 Forbidden
```

---

#### TEST 6.5: Admin Can Read Any Files
```
Actor:     Admin (role='admin')
Action:    GET airline-ids/uuid-alice/license.jpg
Expected:  File returned (200 OK)
Validates: airline_ids_user_select policy (admin side)
```

**Curl Test:**
```bash
# Admin generates signed URL (server-side API)
POST /api/admin/get-airline-id-url --header "Authorization: Bearer $JWT_ADMIN"
  { "bucket": "airline-ids", "path": "uuid-alice/license.jpg" }
# Expected: 200 OK, signed URL valid for admin
```

---

## Test Execution Checklist

Run all tests above in order. Mark each as PASS or FAIL:

- [ ] 1.1: User cannot read another's profile
- [ ] 1.2: User can read own profile
- [ ] 1.3: Admin can read any profile
- [ ] 1.4: Unauthenticated blocked
- [ ] 2.1: User cannot update another's profile
- [ ] 2.2: User can update own profile
- [ ] 2.3: User cannot set is_verified (API layer)
- [ ] 2.4: Admin can update is_verified
- [ ] 3.1: User cannot read another's bookings
- [ ] 3.2: User can read own bookings
- [ ] 3.3: User cannot create for another
- [ ] 3.4: Unverified user blocked
- [ ] 3.5: Verified user can book for self
- [ ] 3.6: User cannot update another's booking
- [ ] 3.7: Admin can create for anyone
- [ ] 4.1: User cannot see another's referrals
- [ ] 4.2: User can see own referrals
- [ ] 4.3: Admin can see all referrals
- [ ] 4.4: User cannot update referral
- [ ] 4.5: Admin can update referral
- [ ] 5.1: Auth users see all vehicles
- [ ] 5.2: Unauth users blocked
- [ ] 5.3: User cannot create vehicle
- [ ] 5.4: Admin can create vehicle
- [ ] 6.1: User can upload to own folder
- [ ] 6.2: User cannot upload to another's folder
- [ ] 6.3: User can read own files
- [ ] 6.4: User cannot read another's files
- [ ] 6.5: Admin can read any files

---

## Troubleshooting RLS Issues

### RLS Policy Not Applied
**Symptom:** All queries return all rows regardless of auth.uid()  
**Diagnosis:**
1. Check RLS is enabled: `select relrowsecurity from pg_class where relname='users';`
2. Verify policy exists: `select policyname from pg_policies where tablename='users';`
3. Check policy condition: `select qual from pg_policies where tablename='users' and policyname='users_select_own_or_admin';`

**Fix:**
```sql
-- If RLS not enabled:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- If policy missing:
create policy "users_select_own_or_admin"
  on public.users for select
  to authenticated
  using (id = (select auth.uid()) or public.is_admin());
```

### is_admin() Returns False for Admin User
**Symptom:** Admin token still gets blocked by RLS  
**Diagnosis:**
1. Check JWT claims: Decode JWT on jwt.io, look for `app_metadata.role = 'admin'`
2. Test function directly: `select public.is_admin();` while logged in as admin
3. Check function definition: `\df public.is_admin` in psql

**Fix:**
```sql
-- Re-create function (ensure it's SECURITY DEFINER)
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
```

### User Sees Rows from Another User
**Symptom:** Query returns results that should be blocked  
**Diagnosis:**
1. Check auth.uid() is correct: `select auth.uid();` in policy
2. Verify WITH CHECK clause is set on INSERT/UPDATE
3. Check table doesn't have conflicting policies

**Fix:**
```sql
-- Verify policy has both USING and WITH CHECK for UPDATE:
create policy "bookings_update_own_or_admin"
  on public.bookings for update
  to authenticated
  using (user_id = (select auth.uid()) or public.is_admin())
  with check (user_id = (select auth.uid()) or public.is_admin());
```

---

## Security Best Practices

1. **Always test as different users** — Regular user, admin, unauthenticated
2. **Test both positive and negative cases** — Success and blocked paths
3. **Use USING and WITH CHECK on UPDATE/DELETE** — Don't just use USING
4. **Keep functions SECURITY DEFINER** — Prevents RLS bypasses
5. **Audit storage policies** — Images must be user-scoped
6. **Test edge cases** — Null values, empty results, concurrent requests
7. **Monitor policy changes** — Log RLS policy updates
8. **Rotate test users** — Refresh JWT tokens regularly (they expire)

