# Test Plan Summary — PilotCars Booking Platform

One-page reference and quick roadmap for testing the booking, verification, and referral systems.

---

## Quick Stats

| Category | Count | Critical | High | Medium | Low |
|----------|-------|----------|------|--------|-----|
| **Database Integrity** | 9 | 2 | 5 | 2 | — |
| **RLS Security** | 9 | 7 | 2 | — | — |
| **User Signup & Verification** | 8 | 3 | 3 | 2 | — |
| **Vehicle Browsing** | 5 | — | 5 | — | — |
| **Booking Creation** | 8 | 3 | 3 | 2 | — |
| **Referral Program** | 7 | 1 | 5 | 1 | — |
| **Edge Cases** | 3 | 2 | 1 | — | — |
| **Performance** | 4 | — | — | 4 | — |
| **TOTAL** | **53** | **18** | **24** | **11** | **—** |

---

## Test Priority Roadmap

### Must-Pass Tests (Critical Path)
These 18 tests block deployment. Fix any failure immediately.

| # | Test | Phase | Time | Category |
|---|------|-------|------|----------|
| 1 | Duplicate email rejected | Phase 1 | 5 min | DB Constraint |
| 2 | Unverified users blocked from booking | Phase 2 | 10 min | RLS |
| 3 | User A can't see User B's profile | Phase 2 | 5 min | RLS |
| 4 | User A can't see User B's bookings | Phase 2 | 5 min | RLS |
| 5 | User A can't see User B's referrals | Phase 2 | 5 min | RLS |
| 6 | User A can't update User B's profile | Phase 2 | 5 min | RLS |
| 7 | User A can't update User B's bookings | Phase 2 | 5 min | RLS |
| 8 | Only admins approve verification | Phase 2 | 5 min | RLS |
| 9 | User can't self-approve verification | Phase 2 | 5 min | RLS |
| 10 | Overlapping bookings prevented | Phase 3 | 10 min | DB + API |
| 11 | Invalid dates rejected | Phase 3 | 5 min | DB Constraint |
| 12 | Users can't book for others | Phase 3 | 10 min | RLS + API |
| 13 | Unverified users blocked (retest) | Phase 3 | 5 min | RLS + API |
| 14 | Valid booking creation | Phase 3 | 10 min | E2E |
| 15 | Admin can create for anyone | Phase 3 | 10 min | RLS + API |
| 16 | Price calculation correct | Phase 3 | 5 min | Logic |
| 17 | FK constraints work | Phase 1 | 10 min | DB Constraint |
| 18 | Cascades work (delete user) | Phase 1 | 10 min | DB Constraint |

**Estimated Time:** ~2 hours  
**If All Pass:** Clear to proceed with feature development

---

## Test Categories at a Glance

### 1. Database Integrity & Constraints (9 tests, 30 min)
**Purpose:** Verify schema is sound  
**Tools:** SQL client  
**Critical Tests:**
- Duplicate email/license plate rejection
- Foreign key constraints
- Default values
- Cascade deletes

**Pass Criteria:** All constraints enforced, no unexpected errors

---

### 2. RLS Security (9 tests, 1 hour)
**Purpose:** Verify users see only their data  
**Tools:** PostgREST API with different auth tokens  
**Critical Tests:**
- Users isolated (can't see/modify other users' data)
- Admins can see/modify everything
- Unauthenticated users blocked
- Verification gate enforced

**Pass Criteria:** All data isolation enforced, no leaks

---

### 3. User Signup & Verification (8 tests, 45 min)
**Purpose:** Verify user onboarding and airline ID approval workflow  
**Tools:** API routes + Auth  
**Critical Tests:**
- Valid signup creates profile + referral code
- Duplicate emails blocked
- Airline ID upload (file validation + storage)
- Unverified → verified workflow
- Verified users can book

**Pass Criteria:** Complete signup flow works, verification gate enforced

---

### 4. Vehicle Browsing (5 tests, 20 min)
**Purpose:** Verify vehicle catalog is accessible and filterable  
**Tools:** API routes + PostgREST  
**Tests:**
- Authenticated users see all vehicles
- Unauthenticated users blocked
- Filters by location and type work
- Real-time availability reflects bookings

**Pass Criteria:** Vehicles visible to auth users, filters work, availability correct

---

### 5. Booking Creation (8 tests, 1 hour)
**Purpose:** Verify booking workflow and validation  
**Tools:** API routes + DB + RLS  
**Critical Tests:**
- Valid booking creation
- Invalid dates rejected
- Overlapping bookings prevented
- Unverified users blocked
- Users can't book for others
- Price calculation correct
- Admins can override

**Pass Criteria:** Booking flow works, validation enforced, isolation maintained

---

