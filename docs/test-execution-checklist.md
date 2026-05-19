# Test Execution Checklist — PilotCars Booking Platform

## Quick Reference: Test Matrix

This checklist organizes all tests by priority, type, and execution phase. Use this to track progress and identify blocking issues.

---

## Phase 1: Database Integrity & Constraints (Unit Tests)
**Duration:** ~30 minutes  
**Tools:** SQL client (psql, pgAdmin, Supabase SQL Editor)  
**Goal:** Verify schema constraints work before testing higher layers  
**Blockers:** If any test fails, do not proceed to Phase 2

| Test ID | Test Name | Type | Priority | Status | Notes |
|---------|-----------|------|----------|--------|-------|
| 6.1 | FK Cascades (delete user) | Unit | High | [ ] | Seed: User A with 2 bookings, 3 referrals |
| 6.2 | Duplicate license plate rejection | Unit | High | [ ] | Insert duplicate plate → constraint error |
| 6.3 | Duplicate email rejection | Unit | Critical | [ ] | Insert duplicate email → unique error |
| 6.4 | Default values applied | Unit | High | [ ] | Check is_verified=false, status=pending defaults |
| 6.5 | updated_at trigger works | Unit | Medium | [ ] | Update row, check timestamp changes |
| 7.1 | FK violation: invalid vehicle_id | Unit | High | [ ] | Insert booking with fake vehicle_id |
| 7.2 | FK violation: invalid location_id | Unit | High | [ ] | Insert booking with fake location_id |
| 7.3 | FK: invalid referrer (graceful) | Unit | Medium | [ ] | Insert referral with fake referrer_id |
| 7.4 | Overlap prevention (DB + API) | Unit | Critical | [ ] | Create overlapping bookings, verify rejection |

**Phase 1 Sign-Off:**
- [ ] All tests passed
- [ ] No constraint violations beyond expected ones
- [ ] DB schema is sound

---

## Phase 2: RLS Enforcement (Integration Tests)
**Duration:** ~1 hour  
**Tools:** PostgREST API with auth tokens, Supabase Dashboard  
**Goal:** Verify security boundaries are enforced  
**Blockers:** If any Critical test fails, security is compromised; pause and fix

| Test ID | Test Name | Type | Priority | Status | Notes |
|---------|-----------|------|----------|--------|-------|
| 5.1 | User A can't see User B's profile | Integration | Critical | [ ] | Query users table as User A, verify User B hidden |
| 5.2 | User A can't see User B's bookings | Integration | Critical | [ ] | List bookings, verify only own visible |
| 5.3 | User A can't see User B's referrals | Integration | Critical | [ ] | List referrals, verify only own visible |
| 5.4 | User A can't update User B's profile | Integration | Critical | [ ] | UPDATE row as User A, verify blocked |
| 5.5 | User A can't update User B's bookings | Integration | Critical | [ ] | UPDATE booking as User A, verify blocked |
| 5.6 | User can't self-approve verification | Integration | Critical | [ ] | User tries to set is_verified=true, verify blocked |
| 5.7 | Only admins approve airline IDs | Integration | Critical | [ ] | Admin succeeds, user fails |
| 2.1 | Auth users see all vehicles | Integration | High | [ ] | Query vehicles, verify all rows returned |
| 2.2 | Unauth users can't see vehicles | Integration | High | [ ] | Query without token, verify blocked |

**Phase 2 Sign-Off:**
- [ ] All Critical tests passed (security intact)
- [ ] RLS policies enforced correctly
- [ ] Ready to test features

---

## Phase 3: Core Features (E2E Tests)
**Duration:** ~2 hours  
**Tools:** Next.js API routes, browser, Supabase client  
**Goal:** Verify user workflows end-to-end  
**Dependencies:** Requires Phase 1 & 2 passing

### Section 3.1: User Signup & Verification

| Test ID | Test Name | Type | Priority | Status | Depends On | Notes |
|---------|-----------|------|----------|--------|------------|-------|
| 1.1 | Valid email signup | Integration | Critical | [ ] | Phase 1 | Seed fresh DB, create account |
| 1.2 | Duplicate email rejection | Unit | Critical | [ ] | 1.1 | Try to signup with same email |
| 1.3 | Phone number validation | Unit | Medium | [ ] | — | Test valid/invalid formats |
| 1.4 | File upload: type validation | Integration | Critical | [ ] | — | Upload .jpg, .txt, .exe |
| 1.5 | File upload: storage RLS | Integration | Critical | [ ] | 1.4 | User A uploads, User B can't read |
| 1.6 | Unverified users blocked from booking | Integration | Critical | [ ] | Phase 2 | User verified=false tries to book → blocked |
| 1.7 | Admin approves verification | Integration | Critical | [ ] | 1.6 | Admin updates is_verified=true |
| 1.8 | Verified user can book | E2E | Critical | [ ] | 1.7 | Same user from 1.6 now books → succeeds |

### Section 3.2: Vehicle Browsing

