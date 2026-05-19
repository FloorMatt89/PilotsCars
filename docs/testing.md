# Testing

## Manual Testing Checklist

### Before Marking Any Task as Done
Run these checks locally:

1. **Build verification**
   ```bash
   npm run build
   ```
   - Must complete with zero TypeScript errors
   - No warnings in the output

2. **Dev server verification**
   ```bash
   npm run dev
   ```
   - Server starts cleanly at `http://localhost:3000`
   - No errors in terminal
   - No errors in browser console

3. **Browser testing**
   - Open each changed page in Chrome/Firefox
   - Check console for errors (F12 → Console tab)
   - Verify layout matches design (no broken spacing, alignment, colors)
   - Test animations (if any changes): play through completely, check for jank or missed frames

4. **Responsive testing**
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)
   - Check layouts don't break, text remains readable

5. **Cross-browser testing**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (if on Mac)

### Page-Specific Tests

#### Home Page (`/`)
- [ ] Hero photo loads (no broken image)
- [ ] Ken Burns zoom animation plays smoothly (desktop only if `prefers-reduced-motion` not set)
- [ ] Field ticker scrolls (or displays statically if `prefers-reduced-motion`)
- [ ] Search dock floats correctly over hero
- [ ] All sections fade in as you scroll down
- [ ] Stat counters animate up (or display final number on `prefers-reduced-motion`)
- [ ] Fleet grid displays all 9 vehicles
- [ ] Deal cards are readable
- [ ] Trust band and feature blocks render correctly

#### Vehicles Page (`/vehicles`)
- [ ] Fleet grid groups by type (Sedans, SUVs, Vans, etc.)
- [ ] Vehicle cards display brand silhouettes + optional photos
- [ ] Photos degrade to silhouettes if 404
- [ ] Search dock filters by type
- [ ] Scroll reveals work on each card
- [ ] Card hover states (if implemented)

#### Referrals Page (`/referrals`)
- [ ] Invite code card is prominent and dark
- [ ] "How it works" 3-step grid is clear
- [ ] Tier cards (First Officer, Captain, Fleet Host) display correctly
- [ ] Testimonial and stats render
- [ ] FAQ accordion opens/closes
- [ ] Final CTA is visible

#### About Page (`/about`)
- [ ] Hero photo strip displays
- [ ] Story copy reads well
- [ ] Operating pillars section is clear
- [ ] Stats band displays numbers
- [ ] Team grid shows members
- [ ] Dual block and press band render correctly

#### Contact Page (`/contact`)
- [ ] Channel cards (email, phone, support) display
- [ ] HQ block shows address/hours
- [ ] Contact form has all fields (name, email, subject, message)
- [ ] Form submission works (check console for success/error)
- [ ] Field-status band (if live) displays correctly

### Animation Tests

#### Ken Burns Zoom (Hero)
- [x] Plays smoothly at 60fps (no jank)
- [x] Zoom starts at 1.0x, ends at 1.15x
- [x] Duration is 6–8 seconds
- [x] Respects `prefers-reduced-motion: reduce` (no animation)

#### Scroll Reveals
- [x] Sections fade in (700ms) when scrolling into view
- [x] Easing is smooth, not bouncy
- [x] Respects `prefers-reduced-motion: reduce` (instant display)

#### Field Ticker
- [x] Scrolls continuously (or pauses on hover if implemented)
- [x] Text is readable
- [x] Respects `prefers-reduced-motion: reduce` (static display)

#### Stat Counters
- [x] Count up from 0 to final number (1–2 seconds)
- [x] Numbers are formatted with thousands separator
- [x] Respects `prefers-reduced-motion: reduce` (instant final number)

### Accessibility Tests

1. **Keyboard navigation**
   - Tab through all interactive elements
   - Focus states are visible
   - All buttons and links are keyboard accessible

2. **Screen reader (VoiceOver, NVDA)**
   - All images have alt text
   - Decorative images are marked `aria-hidden`
   - Buttons and links have clear labels
   - Form inputs have labels

3. **Motion sensitivity**
   - Enable `prefers-reduced-motion: reduce` in OS settings
   - Verify all animations are disabled or instant
   - Content remains readable and functional

4. **Color contrast**
   - Text meets WCAG AA minimums (4.5:1 for normal, 3:1 for large)
   - Use WebAIM Contrast Checker or similar tool

### Performance Tests

1. **Lighthouse audit** (Chrome DevTools)
   - Target: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO ≥ 90

2. **Load time**
   - First Contentful Paint (FCP): < 2s
   - Largest Contentful Paint (LCP): < 2.5s
   - Cumulative Layout Shift (CLS): < 0.1

3. **Bundle size**
   - Initial JS: < 150KB
   - CSS: < 50KB
   - Images optimized (WebP, resized for viewport)

## Testing Tools & Commands

### Local Testing
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Serve production build locally
npm run start
```

### Browser DevTools
- **Console:** Check for JavaScript errors
- **Network:** Check for failed requests, slow assets
- **Lighthouse:** Run performance audit
- **Accessibility tree:** Verify semantic HTML

### Manual Animation Scrubbing (Future)
- If animations are complex, add a scrubber timeline to slow down for frame-by-frame review
- Or use Chrome DevTools animation inspector

## Known Limitations
- Screenshots in design source may not reflect final pixel-perfect layout (static images don't capture animation)
- `prefers-reduced-motion` tests require OS-level setting change (not just browser DevTools)
- Cross-browser testing requires multiple browser installs

## Regression Testing
Before deploying, verify these don't break:
- All 5 pages render without console errors
- Navigation between pages works
- Responsive layout doesn't break at any breakpoint
- Existing animations still play smoothly
- Hero photo loads (not a 404)
