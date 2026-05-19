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
            Boarding now — Founding crew waitlist
          </span>

          <h1 className="hero-h1" data-hero-reveal>
            Wheels down.<br />
            <em className="editorial-italic">Drive away.</em>
          </h1>

          <p className="hero-sub" data-hero-reveal>
            A closed marketplace for airline crew. Verified hosts, crew rates, no
            rental-counter line — at 38 fields and growing.
          </p>
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
            <button className="searchdock-submit" type="button">
              <IconSearch /> Search
            </button>
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
            <div className="stat-label">Active outstations</div>
          </div>
          <div>
            <div className="stat-num"><span data-count-to="11">11</span></div>
            <div className="stat-label">Cars on the manifest</div>
          </div>
          <div>
            <div className="stat-num">
              <span data-count-to="42">42</span><span style={{ color: "var(--color-muted)", fontWeight: 500 }}>%</span>
            </div>
            <div className="stat-label">Below counter rates</div>
          </div>
          <div>
            <div className="stat-num"><span data-count-to="12400" data-count-suffix="+">12,400+</span></div>
            <div className="stat-label">Verified crew members</div>
          </div>
        </div>
      </section>

      {/* ============ TOP PICKS ============ */}
      <section className="section wrap" data-reveal>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">The fleet at KORD this week</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>
              Eleven cars. <em className="editorial-italic">One closed roster.</em>
            </h2>
            <p>Two sedans, two SUVs, two minivans, three passenger vans, two cargo vans — every one of them on the Pilot manifest, all hosted by verified crew.</p>
          </div>
          <a className="linkcta" href="/vehicles">See the full fleet <IconArrowRight /></a>
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
            <span className="eyebrow eyebrow--ink">Launching at these fields</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>Find a car at your next outstation</h2>
            <p>The roster expands as crew on the ground sign on. Don&apos;t see your field yet? Tell us — we route hosts to the cities with crew demand.</p>
          </div>
          <a className="linkcta" href="#">View all 38 fields <IconArrowRight /></a>
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
            <span className="eyebrow eyebrow--ink">Crew-rate windows</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>Layovers worth the long taxi</h2>
          </div>
          <a className="linkcta" href="#">See all offers <IconArrowRight /></a>
        </div>
        <div className="deals">
          <article className="dealcard">
            <div className="dealcard-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80')" }} />
            <div className="dealcard-inner">
              <span className="dealcard-validity">Valid May 18 – Jun 14</span>
              <div>
                <div className="dealcard-title">Summer ramp window — Mountain bases, 3-night minimum.</div>
                <div className="dealcard-pct">40<span style={{ fontSize: "0.5em" }}>%</span><sub>off counter rate</sub></div>
              </div>
              <span className="dealcard-fine">Auto-applied at booking. Some host blackout dates apply.</span>
            </div>
          </article>
          <article className="dealcard">
            <div className="dealcard-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80')" }} />
            <div className="dealcard-inner">
              <span className="dealcard-validity">Valid through Jul 31</span>
              <div>
                <div className="dealcard-title">Long-layover discount for any booking over 5 nights, any field.</div>
                <div className="dealcard-pct">65<span style={{ fontSize: "0.5em" }}>%</span><sub>online-only rate</sub></div>
              </div>
              <span className="dealcard-fine">Verified crew ID required. Stacks with founding-member credit.</span>
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
              <h3>Beyond a rental.<br />A briefing.</h3>
              <p>Every booking comes with the host&apos;s local notes — overnight parking near the field, the diner that&apos;s open at 04:30, where to top off before drop-off.</p>
              <a className="btn-dark" href="/vehicles">Browse the manifest <IconArrowRight strokeWidth={2} /></a>
            </div>
            <div className="fleetstat">
              <div>
                <div className="fleetstat-label">Cars on the manifest today</div>
                <div className="fleetstat-num" data-count-to="3490">3,490</div>
              </div>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 14a9 9 0 0 1 18 0" />
                <path d="M12 14l4-4" />
              </svg>
            </div>
          </div>

          <div className="dualblock-photo" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80')" }}>
            <div className="dualblock-photo-content">
              <span className="eyebrow eyebrow--on-dark">Built with crew, not for them</span>
              <h2 className="h-section" style={{ marginTop: 14 }}>
                Crew rates,<br />
                <em className="editorial-italic">crew trust</em>, no counter.
              </h2>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
