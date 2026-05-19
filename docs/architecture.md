# Architecture

## Project Type
**Static marketing website** — no backend database, authentication, or API routes in scope.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** CSS variables (design system tokens in `app/globals.css`)
- **Animation:** GSAP (`gsap` + `@gsap/react`)
- **Hosting:** Vercel
- **External Services:** Google Fonts, Unsplash CDN

## Page Structure
All pages are **public** (no authentication required):

1. **Home** (`/`)
   - Full-bleed hero photograph with Ken Burns zoom
   - Editorial headline ("Drive away.")
   - Brass-tagged scrolling ICAO field ticker
   - Floating search dock
   - Stat band
   - Fleet grid (vehicles)
   - Location chips
   - Deal cards
   - Trust band
   - Dual feature block

2. **Vehicles** (`/vehicles`)
   - Page header
   - Compact inline search dock
   - Fleet grid grouped by type (Sedans, SUVs, Mini-vans, Passenger vans, Cargo vans)
   - Vehicle card design: branded silhouette tile + optional photo overlay

3. **Referrals** (`/referrals`)
   - Page header
   - Dark invite-code card
   - "How it works" 3-step grid
   - Tier cards (First Officer / Captain / Fleet Host)
   - Testimonial + stats
   - FAQ accordion
   - Final CTA

4. **About** (`/about`)
   - Page header
   - Hero photo strip
   - Story copy
   - Three operating pillars
   - Dark stats band
   - Team grid
   - Dual block
   - Press band
   - Final CTA

5. **Contact** (`/contact`)
   - Page header
   - Channel cards + HQ block
   - Contact form
   - Live field-status band

## Directory Layout
```
/app
  /api                    # [Not in scope] Backend routes (future)
  /(admin)                # [Not in scope] Admin pages (future)
  /interview/[token]      # [Not in scope] Interview pages (future)
  layout.tsx              # Root layout
  page.tsx                # Home page
  /vehicles               # Vehicles page
  /referrals              # Referrals page
  /about                  # About page
  /contact                # Contact page
  globals.css             # Design tokens (CSS variables)

/components               # Reusable components (Nav, Footer, Cards, etc.)
/lib                      # Shared utilities (currently empty; for future API helpers)
/public                   # Static assets (images, logos, icons)
/supabase                 # [Not in scope] Database setup (future)
```

## Data Flow
No API calls or database queries — all content is **static JSX/HTML**:
```
User visits page → Next.js renders JSX → Browser displays HTML/CSS/JS → GSAP animates
```

Contact form (if implemented): → Form submission → Email handler or third-party service

## Key Architectural Decisions

### Why CSS variables instead of Tailwind?
- Design system is self-contained and language-agnostic
- Easier to maintain tokens across pages
- Supports dynamic theme switching in future
- Better performance for this static site

### Why GSAP instead of CSS animations?
- Fine-grained scroll control (Ken Burns, ticker scroll, scroll-reveal)
- Consistent easing and timing across browsers
- ScrollTrigger integration for performant scroll-linked animations
- Easier to test and adjust animation curves

### Why no component library?
- Site is small (5 pages); component overhead is premature
- Each page has its own layout and design
- Reusable patterns (cards, buttons, grids) are simple CSS
- As the site scales, extract patterns into `/components`

## Animation Architecture

### Scroll-Triggered Reveals
- **Tool:** IntersectionObserver + GSAP ScrollTrigger
- **Trigger:** Element enters viewport (80% threshold)
- **Animation:** Fade + slight translate-up (700ms)
- **Fallback:** `prefers-reduced-motion` → no animation (instant display)

### Ken Burns Hero Zoom
- **Tool:** GSAP timeline, mounted in useEffect
- **Duration:** 6–8 seconds (slow, cinematic)
- **Scale:** 1.0 → 1.15x
- **Fallback:** `prefers-reduced-motion` → static image (no zoom)

### Field Ticker Scroll
- **Tool:** Continuous CSS scroll animation OR GSAP loop
- **Content:** ICAO airport codes + vehicle count (e.g., "KORD · 312 · KATL · 274")
- **Interaction:** Pause on hover (optional)
- **Fallback:** Static content visible, no scroll (prefers-reduced-motion)

### Stat Counter Count-Up
- **Tool:** GSAP fromTo animation on scroll-into-view
- **Duration:** 1–2 seconds
- **Format:** Display integer with thousands separator
- **Fallback:** Display final number instantly

### Magnetic Card Hover (Future)
- **Tool:** GSAP to() on mouse move
- **Effect:** Subtle X/Y shift following mouse within card bounds
- **Duration:** 100ms ease-out
- **Fallback:** Hover state only (no motion)

## Build & Deployment
- **Build:** `npm run build` → optimized static site
- **Dev:** `npm run dev` → localhost:3000 with hot reload
- **Deploy:** Vercel (automatic from git)
- **Performance:** Static pre-rendering, image optimization, font subsetting

## Future Architecture (Not In Scope)
- Supabase integration (Auth, Postgres, Storage) for authenticated features
- API routes (`/app/api/`) for backend logic
- Server components for sensitive operations (RLS-protected queries)
- Admin dashboard (`/app/(admin)/`) for fleet and referral management
