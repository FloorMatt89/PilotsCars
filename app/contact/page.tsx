import Link from "next/link";
import AnimationProvider from "@/components/AnimationProvider";
import ContactForm from "@/components/ContactForm";
import { IconMessage, IconMail, IconPhone, IconShield, IconPaperPlane } from "@/components/Icons";

export const metadata = { title: "Contact — PilotCars" };

export default function ContactPage() {
  return (
    <main>
      <AnimationProvider />

      <section className="pagehead wrap" data-hero-reveal>
        <div className="pagehead-row">
          <div>
            <span className="eyebrow">Crew support</span>
            <h1 style={{ marginTop: 12 }}>Talk to <em className="editorial-italic">a real human</em>.</h1>
            <p className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Contact</p>
          </div>
          <p>Questions about booking, verification, or the referral program? We respond fast — most messages answered within 4 hours during US business hours.</p>
        </div>
      </section>

      <section className="section wrap" data-reveal>
        <div className="contactlayout">
          {/* Channels */}
          <div>
            <div className="contactchannels" data-stagger>
              {[
                {
                  Icon: IconMail,
                  title: "General inquiries",
                  meta: "Booking questions, verification help, anything not urgent.",
                  val: "crew@pilotcars.com",
                },
                {
                  Icon: IconPhone,
                  title: "Urgent support",
                  meta: "Locked out, accident, or need immediate help. Available 24/7.",
                  val: "+1 (888) 555-CREW",
                },
                {
                  Icon: IconShield,
                  title: "Verification & ID issues",
                  meta: "Problems with your airline ID upload or approval status.",
                  val: "verify@pilotcars.com",
                },
                {
                  Icon: IconPaperPlane,
                  title: "Referral program questions",
                  meta: "Questions about earning commission, payouts, or your referral code.",
                  val: "referrals@pilotcars.com",
                },
                {
                  Icon: IconMessage,
                  title: "Press & partnerships",
                  meta: "Media inquiries, airline enterprise partnerships, and collaboration.",
                  val: "press@pilotcars.com",
                },
              ].map(({ Icon, title, meta, val }) => (
                <a className="channelcard" href={`mailto:${val.includes('@') ? val : '#'}`} key={title}>
                  <div className="channelcard-icon"><Icon width={22} height={22} /></div>
                  <div className="channelcard-body">
                    <span className="channelcard-title">{title}</span>
                    <span className="channelcard-meta">{meta}</span>
                    <span className="channelcard-val">{val}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Referral program highlight */}
            <div style={{ marginTop: 32, padding: 28, border: "1px solid var(--color-hairline)", borderRadius: "var(--radius-md)", background: "var(--color-surface-soft)" }}>
              <span className="eyebrow eyebrow--ink">Referral program</span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 500, margin: "10px 0 8px", letterSpacing: "-0.01em" }}>
                Earn 8% on every booking you refer
              </h3>
              <p style={{ fontSize: 14, color: "var(--color-muted)", marginBottom: 16 }}>
                Share your unique referral code with fellow crew members. Every time they complete a booking, you earn 8% commission — paid monthly or as account credit.
              </p>
              <Link
                href="/referrals"
                style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 500, color: "var(--color-ink)", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                Learn about the referral program
              </Link>
            </div>

            {/* HQ block */}
            <div style={{ marginTop: 16, padding: 28, border: "1px solid var(--color-hairline)", borderRadius: "var(--radius-md)", background: "var(--color-canvas)" }}>
              <span className="eyebrow eyebrow--ink">Locations</span>
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <div className="channelcard-title">Miami</div>
                  <p className="body-sm" style={{ color: "var(--color-muted)", marginTop: 6 }}>
                    Miami International Airport area<br />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>KMIA · Serving crew since launch</span>
                  </p>
                </div>
                <div>
                  <div className="channelcard-title">Orlando</div>
                  <p className="body-sm" style={{ color: "var(--color-muted)", marginTop: 6 }}>
                    Orlando International Airport area<br />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>KMCO · Active location</span>
                  </p>
                </div>
              </div>
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--color-muted)" }}>
                More airline hubs coming soon. If your base is not listed, <a href="mailto:crew@pilotcars.com" style={{ color: "var(--color-ink)", textDecoration: "underline" }}>let us know</a>.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
