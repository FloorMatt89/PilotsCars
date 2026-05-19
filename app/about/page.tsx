import Link from "next/link";
import AnimationProvider from "@/components/AnimationProvider";
import { IconShield, IconPaperPlane, IconKey, IconUser, IconArrowRight, IconCheck } from "@/components/Icons";

export const metadata = { title: "About — PilotCars" };

export default function AboutPage() {
  return (
    <main>
      <AnimationProvider />

      {/* PAGE HEAD */}
      <section className="pagehead wrap" data-hero-reveal>
        <div className="pagehead-row">
          <div>
            <span className="eyebrow">Car rental for verified airline crew</span>
            <h1 style={{ marginTop: 12 }}>Built for crew.<br /><em className="editorial-italic">Not the counter.</em></h1>
            <p className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; About</p>
          </div>
          <p>PilotCars is a specialized car rental service for verified airline crew — pilots, flight attendants, mechanics, dispatchers, and ground crew. No deposits. All-inclusive pricing. Verified members only.</p>
        </div>
      </section>

      {/* HERO IMAGE */}
      <section className="wrap" style={{ paddingTop: 40 }} data-reveal>
        <div style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", aspectRatio: "16 / 7", background: "#1a1a1a" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=80"
            alt="Regional airline ramp at dusk"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            data-kenburns
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.65) 100%)" }} />
          <div style={{ position: "absolute", left: 40, bottom: 32, right: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: "var(--color-on-dark)", flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="eyebrow eyebrow--on-dark" style={{ display: "block", marginBottom: 8 }}>The PilotCars difference</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 500, letterSpacing: "-0.02em", color: "#fff", margin: 0, maxWidth: 500 }}>
                No deposit. No hidden fees.<br />
                <em className="editorial-italic" style={{ color: "#F0CB6B" }}>No nonsense.</em>
              </h2>
            </div>
            <span className="eyebrow eyebrow--on-dark" style={{ fontFamily: "var(--font-mono)" }}>Miami · Orlando · Expanding</span>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section wrap" data-reveal>
        <div className="aboutintro">
          <div>
            <span className="eyebrow eyebrow--ink">Our story</span>
            <h2 style={{ marginTop: 12 }}>The car rental industry wasn&apos;t built for airline crew. We fixed that.</h2>
          </div>
          <div>
            <p>Every time a crew member lands, the same problem plays out: a $400–$1,500 deposit hold on their debit card, a line at the counter, and a bill that&apos;s somehow always higher than the quote. PilotCars was built to end that.</p>
            <p>We started in Miami — one of the busiest crew layover cities in the US — with one simple promise: no deposit, all-inclusive pricing, verified crew only. Insurance, unlimited local miles, and tolls are included in the daily rate. No surprise charges at drop-off.</p>
            <p>Today we serve crew at Miami and Orlando, with more hubs on the way. Every member is verified with a valid airline ID. Every price is exactly what you see at booking. That&apos;s the whole model.</p>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">Who we serve</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>If you work in aviation, you qualify.</h2>
            <p>PilotCars is a closed marketplace. All members must verify their airline ID before booking. No exceptions — this protects the rates and the community.</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} data-stagger>
          {[
            { Icon: IconUser, role: "Pilots", detail: "All tiers — regional, mainline, charter" },
            { Icon: IconShield, role: "Flight Attendants", detail: "Domestic and international routes" },
            { Icon: IconKey, role: "Mechanics & Technicians", detail: "A&P licensed and line maintenance" },
            { Icon: IconPaperPlane, role: "Dispatchers", detail: "Flight operations and OCC crew" },
            { Icon: IconUser, role: "Ground Crew", detail: "Ramp agents, fuelers, loaders" },
            { Icon: IconShield, role: "Airport Employees", detail: "Any airline-affiliated airport worker" },
          ].map(({ Icon, role, detail }) => (
            <div key={role} className="pillar" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="pillar-bullet"><Icon width={20} height={20} /></div>
              <h3 style={{ fontSize: 17 }}>{role}</h3>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">How we&apos;re different</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>Three things we will never change</h2>
          </div>
        </div>
        <div className="pillarsgrid" data-stagger>
          {[
            {
              Icon: IconShield,
              h: "No deposit. Ever.",
              p: "Traditional rental companies hold $400–$1,500 on your debit card. PilotCars doesn't. Your money stays in your account until the rental is complete.",
            },
            {
              Icon: IconPaperPlane,
              h: "All-inclusive pricing.",
              p: "Your daily rate includes full insurance coverage, unlimited local miles, and all tolls. The price at booking is the price you pay. No add-ons at pickup.",
            },
            {
              Icon: IconKey,
              h: "Verified crew only.",
              p: "Every member uploads a valid airline ID. This keeps the community trusted and the rates competitive — when liability risk is lower, prices stay lower.",
            },
          ].map(({ Icon, h, p }) => (
            <div className="pillar" key={h}>
              <div className="pillar-bullet"><Icon width={22} height={22} /></div>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BAND */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div className="statsband">
          <h2>Built around<br /><em className="editorial-italic">crew needs.</em></h2>
          <div>
            <div className="statsband-num">$0</div>
            <div className="statsband-label">Deposit required</div>
          </div>
          <div>
            <div className="statsband-num">8<span style={{ fontSize: "0.45em", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>%</span></div>
            <div className="statsband-label">Referral commission</div>
          </div>
          <div>
            <div className="statsband-num">100<span style={{ fontSize: "0.45em", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>%</span></div>
            <div className="statsband-label">Verified crew members</div>
          </div>
        </div>
      </section>

      {/* REFERRAL HIGHLIGHT */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div className="dualblock">
          <div>
            <div className="dualblock-card">
              <div className="dualblock-icon"><IconPaperPlane width={22} height={22} /></div>
              <h3>Refer crew.<br /><em className="editorial-italic" style={{ color: "#F0CB6B" }}>Earn 8%.</em></h3>
              <p>Every time someone you refer completes a booking, you earn 8% commission. No cap. Monthly payouts or account credit — your choice.</p>
              <Link className="btn-dark" href="/referrals">How referrals work <IconArrowRight strokeWidth={2} /></Link>
            </div>
          </div>

          <div className="dualblock-photo" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80')" }}>
            <div className="dualblock-photo-content">
              <span className="eyebrow eyebrow--on-dark">What&apos;s included</span>
              <h2 className="h-section" style={{ marginTop: 14, color: "#fff" }}>
                Insurance.<br />Miles. Tolls.<br />
                <em className="editorial-italic" style={{ color: "#F0CB6B" }}>All in.</em>
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">vs. traditional rental</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>What crew actually care about</h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} data-stagger>
          {/* PilotCars column */}
          <div style={{ background: "#1a1a1a", color: "var(--color-on-dark)", borderRadius: "var(--radius-md)", padding: "32px 28px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-brass)", marginBottom: 16 }}>PilotCars</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
              {[
                "No deposit or hold on your card",
                "All-inclusive daily rate",
                "Unlimited local miles",
                "All tolls included",
                "Full insurance coverage",
                "Flexible pickup and return times",
                "8% referral commission",
                "Verified crew community",
              ].map((item) => (
                <li key={item} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "rgba(255,255,255,0.86)" }}>
                  <IconCheck width={16} height={16} style={{ color: "#6FCF97", flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Traditional column */}
          <div style={{ background: "var(--color-canvas)", border: "1px solid var(--color-hairline)", borderRadius: "var(--radius-md)", padding: "32px 28px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: 16 }}>Traditional Rental</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
              {[
                "$400–$1,500 deposit hold",
                "Base rate + fees + insurance add-ons",
                "Mileage limits on many plans",
                "Tolls billed separately after return",
                "Insurance sold separately at counter",
                "Set pickup / return windows",
                "No referral earnings",
                "Open to anyone",
              ].map((item) => (
                <li key={item} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--color-muted)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-error)", flexShrink: 0 }}>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="wrap" style={{ padding: "0 32px 80px" }} data-reveal>
        <div className="cta-final">
          <div>
            <span className="eyebrow eyebrow--ink">Ready to book?</span>
            <h2 style={{ marginTop: 10 }}>
              No deposit. No hidden fees.<br />
              <em className="editorial-italic">Just drive.</em>
            </h2>
          </div>
          <div className="cta-final-actions">
            <Link className="btn-secondary" href="/contact">Talk to us</Link>
            <Link className="btn-primary" href="/signup">Create crew account</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
