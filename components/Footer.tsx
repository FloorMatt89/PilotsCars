import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-pilot.png" alt="Pilot Cars" />
          <p className="footer-tagline">
            Wheels down. Drive away. A closed marketplace for verified airline
            crew — verified hosts, crew rates, no rental-counter line.
          </p>
          <div className="social-row" style={{ marginTop: 18 }}>
            <a href="#" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 3h3l-7.5 8.6L22 21h-6.4l-5-6.3L4.8 21H2l8-9.2L2 3h6.5l4.5 5.8L18 3z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h4v4H4zm0 6h4v10H4zm6 0h4v1.6c.7-1.1 2-1.9 3.6-1.9 3 0 4.4 1.7 4.4 5V20h-4v-4.6c0-1.4-.5-2.4-1.8-2.4-1.3 0-2.2.9-2.2 2.4V20h-4V10z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <div className="footer-col-head">Product</div>
          <ul className="footer-links">
            <li><Link className="footer-link" href="/vehicles">Browse cars</Link></li>
            <li><Link className="footer-link" href="/referrals">Referrals</Link></li>
            <li><a className="footer-link" href="#">List your car</a></li>
            <li><a className="footer-link" href="#">Crew rates</a></li>
            <li><a className="footer-link" href="#">Gift card</a></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-head">Trust</div>
          <ul className="footer-links">
            <li><a className="footer-link" href="#">Crew verification</a></li>
            <li><a className="footer-link" href="#">Insurance</a></li>
            <li><a className="footer-link" href="#">Safety briefing</a></li>
            <li><a className="footer-link" href="#">Host FAQ</a></li>
            <li><a className="footer-link" href="#">Renter FAQ</a></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-head">Company</div>
          <ul className="footer-links">
            <li><Link className="footer-link" href="/about">About</Link></li>
            <li><a className="footer-link" href="#">Founding crew</a></li>
            <li><a className="footer-link" href="#">Press kit</a></li>
            <li><a className="footer-link" href="#">Careers</a></li>
            <li><Link className="footer-link" href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-news">
          <div className="footer-col-head">The Preflight</div>
          <p className="footer-tagline" style={{ marginBottom: 14 }}>
            Once a month: new fields, rate windows, founding-crew memos.
          </p>
          <div className="footer-news-row">
            <input type="email" placeholder="captain@airline.com" />
            <button type="button">Subscribe</button>
          </div>
          <p className="footer-news-fine">Crew badge optional. We won&apos;t share your address.</p>
        </div>
      </div>

      <div className="legal-band">
        <span>© 2026 Pilot Cars by America Car Rental · A closed marketplace for verified airline crew</span>
        <span className="legal-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
          <a href="#">Sitemap</a>
        </span>
      </div>
    </footer>
  );
}
