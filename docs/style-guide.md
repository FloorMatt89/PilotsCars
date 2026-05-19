# Style Guide

## Design Philosophy
Premium, modern, elegant interfaces with subtle animations and proper spacing. Editorial-grade design with intentional motion.

**Core Principles:**
- No emoji icons — use semantic iconography or illustrations
- No generic gradients — use intentional color systems
- Subtle animations — never gratuitous motion
- Proper spacing and visual hierarchy
- Cinematic, tasteful reveal sequences
- `prefers-reduced-motion` respected throughout

## Visual Language

### Typography
- **Display:** Instrument Serif (italic for accents)
- **Body:** Geist
- **Monospace:** JetBrains Mono
- **Brand Accent:** Bordeaux red for key elements

### Color System
Built on CSS variables in `app/globals.css` — based on PilotsCar brand research:
- **Primary brand color:** Professional blue (accent elements, CTAs, navigation)
- **Secondary color:** White / off-white (backgrounds, cards)
- **Text:** High-contrast dark gray or navy on light backgrounds
- **Accent colors:** Subtle grays and blues for secondary actions
- **Backgrounds:** Clean white with subtle shadow depth for cards
- **Status indicators:** Green (approved), orange (pending), red (rejected)

### Animations
All animations use GSAP with easing curves:
- **Hero reveals:** Ken Burns zoom on hero photographs (slow, cinematic)
- **Scroll reveals:** IntersectionObserver fades (700ms, restrained easing)
- **Scroll-linked:** Field ticker, stat counters, magnetic card hover
- **Transitions:** Cross-fades, scale, rotation — no bounce or spring unless playful context

### Photography & Imagery
- **Hero photographs:** Full-bleed, high-resolution, lifestyle/cinematic tone
- **Fleet silhouettes:** Branded body-type illustrations (Sedan, SUV, Van, Cargo) on warm gradients
- **Fallback strategy:** If photos fail, branded silhouettes degrade gracefully

## Grid & Layout
- Consistent padding and margins driven by design tokens
- Responsive breakpoints aligned to Next.js defaults
- Content gutters maintain readable line length (60–80 characters)
- Floating card UI over background photography (56px inset, rounded corners, shadow)

## Motion
- **Reduced motion:** All animation features must have no-motion fallbacks
- **Ken Burns:** Subtle 1.2–1.5x zoom over 6–8s on hero images
- **Scroll reveals:** Fade-up at 700ms, restrained `easeInOutCubic`
- **Ticker scroll:** Smooth, infinite loop (pause on hover optional)
- **Stat counters:** 1–2s count-up animation on scroll-into-view
- **Magnetic hover:** Card hover with subtle shift (X/Y follow mouse within bounds)

## Accessibility
- All color choices meet WCAG AA contrast minimums
- Every animation respects `prefers-reduced-motion: reduce`
- Keyboard navigation fully supported (tab order, focus states)
- Live regions for dynamic content updates (ticker, counters)
- Alt text for all images; decorative images marked as such

## File References
- Color tokens → `app/globals.css`
- Component styles → co-located with components (same directory as component file)
- Animation utilities → GSAP + `@gsap/react`
