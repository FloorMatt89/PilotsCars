# Business Context — PilotCars

## Company Overview
**PilotCars** — A specialized car rental service for verified airline crew members. Unlike traditional car rental companies that serve the general public, PilotCars focuses exclusively on the aviation industry workforce, offering no-deposit, all-inclusive rentals with unlimited miles and tolls.

**Competitive Position:** Positioned as the premium alternative to traditional car rental companies (like America Car Rental Miami), but laser-focused on the underserved airline crew market.

## Target Audience
Airline crew members and aviation industry professionals:
- Pilots (all tiers)
- Flight Attendants
- Aircraft Mechanics
- Dispatchers
- Ground Crew
- Airport employees

**Verification:** All users must verify with an airline ID before booking. This is a **closed marketplace for verified airline workers only** — not open to the general public.

## Market Position

### What Makes PilotCars Different
1. **No Deposit Model** — Eliminates the $400-$1,500 security hold that traditional rentals require
2. **All-Inclusive Pricing** — Full insurance, unlimited local miles, all tolls included; no hidden fees
3. **Niche Specialization** — Purpose-built for airline crew with flexible scheduling and rapid booking
4. **Driver Hire Services** — Optional professional driver service for crews who prefer not to self-drive
5. **Referral Revenue** — Crew members earn 8% commission on every rental referred (monthly payments or account credit)
6. **Fast Verification** — Streamlined ID upload and verification process (single image upload)
7. **Multiple Payment Options** — Debit, credit, Zelle; flexible payment methods for traveling workers

### Competitive Advantages Over America Car Rental Miami
- **Transparency:** No hidden fees; clear upfront pricing
- **Trust:** Verified crew-only community reduces liability and fraud
- **Convenience:** No deposits, faster booking, unlimited miles/tolls
- **Customer Experience:** Dedicated member portal, referral tracking, real-time commission visibility

## Value Proposition
**For Crew Members:**
- Affordable, hassle-free rental without security deposits
- Full insurance coverage included
- Unlimited local miles and tolls (no extra charges)
- Flexible scheduling that fits airline crew life
- Earn money by referring fellow crew members (8% commission per rental)

**For the Company:**
- High-margin rental business with low churn (verified, loyal crew base)
- Built-in referral marketing through crew advocacy
- Streamlined operations (no deposit holds, simplified insurance)
- Scalable across major airline hubs

## Current Build Scope (Phase 1)

What we're building NOW:
1. **User Authentication & Verification** — Crew members sign up with email, password, and airline ID image
2. **Airline ID Verification** — Admin dashboard to review and approve/reject ID uploads
3. **Vehicle Catalog** — Browse available vehicles (sedans, SUVs, vans) at rental locations
4. **Booking System** — Reserve vehicles with pickup/return dates and locations
5. **Referral Program** — Unique referral codes for each user; track referrals and commissions
6. **User Dashboard** — Booking history, referral earnings, account settings

**Database:** Supabase (users, vehicles, locations, bookings, referrals)  
**Authentication:** Supabase Auth (email/password)  
**Payments:** Stripe (future phase: process payments and referral payouts)

## Key Messaging & Brand Voice

**Tone:** Professional, crew-focused, transparent, friendly  
**Core Values:**
- "No deposit. No hidden fees. No hassle."
- "All-inclusive by default"
- "Built for airline crews, by people who understand your schedule"
- "Earn while you refer"

**Visual Identity:** (from PilotsCar research)
- **Colors:** Blue and white (professional, aviation-credible)
- **Typography:** Modern sans-serif (clean, professional)
- **Imagery:** Testimonials and crew member photos (human, relatable)
- **CTAs:** Action-oriented ("Book Now," "Start Earning," "Join Today")

## Future Scope (Phase 2+)

- Payment processing (Stripe integration)
- Referral commission payouts (wire transfer / account credit)
- Extended locations (beyond Miami; expand to other airline hubs)
- Loyalty tiers and gamification
- API integration for airline enterprise partnerships
- Mobile app (iOS/Android)
- Driver hire services integration
- Real-time fleet availability across multiple locations

## Third-Party Services
- **Supabase** — Database, authentication, file storage (airline ID images)
- **Stripe** — Payment processing and referral payouts (future)
- **Vercel** — Hosting and deployment
- **Storage Buckets** — Airline ID verification images (with signed URLs, never public)
