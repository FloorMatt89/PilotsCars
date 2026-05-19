"use client";

export default function ContactForm() {
  return (
    <form className="contactform" onSubmit={(e) => e.preventDefault()}>
      <span className="eyebrow eyebrow--ink">Send a message</span>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          margin: "8px 0 24px",
          color: "var(--color-ink)",
        }}
      >
        We&apos;ll route it to the right crew.
      </h2>

      <div className="formgrid">
        <div className="formrow">
          <div className="formfield">
            <label>First name</label>
            <input type="text" placeholder="David" />
          </div>
          <div className="formfield">
            <label>Last name</label>
            <input type="text" placeholder="Reyes" />
          </div>
        </div>

        <div className="formfield">
          <label>Crew email</label>
          <input type="email" placeholder="captain@airline.com" />
        </div>

        <div className="formrow">
          <div className="formfield">
            <label>Airline</label>
            <select defaultValue="">
              <option value="" disabled>Select…</option>
              <option>United</option><option>Delta</option><option>American</option>
              <option>Southwest</option><option>Alaska</option><option>JetBlue</option>
              <option>Frontier</option><option>Other</option>
            </select>
          </div>
          <div className="formfield">
            <label>Role</label>
            <select defaultValue="">
              <option value="" disabled>Select…</option>
              <option>Pilot</option><option>Flight attendant</option><option>Mechanic</option>
              <option>Dispatcher</option><option>Ground crew</option><option>Family member</option>
            </select>
          </div>
        </div>

        <div className="formfield">
          <label>What can we help with?</label>
          <select defaultValue="">
            <option value="" disabled>Select a topic…</option>
            <option>Booking question</option><option>Host my car</option>
            <option>Verification issue</option><option>Refer / referral payouts</option>
            <option>Partnership inquiry</option><option>Press / media</option>
            <option>Something else</option>
          </select>
        </div>

        <div className="formfield">
          <label>Message</label>
          <textarea placeholder="Tell us what's going on. If it's about a specific trip, include the booking ID." />
        </div>

        <label
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--color-muted)",
          }}
        >
          <input
            type="checkbox"
            defaultChecked
            style={{ marginTop: 3, accentColor: "var(--color-primary)" }}
          />
          <span>I&apos;d like to receive the monthly Preflight memo. Unsubscribe anytime.</span>
        </label>

        <div className="formfoot">
          <p className="body-sm">
            By submitting, you agree to our <a href="#" className="legal">crew terms</a>. We won&apos;t share your address.
          </p>
          <button
            className="btn-primary"
            type="submit"
            data-magnet
            data-magnet-strength="10"
          >
            Send message
          </button>
        </div>
      </div>
    </form>
  );
}