### 6. Referral Program (7 tests, 45 min)
**Purpose:** Verify referral code generation and commission tracking  
**Tools:** API routes + DB  
**Tests:**
- Unique referral codes generated on signup
- Referral rows created on booking
- 8% commission calculated correctly
- Status flow (pending → earned → paid) works
- Users see only own referrals (RLS)
- Admins manage all referrals

**Pass Criteria:** Referral system end-to-end, commission math correct, isolation enforced

---

### 7. Edge Cases & Error Handling (3 tests, 20 min)
**Purpose:** Verify graceful error handling  
**Tools:** API + DB  
**Tests:**
- Foreign key violations handled
- Invalid file uploads rejected
- Storage access control

**Pass Criteria:** Errors returned with clear messages, no crashes

---

### 8. Performance & Load (4 tests, 45 min)
**Purpose:** Verify scalability with large datasets  
**Tools:** SQL EXPLAIN ANALYZE + k6/JMeter  
**Tests:**
- 1000+ vehicles listed (<500ms)
- Booking overlap check efficient (<100ms)
- JSON feature search uses GIN index
- Referral code lookup instant

**Pass Criteria:** Queries fast, indexes in use, load test passes

---

## Execution Plan

### Pre-Execution Checklist
- [ ] Supabase project provisioned
- [ ] Schema migration applied (`0001_init_schema.sql`)
- [ ] Test users created (Alice, Bob, Charlie, Admin)
- [ ] Test data seeded (locations, vehicles, bookings)
- [ ] Auth tokens obtained for each test user
- [ ] Tools ready (curl/Postman, SQL client, browser)

### Phase 1: Database Integrity (30 min)
**Run:** `npm run test:db` (if automated)  
**Or:** Manual SQL tests in Supabase SQL Editor

**Tests:** 6.1–6.5, 7.1–7.4  
**Block:** Do not proceed if any test fails

### Phase 2: RLS Enforcement (1 hour)
**Run:** `npm run test:rls` (if automated)  
**Or:** PostgREST API tests with curl/Postman

**Tests:** 5.1–5.7, 2.1–2.2  
**Block:** Do not proceed if any Critical test fails

### Phase 3: Core Features (2 hours)
**Run:** `npm run test:e2e` (if automated)  
**Or:** API routes + browser testing

**Tests:** 1.1–4.7  
**Block:** Do not proceed if workflows are broken

### Phase 4: Edge Cases & Performance (1.5 hours)
**Run:** `npm run test:perf` (if automated)  
**Or:** Manual load testing + SQL analysis

**Tests:** 7.5–7.7, 8.1–8.4  
**Block:** Performance issues should be addressed before launch

---

## Sign-Off Criteria

✓ **All Critical tests passed**
✓ **All High-priority tests passed**
✓ **Medium-priority tests passed (or deferred to v2)**
✓ **No console errors in browser**
✓ **Build succeeds (`npm run build`)**
✓ **No RLS leaks (users see only their data)**
✓ **Verification gate enforced (unverified users blocked)**
✓ **Overlapping bookings prevented**
✓ **Commission calculated correctly**
✓ **Performance acceptable (<500ms queries)**

---

## Failure Resolution Guide

### If Database Test Fails
1. Check schema migration was applied: `select table_name from information_schema.tables where table_schema='public';`
2. Run migration: `supabase migration up`
3. Retest

### If RLS Test Fails
1. Verify policy exists: `select policyname from pg_policies where tablename='users';`
2. Check auth token is valid (decode JWT on jwt.io)
3. Verify `public.is_admin()` function works: `select public.is_admin();`
4. Re-create policy if missing

### If Feature Test Fails
1. Check API route exists and returns correct status codes
2. Verify auth token passed in request
3. Check error message is clear (not SQL error)
4. Test RLS policy for blocking

### If Performance Test Fails
1. Run `explain analyze` on slow query
2. Check indexes exist: `select indexname from pg_indexes where tablename='vehicles';`
3. Verify composite indexes for complex queries
4. Consider query optimization or connection pooling

---

## Regression Testing Checklist

**Before each deploy, retest these 5 critical items:**

- [ ] **Test 1.6:** Unverified users cannot book
- [ ] **Test 3.3:** Overlapping bookings prevented
- [ ] **Test 3.6:** Users cannot create bookings for others
- [ ] **Test 5.1–5.7:** All RLS policies intact
- [ ] **Test 6.1–6.3:** Cascades and unique constraints work

**Time:** ~20 minutes  
**If All Pass:** Safe to deploy

---

## Test Tools Quick Reference

