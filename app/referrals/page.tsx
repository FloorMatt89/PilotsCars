import Link from "next/link";
import AnimationProvider from "@/components/AnimationProvider";
import { IconUser, IconKey, IconShield, IconCheck, IconArrowRight, IconMail, IconMessage } from "@/components/Icons";

export const metadata = { title: "Referrals — Pilot Cars" };

export default function ReferralsPage() {
  return (
    <main>
      <AnimationProvider />

      <section className="pagehead wrap" data-hero-reveal>
        <div className="pagehead-row">
          <div>
            <span className="eyebrow">Crew flies crew</span>
            <h1 style={{ marginTop: 12 }}>Refer the people you <em className="editorial-italic">already trust</em>.</h1>
            <p className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Referrals</p>
          </div>
          <p>Pilot Cars grew off layover chatter — bunkroom recommendations, shuttle-bus tips. Now those tips earn ramp credit toward your next booking, or cash back to your host payouts.</p>
        </div>
      </section>

      {/* INVITE CODE CARD */}
      <section className="wrap" style={{ paddingTop: 40 }} data-reveal>
        <div style={{ background: "#1a1a1a", color: "var(--color-on-dark)", borderRadius: "var(--radius-md)", padding: "40px 48px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <span className="eyebrow eyebrow--on-dark">Your invite code</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", margin: "12px 0 18px", color: "var(--color-on-dark)", lineHeight: 1.15 }}>
              Give $40. <em className="editorial-italic" style={{ color: "#F0CB6B" }}>Get $40.</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: 440, marginBottom: 24 }}>
              When a verified crew member books their first trip with your code, you both get $40 ramp credit. No cap on referrals.
            </p>

            <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(255,255,255,0.25)", borderRadius: "var(--radius-sm)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 600, letterSpacing: "0.08em", color: "#F0CB6B" }}>CAPT-REYES-KORD</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Tap to copy</span>
              </div>
              <button className="btn-primary" style={{ height: "auto", padding: "0 28px" }} type="button">Share invite</button>
            </div>

            <div style={{ display: "flex", gap: 32, marginTop: 28, fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              <span><b style={{ color: "#fff", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, marginRight: 6 }}>7</b>Referrals sent</span>
              <span><b style={{ color: "#fff", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, marginRight: 6 }}>4</b>Joined Pilot</span>
              <span><b style={{ color: "#F0CB6B", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, marginRight: 6 }}>$160</b>Credit earned</span>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }} data-stagger>
            {[
              { Icon: IconMail, title: "Email a crew member", sub: "Pre-filled with your invite code" },
              { Icon: IconMessage, title: "Send through chat", sub: "SMS, WhatsApp, Slack — your call" },
              { Icon: IconShield, title: "Drop in your crew lounge", sub: "Print-ready card for the bulletin" },
            ].map(({ Icon, title, sub }) => (
              <div key={title} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-sm)", padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#F0CB6B" }}>
                  <Icon width={18} height={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 500, color: "#fff" }}>{title}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{sub}</div>
                </div>
                <IconArrowRight width={14} height={14} strokeWidth={2} stroke="rgba(255,255,255,0.5)" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section wrap" data-reveal>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">How it works</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>Three steps. Real ramp credit.</h2>
          </div>
        </div>
        <div className="processgrid" data-stagger>
          {[
            { step: "Step 01", Icon: IconUser, h: "Hand your code to crew you trust.", p: "Share via email, SMS, or the printable lounge card. Your invitee verifies their crew badge during signup — that's how we keep the marketplace closed." },
            { step: "Step 02", Icon: IconKey, h: "They book their first trip on the manifest.", p: "Doesn't matter the field, the dates, or the car. As long as it's a verified booking — pickup confirmed by the host — the referral counts." },
            { step: "Step 03", Icon: IconShield, h: "Credit lands in both your wallets.", p: "$40 ramp credit hits 24 hours after trip start — yours and theirs. Stacks with crew rates, with rate-window offers, with anything else." },
          ].map(({ step, Icon, h, p }) => (
            <div key={step} className="processcard">
              <span className="processcard-step">{step}</span>
              <div className="processcard-icon"><Icon width={22} height={22} /></div>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIER CARDS */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">Tiers</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>The more crew you bring, the better the math</h2>
            <p>Every referral lifts you toward higher per-invite payouts. The Captain tier kicks in at 10 verified joins.</p>
          </div>
        </div>

        <div className="tiergrid" data-stagger>
          <div className="tiercard">
            <span className="tiercard-eyebrow">First Officer</span>
            <h3>First five</h3>
            <div>
              <span className="tier-amount-cur">$</span><span className="tier-amount">40</span><span className="tier-amount-cap">per join · both sides</span>
            </div>
            <ul className="tier-list">
              <li><IconCheck /> $40 ramp credit each side</li>
              <li><IconCheck /> Up to 5 referrals at this rate</li>
              <li><IconCheck /> Credit clears in 24 hours</li>
              <li><IconCheck /> Stacks with all rate windows</li>
            </ul>
            <a className="tier-cta" href="#">Active by default</a>
          </div>

          <div className="tiercard tiercard--featured">
            <span className="tiercard-eyebrow">Captain</span>
            <h3>After 5 joins</h3>
            <div>
              <span className="tier-amount-cur" style={{ color: "#F0CB6B" }}>$</span>
              <span className="tier-amount" style={{ color: "#fff" }}>60</span>
              <span className="tier-amount-cap" style={{ color: "rgba(255,255,255,0.6)" }}>per join · both sides</span>
            </div>
            <ul className="tier-list">
              <li><IconCheck /> $60 ramp credit each side</li>
              <li><IconCheck /> Cash-out option on host payouts</li>
              <li><IconCheck /> Quarterly fuel-card top-off</li>
              <li><IconCheck /> First look at new fields</li>
            </ul>
            <a className="tier-cta tier-cta--primary" href="#">Unlock Captain</a>
          </div>

          <div className="tiercard">
            <span className="tiercard-eyebrow">Fleet host</span>
            <h3>Hosts who refer hosts</h3>
            <div>
              <span className="tier-amount-cur">$</span><span className="tier-amount">150</span><span className="tier-amount-cap">per host join</span>
            </div>
            <ul className="tier-list">
              <li><IconCheck /> $150 when a referred host lists a car</li>
              <li><IconCheck /> 1% of their first 90 days of bookings</li>
              <li><IconCheck /> Onboarding kit shipped to them</li>
              <li><IconCheck /> Direct line to host success team</li>
            </ul>
            <a className="tier-cta" href="#">Available to listed hosts</a>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div style={{ background: "var(--color-surface-soft)", border: "1px solid var(--color-hairline)", borderRadius: "var(--radius-md)", padding: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <span className="eyebrow eyebrow--ink">Crew said</span>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.3, margin: "16px 0 24px", color: "var(--color-ink)" }}>
              &ldquo;I shared the code in our base group chat once. By the end of the bid period, four F/As had signed on and I had enough credit to cover a three-night layover in Reno.&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #d8c79a, #8e7029)" }} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--color-ink)" }}>Marisol P.</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-muted)" }}>First officer · KDFW base · 12 referrals</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} data-stagger>
            {[
              { num: "$184k", lbl: "Paid out to crew Q1" },
              { num: "3.8x", lbl: "Crew referrals vs counter ads" },
              { num: "68%", lbl: "Joined via crew invite" },
              { num: "24h", lbl: "Credit clear time" },
            ].map((s) => (
              <div key={s.lbl} style={{ padding: "22px 24px", background: "var(--color-canvas)", border: "1px solid var(--color-hairline)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-ink)" }}>{s.num}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-muted)", marginTop: 6 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section wrap" style={{ paddingTop: 0 }} data-reveal>
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow--ink">Frequently asked</span>
            <h2 className="h-section" style={{ marginTop: 10 }}>Referral fine print, in plain English</h2>
          </div>
        </div>
        <div className="faq">
          {[
            { q: "Who counts as eligible crew?", a: "Any verified airline employee — pilots, flight attendants, mechanics, ground crew, dispatchers — and their direct family members on the same household plan. Verification is the badge upload + airline payroll check we run during signup." },
            { q: "Does credit expire?", a: "Ramp credit sits in your wallet for 18 months from the date it's earned. After that, unredeemed credit converts to a one-time host-payout credit if you list a car, or rolls into a charitable contribution we make to the Aviation Workers Aid Fund." },
            { q: "Can I refer hosts and renters both?", a: "Yes. Renter referrals follow the First Officer / Captain ladder. Host referrals run on the Fleet host program (only available once you're a listed host yourself). The two count separately and stack." },
            { q: "What if my referral cancels their trip?", a: "Credit is held until 24 hours after trip start. If the referred crew cancels before pickup, no credit lands — for either side. If they cancel mid-trip, credit stays. Hosts confirming pickup is what triggers payout." },
            { q: "How do I cash out instead of taking ramp credit?", a: "Captain tier and above unlocks cash-out to your host-payout account. Funds clear in 3–5 business days. Below Captain, ramp credit is the only option — applies to any booking, no field restriction." },
            { q: "Is there a cap on how many people I can refer?", a: "No cap. The Captain rate kicks in after five verified joins and stays there for the lifetime of your account. The Fleet host program has no cap either — the more hosts you bring, the more royalty time you accrue." },
          ].map((item) => (
            <details className="faqitem" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 80 }} data-reveal>
        <div className="cta-final">
          <div>
            <span className="eyebrow eyebrow--ink">Ready to share</span>
            <h2 style={{ marginTop: 10 }}>Print the lounge card.<br /><em className="editorial-italic">Hand it over.</em></h2>
          </div>
          <div className="cta-final-actions">
            <a className="btn-secondary" href="#">Download lounge PDF</a>
            <a className="btn-primary" href="#" data-magnet data-magnet-strength="14">Get my invite code</a>
          </div>
        </div>
      </section>
    </main>
  );
}
