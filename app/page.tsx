import Link from "next/link";
import VehicleCard from "@/components/VehicleCard";
import AnimationProvider from "@/components/AnimationProvider";
import ScrollVideoStory from "@/components/ScrollVideoStory";
import AirlineMarquee from "@/components/AirlineMarquee";
import {
  IconPin, IconCalendar, IconBadge, IconSearch,
  IconArrowRight, IconPaperPlane,
} from "@/components/Icons";

const FIELDS = [
  ["KORD", "Chicago O'Hare", "312"],
  ["KATL", "Atlanta", "274"],
  ["KDFW", "Dallas–Fort Worth", "228"],
  ["KLAX", "Los Angeles", "196"],
  ["KDEN", "Denver", "184"],
  ["KSEA", "Seattle", "142"],
  ["KBOS", "Boston Logan", "118"],
  ["KMSP", "Minneapolis", "102"],
  ["KCLT", "Charlotte", "96"],
];

const CHIPS = [
  ["KORD", "Chicago O'Hare"], ["KLAX", "Los Angeles"], ["KATL", "Atlanta"],
  ["KDFW", "Dallas–Fort Worth"], ["KDEN", "Denver"], ["KSEA", "Seattle"],
  ["KBOS", "Boston Logan"], ["KMSP", "Minneapolis"], ["KPHX", "Phoenix Sky Harbor"],
  ["KCLT", "Charlotte"], ["KMIA", "Miami"], ["KIAH", "Houston Intercontinental"],
  ["KSLC", "Salt Lake City"], ["KPDX", "Portland"], ["KSAN", "San Diego"],
  ["KMCO", "Orlando"],
];