| Tool | Purpose | Command | Output |
|------|---------|---------|--------|
| **psql** | SQL queries, constraints | `psql postgresql://...` | Query results |
| **pgAdmin** | Visual DB inspection | Web UI | Tables, policies, data |
| **Supabase CLI** | Migrations, auth | `supabase <command>` | Status, logs |
| **Supabase SQL Editor** | Interactive SQL | Dashboard → SQL | Query results |
| **curl** | API/RLS tests | `curl -H "Authorization: Bearer ..."` | JSON, status codes |
| **Postman** | API testing | GUI + saved requests | Response bodies, times |
| **Chrome DevTools** | Browser errors | F12 → Console | Errors, network |
| **Next.js Dev Server** | API routes, pages | `npm run dev` | Errors, hot reload |
| **EXPLAIN ANALYZE** | Query performance | `explain analyze select ...;` | Plan, execution time |
| **k6 / JMeter** | Load testing | `k6 run test.js` | Throughput, latency |

---

## Example Test Execution (curl)

### Test: User A Cannot See User B's Profile

```bash
# Get JWT tokens for Alice and Bob
JWT_ALICE="eyJhbGc..." # from login response
JWT_BOB="eyJhbGc..." # from login response
PROJECT="project-id"

# Alice tries to fetch Bob's profile
curl -H "Authorization: Bearer $JWT_ALICE" \
  "https://${PROJECT}.supabase.co/rest/v1/users?id=eq.uuid-bob&select=id,email,phone"

# Expected: []
# Success: If returns empty array
# Failure: If returns [{"id": "uuid-bob", "email": "bob@test.com", ...}]
```

### Test: Booking Overlap Prevented

```bash
# Setup: Create Booking 1 (5/20–5/25)
curl -X POST \
  -H "Authorization: Bearer $JWT_BOB" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-bob",
    "vehicle_id": "vehicle-uuid",
    "location_id": "location-uuid",
    "pickup_date": "2025-05-20",
    "return_date": "2025-05-25",
    "total_price": 500
  }' \
  "https://${PROJECT}.supabase.co/rest/v1/bookings"
# Expected: 201 Created

# Attempt Booking 2 (5/23–5/27, overlaps)
curl -X POST \
  -H "Authorization: Bearer $JWT_BOB" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-bob",
    "vehicle_id": "vehicle-uuid",
    "location_id": "location-uuid",
    "pickup_date": "2025-05-23",
    "return_date": "2025-05-27",
    "total_price": 500
  }' \
  "https://${PROJECT}.supabase.co/rest/v1/bookings"
# Expected: 409 Conflict (Vehicle unavailable)
```

---

## Key Insights from Test Plan

### Security Guardrails
1. **RLS is the primary security layer** — All user data isolation enforced at DB level
2. **Verification gate prevents fraud** — Unverified users blocked at DB policy level
3. **Admin override is intentional** — Admins can create bookings for anyone (deliberate)
4. **Storage is user-scoped** — Airline ID images accessible only via signed URLs

### Business Rule Enforcement
1. **Overlapping bookings prevented** — Composite index + application-layer check
2. **8% commission calculated in API** — DB stores value, not formula
3. **Referral codes auto-generated** — Unique, shareable, hard to guess
4. **Verification stamps bookings** — Only verified users can book

### Performance Considerations
1. **Indexes on common queries** — Location, vehicle type, booking dates
2. **GIN index for JSON features** — Fast feature search
3. **Unique constraint as implicit index** — Referral code lookup instant
4. **Composite indexes for overlap checks** — (vehicle_id, pickup_date, return_date)

---

## Next Steps

1. **Allocate testing time:** 5–6 hours for comprehensive coverage
2. **Prepare test data:** Seed users, vehicles, locations
3. **Get auth tokens:** One per test user
4. **Run tests in order:** Phase 1 → 2 → 3 → 4
5. **Document failures:** File issues with test ID, steps, error
6. **Sign off:** Once all Critical tests pass
7. **Deploy with confidence:** RLS is your safety net

---

## Questions & Escalation

### If Schema is Unclear
→ See `docs/database.md` for table definitions

### If RLS Policy Fails
→ See `docs/rls-security-tests.md` for RLS test suite and troubleshooting

### If API Route Needs Building
→ See `CLAUDE.md` for development rules (API routes in `/app/api/`, service layer in `/lib/`)

### If Test Infrastructure is Missing
→ Prioritize Phase 1 tests first; build Phase 2+ automation later

---

## Documents in This Suite

1. **test-plan.md** — Complete test specifications (53 tests, all details)
2. **test-execution-checklist.md** — Matrix, phases, and failure troubleshooting
3. **rls-security-tests.md** — Detailed RLS tests with curl examples
4. **test-plan-summary.md** ← You are here (quick reference)

---

**Status:** Ready to execute  
**Last Updated:** 2025-02-15  
**Created By:** QA Agent for PilotCars

