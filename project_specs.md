# Project Specs — PilotCars Platform

## What the app does

[To be filled by researcher after company research]

**Current status:** Stub. Researcher will update after studying americacarrentalmiami.com and pilotscar.com.

---

## Who uses it

[To be filled by researcher]

---

## Tech stack

- **Language:** TypeScript
- **Framework:** Next.js@latest (App Router)
- **Backend-as-a-Service:** Supabase (Auth, Postgres, Storage, RLS)
- **Styling:** Tailwind CSS
- **Payments:** Stripe (future)
- **Mobile:** Expo React Native (future, separate repo)
- **Deployment:** Vercel (website), EAS (mobile)

---

## Pages and user flows

[To be filled by team]

---

## Data models

Supabase Postgres. Full schema + RLS in `supabase/migrations/0001_init_schema.sql`.
Detailed reference in `docs/database.md`.

- **users** — profile, 1:1 with `auth.users`. Holds airline ID image path + verification state.
- **locations** — rental pickup/return sites (Miami, Orlando, expandable).
- **vehicles** — fleet; `daily_rate` is all-inclusive (insurance, miles, tolls). No deposit.
- **bookings** — rentals; `total_price = daily_rate * num_days`. Verified users only.
- **referrals** — 8% commission tracking; links a referrer, a referred user, and the booking that triggered the commission.

Admin access is gated by a JWT `app_metadata.role = 'admin'` claim (helper `public.is_admin()`).
Airline ID images live in the private `airline-ids` storage bucket, accessed via signed URLs only.

---

## Third-party services

- Supabase
- Stripe (future)

---

## Definition of "done"

[To be filled by researcher + manager]