| Test ID | Test Name | Type | Priority | Status | Depends On | Notes |
|---------|-----------|------|----------|--------|------------|-------|
| 2.1 | Auth users see all vehicles | Integration | High | [ ] | Phase 2 | Query all vehicles (no filters) |
| 2.2 | Unauth users blocked | Integration | High | [ ] | Phase 2 | No token → no vehicles |
| 2.3 | Filter by location | Integration | High | [ ] | 2.1 | Query ?location=Miami → 5 vehicles |
| 2.4 | Filter by type | Integration | High | [ ] | 2.1 | Query ?type=sedan → 3 vehicles |
| 2.5 | Availability reflects bookings | Integration | High | [ ] | Phase 3 (mid) | Create booking, check overlap detection |

### Section 3.3: Booking Creation

| Test ID | Test Name | Type | Priority | Status | Depends On | Notes |
|---------|-----------|------|----------|--------|------------|-------|
| 3.1 | Valid booking creation | Integration | Critical | [ ] | 1.8 | Create booking with valid dates |
| 3.2 | Invalid dates rejected | Unit | Critical | [ ] | — | return < pickup → constraint error |
| 3.3 | Overlapping bookings prevented | Integration | Critical | [ ] | 3.1 | Create overlapping booking → rejected |
| 3.4 | Unverified users blocked (retest) | Integration | Critical | [ ] | Phase 2 | Double-check gate |
| 3.5 | Price calculation correct | Unit | High | [ ] | 3.1 | Verify total_price = rate * days |
| 3.6 | Users can't book for others | Integration | Critical | [ ] | Phase 2 | User A tries to create for User B → blocked |
| 3.7 | Admins can create for anyone | Integration | High | [ ] | Phase 2 | Admin creates booking for User B |
| 3.8 | Cancelled bookings don't block | Integration | High | [ ] | 3.1 | Create booking 1 (cancel), then booking 2 (same dates) → succeeds |

### Section 3.4: Referral Program

| Test ID | Test Name | Type | Priority | Status | Depends On | Notes |
|---------|-----------|------|----------|--------|------------|-------|
| 4.1 | Unique referral code on signup | Unit | High | [ ] | 1.1 | Check PILOT-XXXXXX generated |
| 4.2 | Code is shareable & unique | Unit | High | [ ] | 4.1 | Query referrals, verify one code per row |
| 4.3 | Referral row on booking | Integration | High | [ ] | 3.1 | User B uses code, books → referral created |
| 4.4 | Commission calculated (8%) | Unit | High | [ ] | 4.3 | Verify 8% of total_price |
| 4.5 | Status flow: pending → earned → paid | Integration | High | [ ] | 4.3 | Admin updates status, check transitions |
| 4.6 | Users see only own referrals | Integration | Critical | [ ] | Phase 2 | User A lists referrals, User B's hidden |
| 4.7 | Admins see all referrals | Integration | High | [ ] | 4.6 | Admin lists all referrals |

**Phase 3 Sign-Off:**
- [ ] All Critical tests passed
- [ ] Signup → Verify → Browse → Book → Refer workflows complete
- [ ] User data isolation confirmed
- [ ] Ready for Phase 4

---

## Phase 4: Edge Cases & Performance (Integration + Performance)
**Duration:** ~1.5 hours  
**Tools:** API testing, SQL EXPLAIN ANALYZE, load testing (k6/JMeter)  
**Goal:** Verify error handling and scalability  
**Dependencies:** Requires Phase 3 passing

### Section 4.1: Edge Cases & Error Handling

| Test ID | Test Name | Type | Priority | Status | Depends On | Notes |
|---------|-----------|------|----------|--------|------------|-------|
| 7.5 | Admin overrides constraints | Integration | Medium | [ ] | Phase 3 | Admin creates booking for unverified user |
| 7.6 | Invalid file type error | Integration | High | [ ] | 1.4 | Upload .exe, verify API error |
| 7.7 | Image storage access control | Integration | Critical | [ ] | 1.5 | Retest signing, User B can't access |

### Section 4.2: Performance & Load

| Test ID | Test Name | Type | Priority | Status | Depends On | Notes |
|---------|-----------|------|----------|--------|------------|-------|
| 8.1 | 1000+ vehicles listing | Performance | Medium | [ ] | Phase 3 | Seed 1000 vehicles, measure query time (<500ms) |
| 8.2 | Booking overlap check | Performance | Medium | [ ] | Phase 3 | Seed 1000 bookings, check overlap (<100ms) |
| 8.3 | JSON features search | Performance | Low | [ ] | Phase 3 | Query @> ["GPS"], check GIN index |
| 8.4 | Referral code lookup | Performance | Low | [ ] | Phase 3 | Lookup by code, verify instant (<10ms) |

**Phase 4 Sign-Off:**
- [ ] All Critical tests passed
- [ ] Error handling is graceful
- [ ] Performance is acceptable
- [ ] Ready for production

---

## Test Failure Troubleshooting