export default function HomePage() {
  return (
    <main>
      <AnimationProvider />

      {/* ============ HERO ============ */}
      <section className="hero-shell" id="home-hero">
        <video
          className="hero-video"
          src="/toyota-hero.mp4"
          autoPlay
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="hero-grain" />

        <div className="hero-content">
          <span className="hero-badge" data-hero-reveal>
            <span className="hero-badge-dot" />
            Verified airline crew only — No deposit required
          </span>

          <h1 className="hero-h1" data-hero-reveal>
            Wheels down.<br />
            <em className="editorial-italic">Drive away.</em>
          </h1>

          <p className="hero-sub" data-hero-reveal>
            No deposits. No hidden fees. All-inclusive pricing with unlimited miles and
            tolls — for verified airline crew only.
          </p>

          {/* Hero CTAs */}
          <div data-hero-reveal style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/vehicles" className="btn-primary" style={{ height: 48, padding: "0 28px", fontSize: 15 }}>
              Browse vehicles
            </Link>
            <Link href="/referrals" className="btn-dark" style={{ height: 48, padding: "0 24px", fontSize: 15 }}>
              Earn 8% — Refer crew <IconArrowRight width={14} height={14} strokeWidth={2} />
            </Link>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", height: 48, padding: "0 20px", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>
              Sign in
            </Link>
          </div>
        </div>

        <div className="hero-strip" aria-hidden="true" data-hero-reveal>
          <span className="hero-strip-num">No. 01 / 38</span>
          <span style={{ color: "var(--color-body)" }}>Fields online</span>
          <div className="hero-strip-track">
            <div className="hero-strip-row" data-ticker data-ticker-speed="38">
              {[...FIELDS, ...FIELDS].map(([code, name, count], i) => (
                <span key={`${code}-${i}`}>
                  <b>{code}</b>
                  {name} · {count} cars
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Search dock */}
        <div className="searchdock" data-hero-reveal>
          <div className="searchdock-row">
            <div className="searchdock-cell">
              <span className="searchdock-label">Pick-up field</span>
              <div className="searchdock-value">
                <IconPin /><input type="text" placeholder="ICAO or city" defaultValue="KORD · Chicago O'Hare" />
              </div>
            </div>
            <div className="searchdock-cell">
              <span className="searchdock-label">Drop-off field</span>
              <div className="searchdock-value">
                <IconPin /><input type="text" defaultValue="Same as pick-up" />
              </div>
            </div>
            <div className="searchdock-cell">
              <span className="searchdock-label">Pick-up date &amp; time</span>
              <div className="searchdock-value">
                <IconCalendar /><input type="text" defaultValue="May 22 · 14:30" />
              </div>
            </div>
            <div className="searchdock-cell">
              <span className="searchdock-label">Drop-off date &amp; time</span>
              <div className="searchdock-value">
                <IconCalendar /><input type="text" defaultValue="May 25 · 09:00" />
              </div>
            </div>
            <div className="searchdock-cell">
              <span className="searchdock-label">Crew ID</span>
              <div className="searchdock-value">
                <IconBadge />
                <select defaultValue="UAL — Pilot">
                  <option>UAL — Pilot</option>
                  <option>AAL — Flight attendant</option>
                  <option>DAL — Mechanic</option>
                  <option>Family member</option>
                </select>
              </div>
            </div>
            <Link href="/vehicles" className="searchdock-submit" style={{ textDecoration: "none" }}>
              <IconSearch /> Search
            </Link>
          </div>
          <div className="searchdock-foot">
            <span>Trip type</span>
            <div className="seg-pills">
              <span className="seg-pill is-active">Round trip</span>
              <span className="seg-pill">One way</span>
              <span className="seg-pill">Monthly</span>
            </div>
            <span style={{ marginLeft: "auto" }}>Filter</span>
            <div className="seg-pills">
              <span className="seg-pill is-active">Self-drive</span>
              <span className="seg-pill">With driver</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AIRLINE LOGO MARQUEE (between hero & scroll story) ============ */}
      <AirlineMarquee />

      {/* ============ SCROLL-SCRUBBED SERVICES STORY ============ */}
      <ScrollVideoStory />

      {/* ============ STAT BAND ============ */}
      <section className="statband" data-reveal>
        <div className="statband-inner" data-stagger>
          <div>
            <div className="stat-num">
              <span data-count-to="38">38</span> <em className="editorial-italic">fields</em>
            </div>
            <div className="stat-label">Active locations</div>
          </div>
          <div>
            <div className="stat-num"><span>$0</span></div>
            <div className="stat-label">Deposit required</div>
          </div>
          <div>
            <div className="stat-num">
              <span data-count-to="8">8</span><span style={{ color: "var(--color-muted)", fontWeight: 500 }}>%</span>
            </div>
            <div className="stat-label">Referral commission</div>
          </div>
          <div>
            <div className="stat-num">100<span style={{ color: "var(--color-muted)", fontWeight: 500, fontSize: "0.6em" }}>%</span></div>
            <div className="stat-label">Verified crew members</div>
          </div>
        </div>
      </section>

      {/* ============ TOP PICKS ============ */}
      <section className="section wrap" data-reveal>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">Available vehicles</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>
              No deposit. <em className="editorial-italic">All-inclusive.</em>
            </h2>
            <p>Sedans, SUVs, minivans, and vans — all with full insurance, unlimited miles, and tolls included. Verified crew only. No hidden fees at drop-off.</p>
          </div>
          <Link className="linkcta" href="/vehicles">See the full fleet <IconArrowRight /></Link>
        </div>

        <div className="vgrid" data-stagger>
          <VehicleCard silhouette="sedan" tag="Sedan" title="Toyota Corolla LE Hybrid" rating="4.91" meta="0.8 mi from KORD · Marcus T. · Dispatcher" specs={["5 seats", "Auto", "Hybrid · 50 mpg"]} price="$38" background="linear-gradient(135deg, #8b2222 0%, #3a0d0d 100%)" href="/vehicles" redCorolla />
          <VehicleCard silhouette="suv" tag="SUV" title="Nissan Rogue SV · AWD" rating="4.92" meta="0.6 mi from KORD · Captain Reyes" specs={["5 seats", "CVT", "AWD"]} price="$56" background="linear-gradient(135deg, #3a5566 0%, #19262e 100%)" href="/vehicles" />
          <VehicleCard silhouette="minivan" tag="Mini-van" title="Honda Odyssey EX-L" rating="4.88" meta="2.3 mi from KDEN · Sam W. · Mechanic" specs={["8 seats", "Auto", "V6 · 28 mpg"]} price="$72" background="linear-gradient(135deg, #5a6b80 0%, #1f2935 100%)" href="/vehicles" />
          <VehicleCard silhouette="passenger" tag="Passenger Van" title="Mercedes Sprinter 2500 · 15-passenger" rating="4.95" meta="1.6 mi from KORD · Pilot Fleet ops" specs={["15 seats", "Auto", "Diesel · High roof"]} price="$165" background="linear-gradient(135deg, #5a6068 0%, #20232a 100%)" href="/vehicles" />
          <VehicleCard silhouette="sedan" tag="Sedan" title="Nissan Sentra SV" rating="4.84" meta="1.4 mi from KATL · Priya M. · Pilot" specs={["5 seats", "CVT", "Gas · 33 mpg"]} price="$36" background="linear-gradient(135deg, #4d5a68 0%, #1f262e 100%)" href="/vehicles" />
          <VehicleCard silhouette="suv" tag="SUV" title="Nissan Kicks SR" rating="4.86" meta="1.1 mi from KLAX · Karen H. · F/A" specs={["5 seats", "CVT", "FWD · 36 mpg"]} price="$46" background="linear-gradient(135deg, #a0683d 0%, #2e1a0c 100%)" href="/vehicles" />
          <VehicleCard silhouette="minivan" tag="Mini-van" title="Kia Carnival SX" rating="4.90" meta="1.8 mi from KBOS · Jamie R. · F/A" specs={["8 seats", "Auto", "V6 · 26 mpg"]} price="$78" background="linear-gradient(135deg, #7a6450 0%, #2a2218 100%)" href="/vehicles" />
          <VehicleCard silhouette="cargo" tag="Cargo Van" title='Mercedes Sprinter Cargo 2500 · 170″ High roof' rating="4.91" meta="3.1 mi from KMSP · Pilot Fleet ops" specs={["2 seats", "Auto", "Diesel · 533 cu ft"]} price="$142" background="linear-gradient(135deg, #4a5260 0%, #1a1f26 100%)" href="/vehicles" />
        </div>
      </section>

      {/* ============ FIELDS ============ */}
      <section className="section wrap" data-reveal style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">Active locations</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>Currently serving Miami and Orlando</h2>
            <p>PilotCars is live at Miami and Orlando with more airline hubs coming. Tell us where your crew base is — we expand to meet demand.</p>
          </div>
          <Link className="linkcta" href="/vehicles">Browse available vehicles <IconArrowRight /></Link>
        </div>
        <div className="chips" data-stagger>
          {CHIPS.map(([code, name]) => (
            <a key={code} className="chip" href="/vehicles">
              <span className="chip-code">{code}</span> {name}
            </a>
          ))}
        </div>
      </section>

      {/* ============ DEALS ============ */}
      <section className="section wrap" data-reveal style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">Why PilotCars</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>Everything traditional rental gets wrong</h2>
          </div>
          <Link className="linkcta" href="/referrals">View referral program <IconArrowRight /></Link>
        </div>
        <div className="deals">
          <article className="dealcard">
            <div className="dealcard-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80')" }} />
            <div className="dealcard-inner">
              <span className="dealcard-validity">No deposit</span>
              <div>
                <div className="dealcard-title">Traditional rental holds $400–$1,500 on your card. PilotCars holds nothing.</div>
                <div className="dealcard-pct">$0<sub>deposit, ever</sub></div>
              </div>
              <span className="dealcard-fine">Your money stays in your account. Pay only for the rental itself.</span>
            </div>
          </article>
          <article className="dealcard">
            <div className="dealcard-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80')" }} />
            <div className="dealcard-inner">
              <span className="dealcard-validity">All-inclusive pricing</span>
              <div>
                <div className="dealcard-title">Insurance, unlimited local miles, and all tolls included in every booking.</div>
                <div className="dealcard-pct">1<span style={{ fontSize: "0.5em" }}>×</span><sub>price, no surprises</sub></div>
              </div>
              <span className="dealcard-fine">The price at booking is the price you pay. Verified crew ID required to book.</span>
            </div>
          </article>
        </div>
      </section>

      {/* ============ DUAL BLOCK ============ */}
      <section className="section wrap" data-reveal>
        <div className="dualblock">
          <div>
            <div className="dualblock-card">
              <div className="dualblock-icon"><IconPaperPlane width={22} height={22} /></div>
              <h3>Refer crew.<br />Earn 8%.</h3>
              <p>Share your referral code with fellow crew members. Every time someone you refer completes a booking, you earn 8% commission — paid monthly or as account credit.</p>
              <Link className="btn-dark" href="/referrals">How referrals work <IconArrowRight strokeWidth={2} /></Link>
            </div>
            <div className="fleetstat">
              <div>
                <div className="fleetstat-label">Referral commission earned</div>
                <div className="fleetstat-num">8<span style={{ fontSize: "0.5em", fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>%</span></div>
              </div>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 14a9 9 0 0 1 18 0" />
                <path d="M12 14l4-4" />
              </svg>
            </div>
          </div>

          <div className="dualblock-photo" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80')" }}>
            <div className="dualblock-photo-content">
              <span className="eyebrow eyebrow--on-dark">No deposit required</span>
              <h2 className="h-section" style={{ marginTop: 14, color: "#fff" }}>
                Insurance, miles,<br />
                tolls.<br />
                <em className="editorial-italic" style={{ color: "#F0CB6B" }}>All in.</em>
              </h2>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
