import Link from "next/link";
import AnimationProvider from "@/components/AnimationProvider";
import ContactForm from "@/components/ContactForm";
import { IconMessage, IconMail, IconPhone, IconShield, IconPaperPlane } from "@/components/Icons";

export const metadata = { title: "Contact — Pilot Cars" };

const FIELDS = [
  ["KORD", "Chicago O'Hare · 312 cars · 4 min reply"],
  ["KATL", "Atlanta · 274 cars · 3 min reply"],
  ["KDFW", "Dallas–Fort Worth · 228 cars · 5 min reply"],
  ["KLAX", "Los Angeles · 196 cars · 6 min reply"],
  ["KDEN", "Denver · 184 cars · 5 min reply"],
  ["KSEA", "Seattle · 142 cars · 4 min reply"],
  ["KBOS", "Boston Logan · 118 cars · 6 min reply"],
  ["+30", "More fields · See the full roster"],
];

export default function ContactPage() {
  return (
    <main>
      <AnimationProvider />

      <section className="pagehead wrap" data-hero-reveal>
        <div className="pagehead-row">
          <div>
            <span className="eyebrow">Crew support</span>
            <h1 style={{ marginTop: 12 }}>Talk to <em className="editorial-italic">a human in uniform</em>.</h1>
            <p className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Contact</p>
          </div>
          <p>Every line on this page rings a crew member — not a contact center. Median first response is 4 minutes during US ramp hours.</p>
        </div>
      </section>

      <section className="section wrap" data-reveal>
        <div className="contactlayout">
          {/* Channels */}
          <div>
            <div className="contactchannels" data-stagger>
              {[
                { Icon: IconMessage, title: "Crew chat", meta: "In the app, 24/7. Always a verified crew member on the other end.", val: "Open live chat →" },
                { Icon: IconMail, title: "General inquiries", meta: "Booking questions, host signup, anything not urgent. We reply within 4 hours.", val: "crew@pilotcars.com" },
                { Icon: IconPhone, title: "Ramp-side urgent", meta: "Locked out, accident, host no-show. 24/7 dispatch line.", val: "+1 (888) 555-RAMP" },
                { Icon: IconShield, title: "Verification & trust", meta: "Crew ID issues, host disputes, anything safety-related.", val: "trust@pilotcars.com" },
                { Icon: IconPaperPlane, title: "Press & partnerships", meta: "Aviation press, airline partnerships, podcast bookings.", val: "press@pilotcars.com" },
              ].map(({ Icon, title, meta, val }) => (
                <a className="channelcard" href="#" key={title}>
                  <div className="channelcard-icon"><Icon width={22} height={22} /></div>
                  <div className="channelcard-body">
                    <span className="channelcard-title">{title}</span>
                    <span className="channelcard-meta">{meta}</span>
                    <span className="channelcard-val">{val}</span>
                  </div>
                </a>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: 28, border: "1px solid var(--color-hairline)", borderRadius: "var(--radius-md)", background: "var(--color-surface-soft)" }}>
              <span className="eyebrow eyebrow--ink">Headquarters</span>
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <div className="channelcard-title">Chicago HQ</div>
                  <p className="body-sm" style={{ color: "var(--color-muted)", marginTop: 6 }}>
                    2300 N Mannheim Rd<br />Des Plaines, IL 60018<br />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>7.2 mi from KORD ramp</span>
                  </p>
                </div>
                <div>
                  <div className="channelcard-title">Atlanta crew ops</div>
                  <p className="body-sm" style={{ color: "var(--color-muted)", marginTop: 6 }}>
                    1100 Hartsfield Center Pkwy<br />Atlanta, GA 30354<br />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>2.1 mi from KATL F/A base</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* FIELD STATUS BAND */}
      <section className="wrap" style={{ paddingBottom: 80 }} data-reveal>
        <div style={{ background: "#1a1a1a", color: "var(--color-on-dark)", borderRadius: "var(--radius-md)", padding: "48px 56px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 20 }}>
            <div>
              <span className="eyebrow eyebrow--on-dark">Live field status</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 10, color: "var(--color-on-dark)" }}>
                We&apos;re staffed at every active field, every shift.
              </h2>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#6FCF97", marginRight: 8, animation: "pulse-brass 1.8s ease-out infinite" }} />
              All 38 fields, online
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} data-stagger>
            {FIELDS.map(([code, label]) => (
              <div key={code} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)", display: "grid", gap: 6 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "#F0CB6B" }}>{code}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