### If Phase 1 fails:
1. Check schema migration was applied: `select table_name from information_schema.tables where table_schema='public';`
2. Verify constraints exist: `\d public.bookings` (in psql) or similar in pgAdmin
3. Re-run migration: `supabase migration up`

### If Phase 2 fails:
1. Verify RLS is enabled: `select * from information_schema.tables where table_schema='public' and table_name='users';` → check rls_enabled
2. Check auth token is valid: JWT decode on jwt.io
3. Verify `public.is_admin()` function works: `select public.is_admin();` as admin user
4. Check policy syntax: `select schemaname, tablename, policyname from pg_policies where tablename='users';`

### If Phase 3 fails:
1. Check API route returns correct status codes (200, 400, 403, 409)
2. Verify auth token is passed in request headers
3. Check error messages are user-friendly (not SQL errors)
4. Ensure service layer calls Supabase client correctly (server-side)

### If Phase 4 fails:
1. Run `explain analyze` on slow queries: `explain analyze select * from vehicles where location_id='...' limit 100;`
2. Check indexes exist: `select indexname from pg_indexes where tablename='vehicles';`
3. Measure network latency separately from query time
4. Consider connection pooling if load test shows saturation

---

## Regression Testing (Before Each Deploy)

After any code or schema change, run these **critical** tests:

- [ ] **1.6** — Unverified users blocked from booking
- [ ] **3.3** — Overlapping bookings prevented
- [ ] **3.6** — Users can't book for others
- [ ] **5.1–5.7** — All RLS policies intact
- [ ] **6.1–6.3** — Cascades and constraints work

If all pass → safe to deploy. If any fail → investigate and fix before proceeding.

---

## Test Data Seeding

Before executing tests, seed the database with test data. Run this script in Supabase SQL Editor:

```sql
-- Enable insecure JWT claim (for testing; disable in production)
-- Already configured in Supabase; just seed data below

-- Locations
insert into public.locations (id, name, city, address, phone, hours_open) values
  (gen_random_uuid(), 'Miami Airport Rental', 'Miami', '2100 NW 42nd Ave, Miami, FL 33142', '+1-305-555-0100', '6am-11pm'),
  (gen_random_uuid(), 'Downtown Miami', 'Miami', '100 Biscayne Blvd, Miami, FL 33132', '+1-305-555-0101', '7am-9pm'),
  (gen_random_uuid(), 'Orlando Downtown', 'Orlando', '123 Main St, Orlando, FL 32801', '+1-407-555-0200', '7am-10pm');

-- Vehicles (seed into Miami location)
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

-- Notes:
-- - To seed auth users, use Supabase Dashboard or Supabase CLI (can't insert directly)
-- - For testing, create users manually via dashboard or use signup API
-- - Admin user: Create via dashboard, set app_metadata.role = 'admin'
```

---

## Test Environment Setup

### Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# In another terminal, start Supabase locally (if using local Supabase)
supabase start

# Open SQL Editor at http://localhost:54323 (or dashboard port)
```

### Supabase Cloud
```bash
# Link to Supabase project
supabase link

# Run migrations
supabase migration up

# Seed test data (paste seed script in SQL Editor)
```

### Test User Accounts
Create these in Supabase Dashboard → Authentication:

| User | Email | Password | Role | is_verified | Notes |
|------|-------|----------|------|------------|-------|
| Alice | alice@test.com | test1234 | user | false | For signup/verification tests |
| Bob | bob@test.com | test1234 | user | true | For booking tests |
| Charlie | charlie@test.com | test1234 | user | false | For referral tests |
| Admin | admin@test.com | admin1234 | admin | true | Set app_metadata.role='admin' |

---

## Test Report Template

After running tests, complete this report:

```
Test Execution Report — PilotCars [DATE]

Phase 1: Database Integrity
- Status: [PASS / FAIL]
- Tests Run: [X]/9
- Failures: [List any]
- Blockers: [Y/N]

Phase 2: RLS Enforcement
- Status: [PASS / FAIL]
- Tests Run: [X]/9
- Failures: [List any]
- Blockers: [Y/N]

Phase 3: Core Features
- Status: [PASS / FAIL]
- Tests Run: [X]/24
- Failures: [List any]

Phase 4: Edge Cases & Performance
- Status: [PASS / FAIL]
- Tests Run: [X]/7
- Failures: [List any]

Overall: [PASS / FAIL]
Recommendation: [Deploy / Fix & Retest]
```

---

## Automation (Future)

Once manual tests are proven, consider automating with:
- **Pytest** (Python) or **Jest** (Node.js) for API tests
- **Playwright** or **Cypress** for E2E tests
- **k6** for load testing
- **GitHub Actions** for CI/CD

Example GitHub Action workflow:
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: npm install
      - run: npm run test:unit  # Phase 1
      - run: npm run test:rls   # Phase 2
      - run: npm run test:e2e   # Phase 3
      - run: npm run test:perf  # Phase 4
```

