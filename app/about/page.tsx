import Link from "next/link";
import AnimationProvider from "@/components/AnimationProvider";
import { IconShield, IconPaperPlane, IconGlobe, IconKey, IconArrowRight } from "@/components/Icons";

export const metadata = { title: "About — Pilot Cars" };

export default function AboutPage() {
  return (
    <main>
      <AnimationProvider />

      <section className="pagehead wrap" data-hero-reveal>
        <div className="pagehead-row">
          <div>
            <span className="eyebrow">Built by crew, for crew</span>
            <h1 style={{ marginTop: 12 }}>A marketplace <em className="editorial-italic">flown</em> by its members.</h1>
            <p className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; About</p>
          </div>
          <p>Pilot Cars is a closed peer-to-peer car-share marketplace for airline workers. We&apos;re owned and operated by the people who use it — pilots, mechanics, F/As, dispatchers, and their direct family.</p>
        </div>
      </section>

      {/* HERO IMAGE STRIP */}
      <section className="wrap" style={{ paddingTop: 40 }} data-reveal>
        <div style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", aspectRatio: "16 / 7", background: "#1a1a1a" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2200&q=80" alt="Regional airline ramp at dusk" style={{ width: "100%", height: "100%", objectFit: "cover" }} data-kenburns />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.65) 100%)" }} />
          <div style={{ position: "absolute", left: 40, bottom: 32, right: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: "var(--color-on-dark)" }}>
            <span className="eyebrow eyebrow--on-dark">Ramp at KORD · 04:18 local</span>
            <span className="eyebrow eyebrow--on-dark" style={{ fontFamily: "var(--font-mono)" }}>N743UA · Layover crew, inbound</span>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section wrap" data-reveal>
        <div className="aboutintro">
          <div>
            <span className="eyebrow eyebrow--ink">Our story</span>
            <h2 style={{ marginTop: 12 }}>It started on a shuttle bus from KORD to a Holiday Inn.</h2>
          </div>
          <div>
            <p>Two regional first officers, one mechanic, four hours of rain delay between us. Someone said the quiet thing every layover crew has said for forty years: <i>I&apos;d just rent my car out at base if I trusted who was driving it</i>. By the time the shuttle reached the lobby, we&apos;d named the thing.</p>
            <p>Pilot Cars launched in early 2025 with seventeen hosts at four fields. Every car was driven by someone who could verify their crew badge. Every booking was someone who knew, by sight, what a captain&apos;s stripes looked like.</p>
            <p>We&apos;re now at 3,490 cars across 38 fields — still closed, still verified, still built around the simple bet that crew trusts crew more than crew trusts the counter.</p>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">How we operate</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>Three operating rules we will not bend on</h2>
          </div>
        </div>
        <div className="pillarsgrid" data-stagger>
          {[
            { Icon: IconShield, h: "Closed membership, no exceptions.", p: "Both sides of the booking are verified airline employees or their direct family. Crew badge + airline payroll match. We'd rather grow slow than open the door." },
            { Icon: IconPaperPlane, h: "Crew rates always, no surge.", p: "Daily rates are set by hosts, but we cap them inside ranges that hold even on Thanksgiving Eve. No dynamic pricing. No rate hikes when ATC goes ground-stop." },
            { Icon: IconGlobe, h: "Owned by the people who use it.", p: "40% of equity sits in a crew co-op pool. Every verified host can vest into it. Decisions about rate caps, host disputes, and new-field rollouts go through a crew council with real votes." },
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
          <h2>By the numbers,<br />so far. <em className="editorial-italic">As of May 2026.</em></h2>
          <div>
            <div className="statsband-num" data-count-to="3490">3,490</div>
            <div className="statsband-label">Cars on the manifest</div>
          </div>
          <div>
            <div className="statsband-num" data-count-to="38">38</div>
            <div className="statsband-label">Active outstations</div>
          </div>
          <div>
            <div className="statsband-num">12.4k</div>
            <div className="statsband-label">Verified crew</div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">The four behind it</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>Crew first. Founders second.</h2>
            <p>The leadership team still flies, fixes, and dispatches. Founder line cards are public on every crew member&apos;s profile.</p>
          </div>
        </div>
        <div className="team" data-stagger>
          {[
            { bg: "linear-gradient(135deg, #c9b58a, #4a3a18)", tag: "UAL · 14 yrs · KORD base", name: "Captain David Reyes", role: "Co-founder · CEO · still flying the line" },
            { bg: "linear-gradient(135deg, #c1cad6, #2b3340)", tag: "DAL · 9 yrs · KATL F/A base", name: "Marisol Pacheco", role: "Co-founder · Head of crew trust" },
            { bg: "linear-gradient(135deg, #7f9787, #1c2c25)", tag: "UAL · 18 yrs · A&P license", name: "Sam Wakeley", role: "Co-founder · Head of host ops" },
            { bg: "linear-gradient(135deg, #d8c79a, #8e7029)", tag: "DAL · 11 yrs · OCC dispatch", name: "Theo Park", role: "Co-founder · CTO" },
          ].map((t) => (
            <div key={t.name} className="teamcard">
              <div className="teamcard-photo" style={{ backgroundImage: t.bg }} />
              <p className="teamcard-bg">{t.tag}</p>
              <h3 className="teamcard-name">{t.name}</h3>
              <p className="teamcard-role">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DUAL BLOCK */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div className="dualblock">
          <div>
            <div className="dualblock-card">
              <div className="dualblock-icon"><IconKey width={22} height={22} /></div>
              <h3>List a car.<br /><em className="editorial-italic" style={{ color: "#F0CB6B" }}>Pay for your sim time.</em></h3>
              <p>The average host earns $642 a month on a single car. Captains use it to cover recurrent. F/As use it to clear their student loans. Mechanics buy tools.</p>
              <a className="btn-dark" href="#">Learn about hosting <IconArrowRight strokeWidth={2} /></a>
            </div>
          </div>

          <div className="dualblock-photo" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80')" }}>
            <div className="dualblock-photo-content">
              <span className="eyebrow eyebrow--on-dark">Where we&apos;re going</span>
              <h2 className="h-section" style={{ marginTop: 14 }}>12 more fields<br />by <em className="editorial-italic">end of &apos;26</em>.</h2>
            </div>
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="trustband" data-reveal>
        <div className="trustband-inner">
          <span className="trustband-label">As covered in</span>
          <div className="trustband-logos">
            <span>Aviation Week</span>
            <span>Flying Magazine</span>
            <span>The Air Current</span>
            <span>AINonline</span>
            <span>Skift</span>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="wrap" style={{ padding: "80px 32px" }} data-reveal>
        <div className="cta-final">
          <div>
            <span className="eyebrow eyebrow--ink">Join the manifest</span>
            <h2 style={{ marginTop: 10 }}>Verified crew?<br /><em className="editorial-italic">Lock in your spot.</em></h2>
          </div>
          <div className="cta-final-actions">
            <Link className="btn-secondary" href="/contact">Talk to a founder</Link>
            <a className="btn-primary" href="#" data-magnet data-magnet-strength="14">Join the waitlist</a>
          </div>
        </div>
      </section>
    </main>
  );
}
