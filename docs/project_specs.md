# Pilot Cars — project_specs.md

## What the app does
A marketing/marketplace website for **Pilot Cars** — a closed peer-to-peer car-share marketplace for verified airline crew. The site has 5 public pages that present the brand, the fleet, the referral program, the company story, and contact channels.

## Who uses it
Airline crew (pilots, F/As, mechanics, dispatchers, ground crew) browsing to learn about the marketplace, browse cars, refer colleagues, or contact the team.

## Tech stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** CSS variables (Pilot Design System tokens in `app/globals.css`)
- **Animation:** GSAP (`gsap` + `@gsap/react`)
- **Deployment target:** Vercel (no backend in this scope)

## Pages and user flows (all public)
1. `/` (Home) — full-bleed hero photograph with Ken Burns zoom, editorial headline, brass-tagged scrolling ICAO field ticker, floating search dock, stat band, fleet grid (vehicles), location chips, deal cards, trust band, dual feature block.
2. `/vehicles` — page header, compact inline search dock, fleet grouped by type (Sedans, SUVs, Mini-vans, Passenger vans, Cargo vans).
3. `/referrals` — page header, dark invite-code card, "how it works" 3-step grid, tier cards (First Officer / Captain / Fleet host), testimonial + stats, FAQ accordion, final CTA.
4. `/about` — page header, hero photo strip, story copy, three operating pillars, dark stats band, team grid, dual block, press band, final CTA.
5. `/contact` — page header, channel cards + HQ block, contact form, live field-status band.

## Data models
None. Content is static (marketing site). All copy and structure lives in JSX.

## Third-party services
- Google Fonts (Geist, Instrument Serif, JetBrains Mono)
- Unsplash CDN for hero photographs (URLs hard-coded from the design source — same images the prototype uses)

## "Done" looks like
- All 5 pages render at parity with the design prototype
- GSAP animations are wired up tastefully (subtle, no cheese): hero reveal, scroll-reveal sections, ticker, ken-burns, magnetic hover, stat count-up
- `prefers-reduced-motion` respected — every animation has a no-motion fallback
- `npm run build` passes with zero TypeScript errors
- `npm run dev` boots cleanly at http://localhost:3000
